from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Literal, Any

# Requests
class AnalyzeRequest(BaseModel):
    store_url: Optional[str] = None
    access_token: Optional[str] = None

# Intelligence Models
class MerchantIntent(BaseModel):
    category: Optional[str] = "General"
    target_user: Optional[str] = "General Consumer"
    use_case: Optional[str] = "General Usage"
    price_segment: Optional[str] = "Mid-range"
    key_attributes: List[str] = []
    important_keywords: List[str] = []

class AIPerception(BaseModel):
    summary: Optional[str] = "Product information partially parsed."
    target_user: Optional[str] = "AI Agents"
    key_benefits: List[str] = []
    confidence: Optional[float] = 0.5
    recommendation: Optional[str] = "yes"
    reason: Optional[str] = "Standard indexing applied."
    detailed_reasoning: Optional[str] = ""

class GapAnalysis(BaseModel):
    missing_attributes: List[str] = []
    misinterpretations: List[str] = []
    confidence_drop_reasons: List[str] = []
    insight: Optional[str] = "Analysis complete."
    severity: Optional[int] = 5
    impact_level: Optional[str] = "medium"
    detailed_explanation: Optional[str] = ""

class ImpactEstimate(BaseModel):
    before_score: Optional[float] = 0.4
    after_score: Optional[float] = 0.7
    improvement_percentage: Optional[str] = "0%"
    reason: Optional[str] = "Product utility clarified for AI agents."
    detailed_impact: Optional[str] = ""

class OptimizedFixes(BaseModel):
    improved_description: Optional[str] = ""
    added_keywords: List[str] = []
    structured_tags: List[Any] = []
    faq_suggestions: List[Any] = []
    explanation: Optional[str] = ""

# Stage-specific models
class QuickScanResult(BaseModel):
    quick_score: int = 50
    severity: int = 5
    basic_gap: str = "Analysis pending"
    priority: Literal["low", "medium", "high"] = "medium"

class DeepAuditResult(BaseModel):
    intent: Optional[MerchantIntent] = Field(default_factory=MerchantIntent)
    ai_perception: Optional[AIPerception] = Field(default_factory=AIPerception)
    gaps: Optional[GapAnalysis] = Field(default_factory=GapAnalysis)
    impact: Optional[ImpactEstimate] = Field(default_factory=ImpactEstimate)
    fixes: Optional[OptimizedFixes] = Field(default_factory=OptimizedFixes)
    stage: Optional[str] = "queued"

# Main Response
class ProductAnalysis(BaseModel):
    id: str
    title: str
    handle: str
    original_data: Dict = {}
    scan_quick: QuickScanResult = Field(default_factory=QuickScanResult)
    audit_deep: Optional[DeepAuditResult] = None
    
    # Audit status for UI
    is_audited: bool = False
    scan_mode: str = "⚡ Quick Scan" # Default to quick scan

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
