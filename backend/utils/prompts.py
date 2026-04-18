from typing import Dict, List, Any

# STAGE 1: FAST SCAN
def get_fast_scan_prompt(title: str, description: str, tags: str) -> Dict[str, str]:
    return {
        "system": "You are a high-speed AI diagnostic engine. Quickly assess a product's search visibility for AI agents.\nReturn ONLY valid JSON.\nNo markdown, no explanation.\nAll fields are required.\nUse empty arrays [] if no data.\nDo NOT return nested arrays.\nDo not use code fences.",
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

# STAGE 2: CONSOLIDATED DEEP AUDIT (Super Audit)
def get_super_audit_prompt(title: str, description: str, tags: str) -> Dict[str, str]:
    return {
        "system": """You are an elite AI Systems Auditor. Perform a 360-degree deep audit of a product's representation for AI recommendation engines (like ChatGPT, Google Search, etc.).
Return ONLY valid JSON.
No markdown, No code fences, No preamble.
All fields are required.
Use empty arrays [] if no data.
Do NOT return nested arrays.""",
        "user": f"""DEEP AUDIT TASK:
Analyze this product across 5 dimensions: Intent, Perception, Gaps, Impact, and Fixes.

PRODUCT DATA:
TITLE: {title}
DESCRIPTION: {description}
TAGS: {tags}

REQUIRED OUTPUT FORMAT (JSON ONLY):
{{
  "intent": {{
    "category": "E-commerce category",
    "target_user": "Specific demographic",
    "use_case": "Primary utility",
    "price_segment": "budget | mid-range | luxury",
    "key_attributes": ["attribute1", "attribute2"],
    "important_keywords": ["keyword1", "keyword2"]
  }},
  "ai_perception": {{
    "summary": "How an AI agent 'sees' this product in 1 sentence",
    "target_user": "Who the AI thinks this is for",
    "key_benefits": ["benefit1", "benefit2"],
    "confidence": 0-1 score,
    "recommendation": "yes | no",
    "reason": "Why the AI would recommend this",
    "detailed_reasoning": "Step-by-step logic of the AI's matching process"
  }},
  "gaps": {{
    "missing_attributes": ["technical spec 1", "usage context 1"],
    "misinterpretations": ["potential AI hallucination/confusion 1"],
    "confidence_drop_reasons": ["vague description", "missing size info"],
    "insight": "Executive summary of the alignment gap",
    "severity": 1-10,
    "impact_level": "low | medium | high",
    "detailed_explanation": "Deep dive into the perception-intent mismatch"
  }},
  "impact": {{
    "before_score": 0.0-1.0,
    "after_score": 0.0-1.0,
    "improvement_percentage": "+XX%",
    "reason": "Logic for improvement",
    "detailed_impact": "How fixes affect semantic ranking"
  }},
  "fixes": {{
    "improved_description": "New AI-optimized description text",
    "added_keywords": ["SEO key 1", "SEO key 2"],
    "structured_tags": ["Tag1", "Tag2"],
    "faq_suggestions": [{{ "question": "Q1", "answer": "A1" }}],
    "explanation": "Why these fixes work for AI"
  }}
}}"""
    }

# Global Query Simulator
def get_query_prompt(query: str, products_json: str) -> Dict[str, str]:
    return {
        "system": "You are an AI shopping agent. Rank products by query relevance.\nReturn ONLY valid JSON.\nNo markdown, no explanation.\nAll fields are required.\nUse empty arrays [] if no data.\nDo NOT return nested arrays.\nDo not use code fences.",
        "user": f"""QUERY: {query}
PRODUCTS: {products_json}

Format:
{{
  "ranked_results": [{{ "rank": 1, "product_id": "", "match_score": 0, "reason": "" }}],
  "rejected_products": [{{ "product_id": "", "reason": "" }}]
}}"""
    }
