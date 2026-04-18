import json
from backend.utils.llm_client import safe_llm_call
from backend.utils.prompts import get_intent_extraction_prompt
from backend.utils.json_cleaner import strip_code_fences, safe_json_parse, clean_intent_response
from backend.models.schemas import MerchantIntent

class IntentExtractor:
    def __init__(self, client=None):
        self.client = client

    async def extract(self, product_data: dict):
        prompts = get_intent_extraction_prompt(
            product_data.get("title", ""),
            product_data.get("description", ""),
            ", ".join(product_data.get("tags", [])) if isinstance(product_data.get("tags"), list) else str(product_data.get("tags", ""))
        )
        
        # Mandatory Sanitization Pipeline
        raw_json = await safe_llm_call(prompts, task_type="default")
        # safe_llm_call already does strip_code_fences and safe_json_parse
        
        clean_data = clean_intent_response(raw_json)
        
        try:
            return MerchantIntent(**clean_data).model_dump()
        except Exception:
            return MerchantIntent().model_dump()
