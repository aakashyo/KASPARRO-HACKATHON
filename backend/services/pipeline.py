import json
from backend.utils.llm_client import LLMClient
from backend.utils.prompts import get_fast_scan_prompt, get_intent_and_perception_prompt, get_gap_and_impact_prompt, get_fix_prompt

class AnalysisPipeline:
    def __init__(self, client: LLMClient):
        self.client = client

    async def fast_scan(self, product: dict):
        prompts = get_fast_scan_prompt(
            product.get("title", ""),
            product.get("description", ""),
            ", ".join(product.get("tags", [])) if isinstance(product.get("tags"), list) else str(product.get("tags", ""))
        )
        return await self.client.generate_json_response(prompts["system"], prompts["user"])

    async def deep_audit_stage_1(self, product: dict):
        """Merged: Intent + Perception"""
        prompts = get_intent_and_perception_prompt(
            product.get("title", ""),
            product.get("description", ""),
            ", ".join(product.get("tags", [])) if isinstance(product.get("tags"), list) else str(product.get("tags", ""))
        )
        return await self.client.generate_json_response(prompts["system"], prompts["user"])

    async def deep_audit_stage_2(self, intent_data: dict, perception_data: dict):
        """Merged: Gap + Impact"""
        prompts = get_gap_and_impact_prompt(
            json.dumps(intent_data),
            json.dumps(perception_data)
        )
        return await self.client.generate_json_response(prompts["system"], prompts["user"])

    async def deep_audit_stage_3(self, product: dict, gap_data: dict):
        """Fix Generator"""
        prompts = get_fix_prompt(
            product.get("title", ""),
            product.get("description", ""),
            json.dumps(gap_data)
        )
        return await self.client.generate_json_response(prompts["system"], prompts["user"])
