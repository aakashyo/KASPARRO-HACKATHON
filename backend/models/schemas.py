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
    detailed_reasoning: Optional[str] = None

class GapAnalysis(BaseModel):
    missing_attributes: List[str]
    misinterpretations: List[str]
    confidence_drop_reasons: List[str]
    insight: str
    severity: int
    impact_level: Literal["low", "medium", "high"]
    detailed_explanation: Optional[str] = None

class ImpactEstimate(BaseModel):
    before_score: float
    after_score: float
    improvement_percentage: str
    reason: str
    detailed_impact: Optional[str] = None

class OptimizedFixes(BaseModel):
    improved_description: str
    added_keywords: List[str]
    structured_tags: List[str]
    faq_suggestions: List[Dict[str, str]]
    explanation: Optional[str] = None

# Stage-specific models
class QuickScanResult(BaseModel):
    quick_score: int
    severity: int
    basic_gap: str
    priority: Literal["low", "medium", "high"]

class DeepAuditResult(BaseModel):
    intent: Optional[MerchantIntent] = None
    ai_perception: Optional[AIPerception] = None
    gaps: Optional[GapAnalysis] = None
    impact: Optional[ImpactEstimate] = None
    fixes: Optional[OptimizedFixes] = None
    stage: Optional[str] = "queued"

# Main Response
class ProductAnalysis(BaseModel):
    id: str
    title: str
    handle: str
    original_data: Dict
    scan_quick: QuickScanResult
    audit_deep: Optional[DeepAuditResult] = None
    
    # Audit status for UI
    is_audited: bool = False

class DimensionScoreDetails(BaseModel):
    score: int
    reason: str

class StoreScore(BaseModel):
    overall_score: int
    dimension_scores: Dict[str, DimensionScoreDetails]

class QuerySimulationResult(BaseModel):
    query: str
    match_score: int
    reason: str

class QuerySimulationResponse(BaseModel):
    default_query: str
    results: List[QuerySimulationResult]

class AnalysisResponse(BaseModel):
    store_score: StoreScore
    products: List[ProductAnalysis]
    query_simulation: Optional[QuerySimulationResponse] = None
