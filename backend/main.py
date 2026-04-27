import asyncio
import json
import os
import hashlib
import re
from typing import AsyncGenerator

from dotenv import load_dotenv
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(env_path)

from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

from backend.models.schemas import AnalyzeRequest, StoreScore, ProductAnalysis, QuickScanResult, DeepAuditResult, QueryRequest, PushFixesRequest, PushBulkFixesRequest, PushFAQRequest, ConfigResponse
from backend.services.shopify_client import ShopifyClient
from backend.services.pipeline import AnalysisPipeline
from backend.services.analyzer import Scorer
from backend.utils.llm_client import get_llm_client
from backend.utils.policy_guardrail import validate_fixes_against_policies

app = FastAPI(title="Ultra-Low Latency AI Audit Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# In-Memory Cache with specific modes
ANALYSIS_CACHE = {}

def get_cache_key(p: dict, mode: str = "quick") -> str:
    content = f"{p.get('id', '')}{p.get('title', '')}{p.get('updated_at', '')}{mode}"
    return hashlib.md5(content.encode()).hexdigest()

def _normalize_faq_entry(item):
    if isinstance(item, dict):
        question = str(item.get("question", "")).strip()
        answer = str(item.get("answer", "")).strip()
        if question:
            return {
                "question": question,
                "answer": answer or "See product details for more information."
            }
        return None

    if isinstance(item, str):
        text = item.strip()
        if not text:
            return None

        if "A:" in text:
            question_part, answer_part = text.split("A:", 1)
            question = question_part.replace("Q:", "").strip()
            answer = answer_part.strip()
        else:
            question = text.replace("Q:", "").strip()
            answer = "See product details for more information."

        if question:
            return {"question": question, "answer": answer}

    return None

def _faq_signature(question: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", question.lower()).strip()

@app.post("/analyze")
async def analyze_store(request: AnalyzeRequest):
    store_url = request.store_url or os.getenv("SHOPIFY_STORE_URL")
    access_token = request.access_token or os.getenv("SHOPIFY_ADMIN_TOKEN")
    
    if not store_url or not access_token:
        raise HTTPException(status_code=400, detail="Store URL and Access Token are required.")
    
    async def event_generator() -> AsyncGenerator[str, None]:
        shopify = ShopifyClient(store_url, access_token)
        pipeline = AnalysisPipeline()
        
        try:
            # 1. Initialization
            yield f"data: {json.dumps({'type': 'progress', 'status': 'initializing', 'message': 'Connecting to store catalog...', 'progress_percent': 5})}\n\n"
            products_raw = await shopify.fetch_products()
            policies = await shopify.fetch_policies()
            pages = await shopify.fetch_pages()
            
            total_products = len(products_raw)
            if total_products == 0:
                yield f"data: {json.dumps({'type': 'complete', 'store_score': {}, 'processed': 0, 'audited': 0, 'progress_percent': 100, 'message': 'No products found in store catalog.'})}\n\n"
                return

            yield f"data: {json.dumps({'type': 'progress', 'status': 'scanning', 'total': total_products, 'message': f'Inventory found. Running high-speed diagnostic...', 'progress_percent': 10})}\n\n"
            
            # --- STAGE 1: INSTANT RULE-BASED SCAN ---
            all_analyzed = []
            for i, p in enumerate(products_raw):
                cache_key = get_cache_key(p, "quick")
                if cache_key in ANALYSIS_CACHE:
                    scan_data = ANALYSIS_CACHE[cache_key]
                else:
                    scan_data = await pipeline.fast_scan(p)
                    ANALYSIS_CACHE[cache_key] = scan_data
                
                pa = ProductAnalysis(
                    id=str(p["id"]), title=p["title"], handle=p["handle"],
                    price=p.get("price", "0.00"),
                    original_data=p, scan_quick=QuickScanResult(**scan_data),
                    is_audited=False, scan_mode="⚡ Quick Scan"
                )
                all_analyzed.append(pa)
                
                # Stream results immediately
                yield f"data: {json.dumps({'type': 'product', 'data': pa.model_dump()})}\n\n"
                
                # Update progress
                progress_pct = 10 + (i / total_products * 40) # Quick scan counts for 40% of progress
                yield f"data: {json.dumps({'type': 'progress', 'status': 'scanning', 'processed': i+1, 'total': total_products, 'progress_percent': progress_pct})}\n\n"

            # 2. Process Full Catalog Super Audit
            to_audit = all_analyzed
            
            # Strict Concurrency to stay under rate limits (bumped to 3 for hackathon performance)
            semaphore = asyncio.Semaphore(3)

            async def run_super_audit(pa: ProductAnalysis, store_policies: list) -> ProductAnalysis:
                cache_key = get_cache_key(pa.original_data, "super_deep")
                if cache_key in ANALYSIS_CACHE:
                    cached_data = ANALYSIS_CACHE[cache_key]
                    if isinstance(cached_data, dict) and "audit" in cached_data:
                        audit_data = cached_data.get("audit", {})
                        pa.guardrail = cached_data.get("guardrail")
                    else:
                        audit_data = cached_data
                    pa.audit_deep = DeepAuditResult(**audit_data)
                    pa.is_audited = True
                    pa.scan_mode = "Deep Audit"
                    return pa
                else:
                    async with semaphore:
                        try:
                            audit_data = await pipeline.execute_super_audit(pa.original_data)
                            
                            fixes = audit_data.get("fixes", {})
                            guardrail = validate_fixes_against_policies(
                                fixes.get("improved_description", ""),
                                fixes.get("structured_tags", []),
                                store_policies
                            )
                            audit_data["guardrail"] = guardrail
                            
                            pa.audit_deep = DeepAuditResult(**{k: v for k, v in audit_data.items() if k != "guardrail"})
                            pa.is_audited = True
                            pa.scan_mode = "Deep Audit"
                            pa.guardrail = guardrail
                            # Cache audit + guardrail together so cache hits restore full data
                            ANALYSIS_CACHE[cache_key] = {
                                "audit": pa.audit_deep.model_dump(),
                                "guardrail": guardrail
                            }
                            return pa
                        except Exception as e:
                            print(f"[Super Audit Error] {pa.title}: {str(e)}")
                            return pa

            yield f"data: {json.dumps({'type': 'progress', 'status': 'auditing', 'total': len(to_audit), 'message': f'Accelerating audit for {len(to_audit)} priority products...', 'progress_percent': 55})}\n\n"

            # Start deep audits as a gathering task
            audit_tasks = [run_super_audit(pa, policies) for pa in to_audit]
            
            # Process deep audits and stream updates as they complete
            completed_audits = 0
            for future in asyncio.as_completed(audit_tasks):
                updated_pa = await future
                completed_audits += 1
                progress_pct = 55 + (completed_audits / len(to_audit) * 40) # Deep audit counts for 40%
                
                yield f"data: {json.dumps({'type': 'progress', 'processed': completed_audits, 'total': len(to_audit), 'message': f'Audited {updated_pa.title}', 'progress_percent': progress_pct})}\n\n"
                yield f"data: {json.dumps({'type': 'product', 'data': updated_pa.model_dump()})}\n\n"

            # 3. Final Global Scoring
            yield f"data: {json.dumps({'type': 'progress', 'status': 'finalizing', 'message': 'Calculating final readiness scores...', 'progress_percent': 95})}\n\n"
            all_results_dict = [p.model_dump() for p in all_analyzed]
            scores_raw = Scorer.calculate_scores(all_results_dict, policies, pages)
            
            # standardized complete event
            yield f"data: {json.dumps({'type': 'complete', 'store_score': scores_raw, 'processed': total_products, 'audited': len(to_audit), 'progress_percent': 100, 'message': 'Low-Latency Audit Cycle Finished.'})}\n\n"

        except Exception as e:
            import traceback
            print(traceback.format_exc())
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@app.post("/query")
async def simulate_query(request: QueryRequest):
    if not request.query or not request.products:
        raise HTTPException(status_code=400, detail="Query and products are required.")
    
    from backend.services.query_simulator import QuerySimulator
    from backend.utils.llm_client import LLMClient
    
    simulator = QuerySimulator(client=LLMClient(api_key=os.getenv("GROQ_API_KEY", "")))
    try:
        results = await simulator.simulate(request.query, request.products)
        return results
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/push-fixes")
async def push_fixes(request: PushFixesRequest):
    store_url = request.store_url or os.getenv("SHOPIFY_STORE_URL")
    access_token = request.access_token or os.getenv("SHOPIFY_ADMIN_TOKEN")
    if not store_url or not access_token:
        raise HTTPException(status_code=400, detail="Store credentials are required.")
    shopify = ShopifyClient(store_url, access_token)
    try:
        result = await shopify.update_product(request.product_id, request.description, request.tags)
        return {"success": True, "product": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/push-bulk")
async def push_bulk_fixes(request: PushBulkFixesRequest):
    store_url = request.store_url or os.getenv("SHOPIFY_STORE_URL")
    access_token = request.access_token or os.getenv("SHOPIFY_ADMIN_TOKEN")
    
    if not store_url or not access_token:
        raise HTTPException(status_code=400, detail="Store credentials are required.")
        
    shopify = ShopifyClient(store_url, access_token)
    
    async def process_single_fix(fix, index):
        try:
            res = await shopify.update_product(fix.product_id, fix.description, fix.tags)
            return {"index": index, "success": True, "id": fix.product_id}
        except Exception as e:
            return {"index": index, "success": False, "id": fix.product_id, "error": str(e)}

    # Run mutations concurrently
    tasks = [process_single_fix(f, i) for i, f in enumerate(request.fixes)]
    results = await asyncio.gather(*tasks)
    
    success_count = sum(1 for r in results if r["success"])
    return {
        "success": True, 
        "total_attempted": len(request.fixes),
        "total_success": success_count,
        "results": results
    }

@app.post("/validate-credentials")
async def validate_credentials(request: AnalyzeRequest):
    store_url = request.store_url or os.getenv("SHOPIFY_STORE_URL")
    access_token = request.access_token or os.getenv("SHOPIFY_ADMIN_TOKEN")
    
    if not store_url or not access_token:
        raise HTTPException(status_code=400, detail="Store URL and Access Token are required.")
    
    shopify = ShopifyClient(store_url, access_token)
    try:
        # Quick test call to verify permissions and connectivity
        await shopify.fetch_products()
        return {"success": True, "message": "Credentials validated successfully.", "sanitized_url": shopify.store_url}
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=401, detail=f"Failed to connect to Shopify: {str(e)}")

@app.get("/config", response_model=ConfigResponse)
async def get_config():
    """Returns default credentials from .env for easy demo setup."""
    return {
        "store_url": os.getenv("SHOPIFY_STORE_URL"),
        "access_token": os.getenv("SHOPIFY_ADMIN_TOKEN")
    }

@app.post("/preview-faq-page")
async def preview_faq_page(request: PushFAQRequest):
    """Generates the HTML content of the AI Discovery Guide for preview."""
    all_faqs = []
    for p in request.products:
        audit = p.get("audit_deep")
        if audit and audit.get("fixes") and audit["fixes"].get("faq_suggestions"):
            all_faqs.extend(audit["fixes"]["faq_suggestions"])
    
    if not all_faqs:
        return {"html": "<p>No FAQs generated yet. Audit your products first.</p>", "count": 0}

    html = "<h2>AI Discovery & Shopping Guide</h2>"
    html += "<p>This guide is optimized for AI agents (like ChatGPT and Llama) to help them represent our products accurately.</p>"
    
    seen_q = set()
    unique_faqs = []
    for f in all_faqs:
        normalized = _normalize_faq_entry(f)
        if not normalized: continue
        signature = _faq_signature(normalized["question"])
        if signature and signature not in seen_q:
            seen_q.add(signature)
            unique_faqs.append(normalized)
            if len(unique_faqs) >= 15: break
            
    for f in unique_faqs:
        html += f"<div style='margin-bottom: 20px;'><strong>Q: {f['question']}</strong><br/>A: {f['answer']}</div>"
        
    html += "<hr/><p><small>Generated by Kasparro RepOptimizer &mdash; AI Integrity Layer</small></p>"
    return {"html": html, "count": len(unique_faqs)}

@app.post("/push-faq-page")
async def push_faq_page(request: PushFAQRequest):
    store_url = request.store_url or os.getenv("SHOPIFY_STORE_URL")
    access_token = request.access_token or os.getenv("SHOPIFY_ADMIN_TOKEN")
    
    if not store_url or not access_token:
        raise HTTPException(status_code=400, detail="Store credentials are required.")
        
    shopify = ShopifyClient(store_url, access_token)
    
    # 1. Consolidate FAQs from all audited products
    all_faqs = []
    for p in request.products:
        audit = p.get("audit_deep")
        if audit and audit.get("fixes") and audit["fixes"].get("faq_suggestions"):
            all_faqs.extend(audit["fixes"]["faq_suggestions"])
    
    if not all_faqs:
        raise HTTPException(status_code=400, detail="No AI-generated FAQs found in the analyzed products.")

    # 2. Format HTML content
    html = "<h2>AI Discovery & Shopping Guide</h2>"
    html += "<p>This guide is optimized for AI agents (like ChatGPT and Llama) to help them represent our products accurately.</p>"
    
    # Use only top 15 unique FAQs to keep page clean
    seen_q = set()
    unique_faqs = []
    for f in all_faqs:
        normalized = _normalize_faq_entry(f)
        if not normalized:
            continue

        signature = _faq_signature(normalized["question"])
        if signature and signature not in seen_q:
            seen_q.add(signature)
            unique_faqs.append(normalized)
            if len(unique_faqs) >= 15: break
            
    for f in unique_faqs:
        html += f"<div style='margin-bottom: 20px;'><strong>Q: {f['question']}</strong><br/>A: {f['answer']}</div>"
        
    html += "<hr/><p><small>Generated by Kasparro RepOptimizer &mdash; AI Integrity Layer</small></p>"
    
    # 3. Push to Shopify
    try:
        result = await shopify.upsert_page(
            title="AI Shopping Assistant Guide",
            content_html=html,
            handle="ai-shopping-guide"
        )
        if not result.get("success"):
            raise Exception(str(result.get("error")))
        return {"success": True, "page": result.get("page")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create Shopify page: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
