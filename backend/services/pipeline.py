import json
from backend.utils.llm_client import LLMClient, safe_llm_call
from backend.utils.prompts import get_fast_scan_prompt, get_super_audit_prompt
from backend.services.fast_scan import fast_scan as rule_based_fast_scan
from backend.utils.json_cleaner import (
    clean_full_response, clean_intent_response, clean_perception_response,
    clean_gap_response, clean_impact_response, clean_fix_response
)
from backend.models.schemas import MerchantIntent, AIPerception, GapAnalysis, ImpactEstimate, OptimizedFixes

class AnalysisPipeline:
    def __init__(self, client: LLMClient):
        self.client = client

    async def fast_scan(self, product: dict):
        """Rule-based instant scan."""
        return rule_based_fast_scan(product)

    async def execute_super_audit(self, product: dict):
        """
        Consolidated 3-in-1 Deep Audit.
        Reduces latency by 66% by merging stages into a single LLM call.
        """
        prompt_data = get_super_audit_prompt(
            product.get("title", ""),
            product.get("description", ""),
            ", ".join(product.get("tags", [])) if isinstance(product.get("tags"), list) else str(product.get("tags", ""))
        )
        
        # 1. Single LLM Round-trip
        raw_text = await safe_llm_call(
            self.client.generate_json_response(prompt_data["system"], prompt_data["user"])
        )

        # 2. Check for fallback
        if isinstance(raw_text, dict) and raw_text.get("fallback"):
            return self._get_fallback_audit()

        # 3. Comprehensive Sanitize & Normalization
        parsed = clean_full_response(raw_text)
        
        # Intent
        intent_data = clean_intent_response(parsed.get("intent", {}))
        try:
            intent = MerchantIntent(**intent_data)
        except Exception:
            intent = MerchantIntent()

        # Perception
        perc_data = clean_perception_response(parsed.get("ai_perception") or parsed.get("perception", {}))
        try:
            perception = AIPerception(**perc_data)
        except Exception:
            perception = AIPerception()

        # Gaps
        gap_data = clean_gap_response(parsed.get("gaps", {}))
        try:
            gaps = GapAnalysis(**gap_data)
        except Exception:
            gaps = GapAnalysis()

        # Impact
        impact_data = clean_impact_response(parsed.get("impact", {}))
        try:
            impact = ImpactEstimate(**impact_data)
        except Exception:
            impact = ImpactEstimate()

        # Fixes
        fix_data = clean_fix_response(parsed.get("fixes", {}))
        try:
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

    def _get_fallback_audit(self):
        return {
            "intent": MerchantIntent().model_dump(),
            "ai_perception": AIPerception(summary="Product analysis fallback.").model_dump(),
            "gaps": GapAnalysis(insight="AI Perception Gap: Delayed processing fallback.").model_dump(),
            "impact": ImpactEstimate().model_dump(),
            "fixes": OptimizedFixes().model_dump(),
            "stage": "analysis_complete"
        }
