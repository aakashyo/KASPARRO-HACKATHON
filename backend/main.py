import asyncio
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.models.schemas import AnalyzeRequest, AnalysisResponse, StoreScore, ProductAnalysis, AIPerception, GapAnalysis, ImpactEstimate, OptimizedFixes, QuerySimulationResponse, MerchantIntent
from backend.services.shopify_client import ShopifyClient
from backend.services.ai_simulator import AISimulator
from backend.services.intent_extractor import IntentExtractor
from backend.services.gap_engine import GapEngine
from backend.services.impact_estimator import ImpactEstimator
from backend.services.query_simulator import QuerySimulator
from backend.services.analyzer import Scorer
from backend.utils.llm_client import get_llm_client
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Perception Intelligence Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_store(request: AnalyzeRequest):
    store_url = request.store_url or os.getenv("SHOPIFY_STORE_URL")
    access_token = request.access_token or os.getenv("SHOPIFY_ADMIN_TOKEN")
    
    if not store_url or not access_token:
        raise HTTPException(status_code=400, detail="Store URL and Access Token are required.")
    
    llm_client = get_llm_client(GROQ_API_KEY)
    shopify = ShopifyClient(store_url, access_token)
    simulator = AISimulator(llm_client)
    intent_extractor = IntentExtractor(llm_client)
    gap_engine = GapEngine(llm_client)
    impact_estimator = ImpactEstimator(llm_client)
    query_simulator_svc = QuerySimulator(llm_client)
    
    try:
        # 1. Fetch Data
        products_raw = await shopify.fetch_products()
        policies = await shopify.fetch_policies()
        pages = await shopify.fetch_pages()
        
        # 2. Parallel Deep Analysis for each product (limited concurrency to avoid rate limits)
        semaphore = asyncio.Semaphore(2)
        analyzed_products = []
        
        async def analyze_single_product(p):
            async with semaphore:
                # Phase A: extraction and simulation can run in parallel
                intent_task = intent_extractor.extract(p)
                perception_task = simulator.simulate_perception(p)
            
            intent_data, perception_data = await asyncio.gather(intent_task, perception_task)
            
            # Phase B: gap analysis needs both results
            gaps_data = await gap_engine.analyze(intent_data, perception_data)
            
            # Phase C: impact and fixes need gap results
            impact_task = impact_estimator.estimate(gaps_data)
            fixes_task = simulator.generate_optimized_fixes(p, gaps_data)
            
            impact_data, fixes_data = await asyncio.gather(impact_task, fixes_task)
            
            return ProductAnalysis(
                id=p["id"],
                title=p["title"],
                handle=p["handle"],
                original_data=p,
                intent=MerchantIntent(**intent_data),
                ai_perception=AIPerception(**perception_data),
                gaps=GapAnalysis(**gaps_data),
                impact=ImpactEstimate(**impact_data),
                fixes=OptimizedFixes(**fixes_data)
            )

        # Process top 3 products in parallel for demo speed
        analysis_tasks = [analyze_single_product(p) for p in products_raw]
        analyzed_products = await asyncio.gather(*analysis_tasks)
            
        # 3. Calculate Scores
        # Prepare data for scorer (it expects structured results to generate reasonings)
        scorer_input = [p.model_dump() for p in analyzed_products]
        scores_raw = Scorer.calculate_scores(scorer_input, policies, pages)
        
        # 4. Global Query Simulation (Static Example for demo)
        default_query = "Best skincare product under ₹2000 for oily skin"
        query_sim_data = await query_simulator_svc.simulate(default_query, scorer_input)
        
        return AnalysisResponse(
            store_score=StoreScore(**scores_raw),
            products=analyzed_products,
            query_simulation=QuerySimulationResponse(**query_sim_data)
        )
        
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
