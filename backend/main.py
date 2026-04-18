import asyncio
import json
import os
import hashlib
from typing import AsyncGenerator

from dotenv import load_dotenv
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(env_path)

from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

from backend.models.schemas import AnalyzeRequest, StoreScore, ProductAnalysis, QuickScanResult, DeepAuditResult
from backend.services.shopify_client import ShopifyClient
from backend.services.pipeline import AnalysisPipeline
from backend.services.analyzer import Scorer
from backend.utils.llm_client import get_llm_client

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
            
            # Strict Concurrency to stay under rate limits
            semaphore = asyncio.Semaphore(1)

            async def run_super_audit(pa: ProductAnalysis) -> ProductAnalysis:
                cache_key = get_cache_key(pa.original_data, "super_deep")
                if cache_key in ANALYSIS_CACHE:
                    audit_data = ANALYSIS_CACHE[cache_key]
                    pa.audit_deep = DeepAuditResult(**audit_data)
                    pa.is_audited = True
                    pa.scan_mode = "🧠 Deep Audit"
                    return pa
                else:
                    async with semaphore:
                        try:
                            # 3-in-1 consolidated AI call
                            audit_data = await pipeline.execute_super_audit(pa.original_data)
                            pa.audit_deep = DeepAuditResult(**audit_data)
                            pa.is_audited = True
                            pa.scan_mode = "🧠 Deep Audit"
                            ANALYSIS_CACHE[cache_key] = pa.audit_deep.model_dump()
                            return pa
                        except Exception as e:
                            print(f"[Super Audit Error] {pa.title}: {str(e)}")
                            return pa

            yield f"data: {json.dumps({'type': 'progress', 'status': 'auditing', 'total': len(to_audit), 'message': f'Accelerating audit for {len(to_audit)} priority products...', 'progress_percent': 55})}\n\n"

            # Start deep audits as a gathering task
            audit_tasks = [run_super_audit(pa) for pa in to_audit]
            
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
