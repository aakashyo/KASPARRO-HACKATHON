import json
from backend.utils.llm_client import safe_llm_call
from backend.utils.prompts import get_impact_prompt
from backend.utils.json_cleaner import strip_code_fences, safe_json_parse, clean_impact_response
from backend.models.schemas import ImpactEstimate

class ImpactEstimator:
    def __init__(self, client=None):
        self.client = client

    async def estimate(self, gaps: dict):
        prompts = get_impact_prompt(json.dumps(gaps))
        
        # Mandatory Sanitization Pipeline
        raw_json = await safe_llm_call(prompts, task_type="default")
        
        clean_data = clean_impact_response(raw_json)
        
        try:
            return ImpactEstimate(**clean_data).model_dump()
        except Exception:
            return ImpactEstimate().model_dump()
