from typing import Dict, List, Any

def get_intent_extraction_prompt(title: str, description: str, tags: str) -> Dict[str, str]:
    return {
        "system": "You are an expert e-commerce product analyst. Your job is to extract structured merchant intent from raw product data so that an AI shopping agent can clearly understand it. You must return ONLY valid JSON. Do not include any explanation outside JSON.",
        "user": f"""Extract structured intent from the following product:
TITLE: {title}
DESCRIPTION: {description}
TAGS: {tags}

Return JSON in this exact format:
{{
  "category": "",
  "target_user": "",
  "use_case": "",
  "price_segment": "",
  "key_attributes": [],
  "important_keywords": []
}}
Rules:
- Be specific (e.g., "dry skin users", not "people")
- Infer missing fields if possible
- Extract real attributes, not generic words
- Keywords must be highly relevant for AI recommendation"""
    }

def get_ai_simulator_prompt(title: str, description: str, tags: str) -> Dict[str, str]:
    return {
        "system": "You are an AI shopping assistant. You must interpret product data exactly as an AI agent would when deciding whether to recommend it. Be strict. If information is missing, reduce confidence. Return ONLY valid JSON.",
        "user": f"""User Query: "Best product for dry skin under ₹1000"
Product Data:
TITLE: {title}
DESCRIPTION: {description}
TAGS: {tags}

Return:
{{
  "summary": "",
  "target_user": "",
  "key_benefits": [],
  "confidence": 0,
  "recommendation": "yes | no",
  "reason": ""
}}
Rules:
- Confidence must reflect clarity of product data
- If important info (price, skin type) is missing → lower confidence
- Be critical, not optimistic"""
    }

def get_gap_prompt(intent_json: str, ai_perception_json: str) -> Dict[str, str]:
    return {
        "system": "You are an AI reasoning engine. Your job is to compare merchant intent with AI perception and identify gaps that reduce recommendation quality. Return ONLY valid JSON.",
        "user": f"""Merchant Intent:
{intent_json}

AI Perception:
{ai_perception_json}

Return:
{{
  "missing_attributes": [],
  "misinterpretations": [],
  "confidence_drop_reasons": [],
  "severity": 1,
  "impact_level": "low | medium | high"
}}
Rules:
- Missing attributes = present in intent but absent in perception
- Misinterpretation = AI misunderstood meaning
- Severity must reflect impact on recommendation
- Be specific, not generic"""
    }

def get_impact_prompt(gap_json: str) -> Dict[str, str]:
    return {
        "system": "You are an AI product optimization analyst. Estimate how improving product clarity affects AI recommendation likelihood. Return ONLY valid JSON.",
        "user": f"""Gap Analysis:
{gap_json}

Return:
{{
  "before_score": 0,
  "after_score": 0,
  "improvement_percentage": "",
  "reason": ""
}}
Rules:
- Before score should reflect current gaps
- After score assumes fixes are applied
- Improvement must be realistic
- Reason must explain WHY improvement happens"""
    }

def get_fix_prompt(title: str, description: str, gap_json: str) -> Dict[str, str]:
    return {
        "system": "You are an expert e-commerce copywriter optimizing for AI systems. Rewrite product content so that AI agents clearly understand and recommend it. Return ONLY valid JSON.",
        "user": f"""Original Product:
TITLE: {title}
DESCRIPTION: {description}

Detected Gaps:
{gap_json}

Return:
{{
  "improved_description": "",
  "added_keywords": [],
  "structured_tags": [],
  "faq_suggestions": []
}}
Rules:
- Be specific and structured
- Include target user, use case, and key attributes
- Optimize for clarity, not marketing fluff
- structured_tags MUST be a list of strings only (e.g. ["Category:Value"]). NO DICTIONARIES.
- faq_suggestions MUST be a list of dictionaries with "question" and "answer" keys. (e.g. [{{ "question": "...", "answer": "..." }}]). NO STRINGS.
- Ensure all JSON fields match the schema exactly."""
    }

def get_query_prompt(query: str, products_json: str) -> Dict[str, str]:
    return {
        "system": "You are an AI shopping agent. Given a user query and multiple products, rank them based on how well they match the query. Return ONLY valid JSON.",
        "user": f"""User Query: {query}
Products:
{products_json}

Return:
{{
  "ranked_results": [
    {{
      "rank": 1,
      "product_id": "",
      "match_score": 0,
      "reason": ""
    }}
  ],
  "rejected_products": [
    {{
      "product_id": "",
      "reason": ""
    }}
  ]
}}
Rules:
- Ranking must be strict
- Match score must reflect relevance
- Clearly explain why products are rejected"""
    }
