import json
from backend.utils.llm_client import safe_llm_call
from backend.utils.prompts import get_ai_simulator_prompt, get_fix_prompt
from backend.utils.json_cleaner import strip_code_fences, safe_json_parse, clean_perception_response, clean_fix_response
from backend.models.schemas import AIPerception, OptimizedFixes

class AISimulator:
    def __init__(self, client=None):
        self.client = client

    async def simulate_perception(self, product_data: dict):
        prompts = get_ai_simulator_prompt(
            product_data.get("title", ""),
            product_data.get("description", ""),
            ", ".join(product_data.get("tags", [])) if isinstance(product_data.get("tags"), list) else str(product_data.get("tags", ""))
        )
        
        raw_json = await safe_llm_call(prompts, task_type="default")
        clean_data = clean_perception_response(raw_json)
        
        try:
            return AIPerception(**clean_data).model_dump()
        except Exception:
            return AIPerception().model_dump()

    async def generate_optimized_fixes(self, product_data: dict, gap_analysis: dict):
        prompts = get_fix_prompt(
            product_data.get("title", ""),
            product_data.get("description", ""),
            json.dumps(gap_analysis)
        )
        
        raw_json = await safe_llm_call(prompts, task_type="default")
        clean_data = clean_fix_response(raw_json)
        
        try:
            return OptimizedFixes(**clean_data).model_dump()
        except Exception:
            return OptimizedFixes().model_dump()
