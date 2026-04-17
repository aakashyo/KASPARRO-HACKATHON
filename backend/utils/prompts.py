from typing import Dict, List, Any

# STAGE 1: FAST SCAN
def get_fast_scan_prompt(title: str, description: str, tags: str) -> Dict[str, str]:
    return {
        "system": "You are a high-speed AI diagnostic engine. Quickly assess a product's search visibility for AI agents. Return ONLY valid JSON.",
        "user": f"""Quickly scan this product for AI recommendation readiness:
TITLE: {title}
DESCRIPTION: {description}
TAGS: {tags}

Format:
{{
  "quick_score": 0-100,
  "severity": 1-10,
  "basic_gap": "Short summary of the biggest issue",
  "priority": "low | medium | high"
}}"""
    }

# STAGE 2: DEEP AUDIT (Merged Call 1: Intent + Perception)
def get_intent_and_perception_prompt(title: str, description: str, tags: str) -> Dict[str, str]:
    return {
        "system": "You are a senior AI product architect. Step 1: Extract deep merchant intent. Step 2: Simulate strict AI agent perception. Return ONLY valid JSON.",
        "user": f"""DEEP ANALYSIS for:
TITLE: {title}
DESCRIPTION: {description}
TAGS: {tags}

Format:
{{
  "intent": {{
    "category": "",
    "target_user": "",
    "use_case": "",
    "price_segment": "",
    "key_attributes": [],
    "important_keywords": []
  }},
  "ai_perception": {{
    "summary": "",
    "target_user": "",
    "key_benefits": [],
    "confidence": 0-1,
    "recommendation": "yes | no",
    "reason": "Immediate answer",
    "detailed_reasoning": "Step-by-step reasoning logs (3-4 lines)"
  }}
}}"""
    }

# STAGE 2: DEEP AUDIT (Merged Call 2: Gap + Impact)
def get_gap_and_impact_prompt(intent_json: str, perception_json: str) -> Dict[str, str]:
    return {
        "system": "You are an AI logic engine. Compare Intent vs Perception to find gaps, then estimate the impact of fixing them. Return ONLY valid JSON.",
        "user": f"""DATA:
INTENT: {intent_json}
PERCEPTION: {perception_json}

Format:
{{
  "gaps": {{
    "missing_attributes": [],
    "misinterpretations": [],
    "confidence_drop_reasons": [],
    "insight": "Executive summary",
    "severity": 1-10,
    "impact_level": "low | medium | high",
    "detailed_explanation": "WHY this gap affects AI recommendations (2-3 lines)"
  }},
  "impact": {{
    "before_score": 0-1,
    "after_score": 0-1,
    "improvement_percentage": "",
    "reason": "Short logic",
    "detailed_impact": "Explain HOW fixes improve ranking confidence (2-3 lines)"
  }}
}}"""
    }

# STAGE 2: DEEP AUDIT (Call 3: Fix Generator)
def get_fix_prompt(title: str, description: str, gap_json: str) -> Dict[str, str]:
    return {
        "system": "You are an AI SEO copywriter. Generate technical fixes to optimize for AI agents. Return ONLY valid JSON.",
        "user": f"""PRODUCT: {title}
GAPS: {gap_json}

Format:
{{
  "improved_description": "",
  "added_keywords": [],
  "structured_tags": [],
  "faq_suggestions": [{{ "question": "", "answer": "" }}],
  "explanation": "WHY these fixes improve AI understanding"
}}"""
    }

# Global Query Simulator (Remains similar)
def get_query_prompt(query: str, products_json: str) -> Dict[str, str]:
    return {
        "system": "You are an AI shopping agent. Rank products by query relevance. Return ONLY valid JSON.",
        "user": f"""QUERY: {query}
PRODUCTS: {products_json}

Format:
{{
  "ranked_results": [{{ "rank": 1, "product_id": "", "match_score": 0, "reason": "" }}],
  "rejected_products": [{{ "product_id": "", "reason": "" }}]
}}"""
    }
