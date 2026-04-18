import json
from backend.utils.llm_client import LLMClient, safe_llm_call
from backend.utils.prompts import get_gap_and_impact_prompt
from backend.utils.json_cleaner import clean_gap_response, clean_impact_response, clean_full_response
from backend.models.schemas import GapAnalysis, ImpactEstimate

class GapEngine:
    def __init__(self, client: LLMClient):
        self.client = client

    async def analyze(self, intent: dict, perception: dict):
        """
        Runs Gap + Impact analysis with total sanitization and zero-failure flow.
        """
        prompts = get_gap_and_impact_prompt(json.dumps(intent), json.dumps(perception))
        
        raw_text = await safe_llm_call(
            self.client.generate_json_response(prompts["system"], prompts["user"])
        )

        if isinstance(raw_text, dict) and raw_text.get("fallback"):
            return self._get_fallback()

        try:
            # Normalize top-level structure
            parsed = clean_full_response(raw_text)
            
            # Clean section-specific data
            gap_data = clean_gap_response(parsed.get("gaps", {}))
            impact_data = clean_impact_response(parsed.get("impact", {}))

            # Validate via Pydantic model construction with defaults
            try:
                gaps = GapAnalysis(**gap_data)
            except Exception:
                gaps = GapAnalysis()

            try:
                impact = ImpactEstimate(**impact_data)
            except Exception:
                impact = ImpactEstimate()

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
            "gaps": GapAnalysis(insight="AI Perception Gap: Content lacks specific technical context expected by agents.").model_dump(),
            "impact": ImpactEstimate().model_dump()
        }
