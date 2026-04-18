from typing import Dict, List, Any

# GLOBAL PROMPT RULES
GLOBAL_RULES = """Provide concise but meaningful explanations (2-3 lines max).
Clearly describe the issue and its impact on AI understanding.
Keep each explanation under 40-50 words.
Avoid repetition and generic statements.
Avoid filler phrases like "this significantly impacts".
Use specific terms instead of vague statements.
Write in a clear, professional tone.
Keep responses compact. Avoid long sentences.
Do not exceed 2-3 lines per explanation field.
Do not repeat the same phrases across different fields.
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
    "target_user": "Specific demographic",
    "use_case": "Primary utility",
    "price_segment": "budget | mid-range | luxury",
    "key_attributes": ["attribute1", "attribute2"],
    "important_keywords": ["keyword1", "keyword2"]
  }},
  "ai_perception": {{
    "summary": "1-sentence summary",
    "target_user": "Persona",
    "key_benefits": ["benefit1", "benefit2"],
    "confidence": 0-1 score,
    "recommendation": "yes | no",
    "reason": "Short reason",
    "detailed_reasoning": "Reasoning for AI interpretation (Medium detail, 1-2 lines)"
  }},
  "gaps": {{
    "missing_attributes": ["spec1", "spec2"],
    "misinterpretations": ["hallucination1"],
    "confidence_drop_reasons": ["vague1"],
    "insight": "Short summary",
    "severity": 1-10,
    "impact_level": "low | medium | high",
    "detailed_explanation": "Detailed explanation of missing data and impact on AI (High detail, 2-3 lines max)"
  }},
  "impact": {{
    "before_score": 0.0-1.0,
    "after_score": 0.0-1.0,
    "improvement_percentage": "+XX%",
    "reason": "Short logic",
    "detailed_impact": "Detailed impact on ranking and confidence (High detail, 2-3 lines max)"
  }},
  "fixes": {{
    "improved_description": "New AI-optimized description",
    "added_keywords": ["key1", "key2"],
    "structured_tags": ["Tag1", "Tag2"],
    "faq_suggestions": ["Q&A pair"],
    "explanation": "Explanation of why fixes improve understanding (Medium detail, 1-2 lines)"
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
