import json
import asyncio
from backend.utils.llm_client import safe_llm_call
from backend.utils.prompts import get_super_audit_prompt
from backend.services.fast_scan import fast_scan as rule_based_fast_scan
from backend.utils.json_cleaner import (
    clean_full_response, clean_intent_response, clean_perception_response,
    clean_gap_response, clean_impact_response, clean_fix_response,
    validate_final_output
)
from backend.models.schemas import MerchantIntent, AIPerception, GapAnalysis, ImpactEstimate, OptimizedFixes

class AnalysisPipeline:
    def __init__(self, client=None):
        self.client = client

    async def fast_scan(self, product: dict):
        """Rule-based instant scan."""
        return rule_based_fast_scan(product)

    async def execute_super_audit(self, product: dict):
        """
        Consolidated 3-in-1 Deep Audit with mandatory sanitization pipeline.
        """
        prompt_data = get_super_audit_prompt(
            product.get("title", ""),
            product.get("description", ""),
            ", ".join(product.get("tags", [])) if isinstance(product.get("tags"), list) else str(product.get("tags", ""))
        )
        
        # 1. Multi-key safe call with retry and timeout
        parsed_json = await safe_llm_call(prompt_data, task_type="deep")

        # 2. Sequential Sanitization Pipeline
        # strip_code_fences and safe_json_parse are already called inside safe_llm_call
        
        # 3. Structural Cleaning
        parsed = clean_full_response(parsed_json)
        
        # Final validation to ensure key objects exist
        parsed = validate_final_output(parsed)

        # 4. Dimension-specific smoothing
        try:
            intent_data = clean_intent_response(parsed.get("intent", {}))
            intent = MerchantIntent(**intent_data)
        except Exception:
            intent = MerchantIntent()

        try:
            perc_data = clean_perception_response(parsed.get("ai_perception", {}))
            perception = AIPerception(**perc_data)
        except Exception:
            perception = AIPerception()

        try:
            gap_data = clean_gap_response(parsed.get("gaps", {}))
            gaps = GapAnalysis(**gap_data)
        except Exception:
            gaps = GapAnalysis()

        try:
            impact_data = clean_impact_response(parsed.get("impact", {}))
            impact = ImpactEstimate(**impact_data)
        except Exception:
            impact = ImpactEstimate()

        try:
            fix_data = clean_fix_response(parsed.get("fixes", {}))
            fixes = OptimizedFixes(**fix_data)
        except Exception:
            fixes = OptimizedFixes()

        return {
            "intent": intent.model_dump(),
            "ai_perception": perception.model_dump(),
            "gaps": gaps.model_dump(),
            "impact": impact.model_dump(),
            "fixes": fixes.model_dump(),
            "stage": "full_report"
        }
