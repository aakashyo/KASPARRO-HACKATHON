from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Literal

# Requests
class AnalyzeRequest(BaseModel):
    store_url: Optional[str] = None
    access_token: Optional[str] = None

# Intelligence Models
class MerchantIntent(BaseModel):
    category: str
    target_user: str
    use_case: str
    price_segment: str
    key_attributes: List[str]
    important_keywords: List[str]

class AIPerception(BaseModel):
    summary: str
    target_user: str
    key_benefits: List[str]
    confidence: float
    recommendation: Literal["yes", "no"]
    reason: str

class GapAnalysis(BaseModel):
    missing_attributes: List[str]
    misinterpretations: List[str]
    confidence_drop_reasons: List[str]
    severity: int
    impact_level: Literal["low", "medium", "high"]

class ImpactEstimate(BaseModel):
    before_score: float
    after_score: float
    improvement_percentage: str
    reason: str

class OptimizedFixes(BaseModel):
    improved_description: str
    added_keywords: List[str]
    structured_tags: List[str]
    faq_suggestions: List[Dict[str, str]]

# Query Simulation
class RankedResult(BaseModel):
    rank: int
    product_id: str
    match_score: float
    reason: str

class RejectedProduct(BaseModel):
    product_id: str
    reason: str

class QuerySimulationResponse(BaseModel):
    ranked_results: List[RankedResult]
    rejected_products: List[RejectedProduct]

# Main Response
class ProductAnalysis(BaseModel):
    id: str
    title: str
    handle: str
    original_data: Dict
    intent: MerchantIntent
    ai_perception: AIPerception
    gaps: GapAnalysis
    impact: ImpactEstimate
    fixes: OptimizedFixes

class DimensionScoreDetails(BaseModel):
    score: int
    reason: str

class StoreScore(BaseModel):
    overall_score: int
    dimension_scores: Dict[str, DimensionScoreDetails]

class AnalysisResponse(BaseModel):
    store_score: StoreScore
    products: List[ProductAnalysis]
    query_simulation: Optional[QuerySimulationResponse] = None
