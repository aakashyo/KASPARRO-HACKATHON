import json
from backend.utils.llm_client import safe_llm_call
from backend.utils.prompts import get_gap_and_impact_prompt
from backend.utils.json_cleaner import clean_gap_response, clean_impact_response, clean_full_response, DEFAULT_GAP
from backend.models.schemas import GapAnalysis, ImpactEstimate

class GapEngine:
    def __init__(self, client=None):
        self.client = client

    async def analyze(self, intent: dict, perception: dict, original_product: dict = None):
        """
        Runs Gap + Impact analysis using a Hybrid Deterministic + LLM approach for zero-failure flow.
        """
        deterministic_gaps = []
        if original_product:
            if not original_product.get("vendor"): deterministic_gaps.append("Missing Vendor")
            if not original_product.get("tags"): deterministic_gaps.append("Missing Tags")
            desc = original_product.get("description", "")
            if len(desc) < 50: deterministic_gaps.append("Extremely short description")
        
        hybrid_context = f"Deterministic Gaps Found: {', '.join(deterministic_gaps)}\n\n" if deterministic_gaps else ""
        
        prompts = get_gap_and_impact_prompt(json.dumps(intent), hybrid_context + json.dumps(perception))
        
        # Mandatory Sanitization Pipeline
        raw_json = await safe_llm_call(prompts, task_type="default")
        
        # Structure Cleaning
        parsed = clean_full_response(raw_json)
        
        try:
            gap_data = clean_gap_response(parsed.get("gaps", {}))
            impact_data = clean_impact_response(parsed.get("impact", {}))

            gaps = GapAnalysis(**gap_data)
            impact = ImpactEstimate(**impact_data)

            return {
                "gaps": gaps.model_dump(),
                "impact": impact.model_dump()
            }
        except Exception as e:
            print(f"[GapEngine Error] {str(e)}")
            return self._get_fallback()

    def _get_fallback(self):
        """Total fallback structure as a last resort."""
        return {
            "gaps": DEFAULT_GAP,
            "impact": ImpactEstimate().model_dump()
        }
