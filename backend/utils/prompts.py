from typing import Dict, List, Any

# GLOBAL PROMPT RULES
GLOBAL_RULES = """Provide meaningful, descriptive, and actionable explanations.
Clearly describe the issue and its impact on AI understanding.
Be thorough where detailed reasoning is required.
Avoid repetition and generic statements.
Avoid filler phrases like "this significantly impacts".
Use specific terms instead of vague statements.
Write in a clear, professional tone.
For fix suggestions, provide complete, production-ready content.
Return ONLY valid JSON with all required fields.
Do NOT include markdown or extra text.
Use empty arrays [] if no data.
Do NOT use nested arrays."""

# STAGE 2: CONSOLIDATED DEEP AUDIT (Super Audit)
def get_super_audit_prompt(title: str, description: str, tags: str) -> Dict[str, str]:
    return {
        "system": f"You are an elite AI Systems Auditor performing a 360-degree deep audit of a product's representation for AI recommendation engines.\n{GLOBAL_RULES}",
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
    "target_user": "Detailed target demographic",
    "use_case": "Primary and secondary utility",
    "price_segment": "budget | mid-range | luxury",
    "key_attributes": ["attribute1", "attribute2"],
    "important_keywords": ["keyword1", "keyword2"]
  }},
  "ai_perception": {{
    "summary": "1-sentence summary",
    "target_user": "Specific Persona",
    "key_benefits": ["benefit1", "benefit2"],
    "confidence": 0-1 score,
    "recommendation": "yes | no",
    "reason": "Detailed reasoning for the recommendation",
    "detailed_reasoning": "Thorough analysis of how an AI agent interprets this product (3-4 sentences)"
  }},
  "gaps": {{
    "missing_attributes": ["spec1", "spec2"],
    "misinterpretations": ["hallucination1"],
    "confidence_drop_reasons": ["vague1"],
    "insight": "High-level strategic insight",
    "severity": 1-10,
    "impact_level": "low | medium | high",
    "detailed_explanation": "Comprehensive breakdown of missing data and its exact impact on AI discoverability (4-5 sentences)"
  }},
  "impact": {{
    "before_score": 0.0-1.0,
    "after_score": 0.0-1.0,
    "improvement_percentage": "+XX%",
    "reason": "Strategic logic for improvement",
    "detailed_impact": "Detailed projection of how these changes affect search ranking and AI recommendation volume (3-4 sentences)"
  }},
  "fixes": {{
    "improved_description": "A comprehensive, high-quality, AI-optimized product description (100-200 words). Focus on semantic clarity, technical specs, and solving user objections.",
    "added_keywords": ["key1", "key2"],
    "structured_tags": ["Tag1", "Tag2"],
    "faq_suggestions": [
      {{"question": "Critical Question 1?", "answer": "Comprehensive, detailed answer that provides technical or usage clarity for AI agents."}},
      {{"question": "Critical Question 2?", "answer": "Comprehensive, detailed answer that provides technical or usage clarity for AI agents."}}
    ],
    "explanation": "Detailed explanation of why these specific fixes bridge the AI gap (3-4 sentences)"
  }}
}}"""
    }

# Global Query Simulator
def get_query_prompt(query: str, products_json: str) -> Dict[str, str]:
    return {
        "system": f"You are an AI shopping agent ranking products by query relevance.\n{GLOBAL_RULES}",
        "user": f"""QUERY: {query}
PRODUCTS: {products_json}

Format:
{{
  "ranked_results": [{{ "rank": 1, "product_id": "", "match_score": 0, "reason": "" }}],
  "rejected_products": [{{ "product_id": "", "reason": "" }}]
}}"""
    }

PERSONAS = {
    "budget": {
        "name": "Budget Optimizer AI",
        "description": "Prioritizes price-to-value ratio, discounts, and affordability signals",
        "focus": "price, value, affordable, budget, cost per use, bang for buck"
    },
    "techspec": {
        "name": "Tech-Spec AI",
        "description": "Demands exact measurements, compatibility info, and technical certifications",
        "focus": "specifications, measurements, compatibility, certifications, materials, dimensions"
    },
    "gift": {
        "name": "Gift Recommendation AI",
        "description": "Prioritizes presentation quality, brand story, and recipient-friendliness",
        "focus": "gift-ready, premium feel, packaging, brand trust, occasion suitability"
    }
}

def get_persona_query_prompt(persona_key: str, query: str, products_json: str) -> Dict[str, str]:
    p = PERSONAS.get(persona_key, PERSONAS["budget"])
    return {
        "system": f"You are the {p['name']}: an AI shopping agent that {p['description']}. You ONLY care about: {p['focus']}. Ignore factors outside your persona's priorities.\n{GLOBAL_RULES}",
        "user": f"""QUERY: {query}
PRODUCTS: {products_json}

Rank from your persona's strict perspective. Format:
{{
  "ranked_results": [{{ "rank": 1, "product_id": "", "match_score": 0, "reason": "" }}],
  "rejected_products": [{{ "product_id": "", "reason": "" }}]
}}"""
    }

