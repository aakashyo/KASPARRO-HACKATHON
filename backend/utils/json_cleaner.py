import json
import re

# Standardized Fallback Objects
DEFAULT_GAP = {
    "missing_attributes": [],
    "misinterpretations": [],
    "confidence_drop_reasons": [],
    "insight": "Fallback analysis due to processing delay.",
    "severity": 5,
    "impact_level": "medium",
    "detailed_explanation": "The AI model response was interrupted or malformed. Standard optimization rules still apply."
}

DEFAULT_AUDIT = {
    "intent": {
        "category": "General",
        "target_user": "General Consumer",
        "use_case": "General Usage",
        "price_segment": "Mid-range",
        "key_attributes": [],
        "important_keywords": []
    },
    "ai_perception": {
        "summary": "Product information partially parsed.",
        "target_user": "AI Agents",
        "key_benefits": [],
        "confidence": 0.5,
        "recommendation": "yes",
        "reason": "Standard indexing applied.",
        "detailed_reasoning": ""
    },
    "gaps": DEFAULT_GAP,
    "impact": {
        "before_score": 0.4,
        "after_score": 0.7,
        "improvement_percentage": "0%",
        "reason": "Optimization suggested.",
        "detailed_impact": ""
    },
    "fixes": {
        "improved_description": "Standard optimization recommendation.",
        "added_keywords": [],
        "structured_tags": [],
        "faq_suggestions": [],
        "explanation": "Applied baseline AI SEO standard."
    }
}

def validate_final_output(data: dict) -> dict:
    """Final sanity check before streaming to ensure critical keys like 'gaps' are present."""
    if not isinstance(data, dict):
        return DEFAULT_AUDIT
        
    if "gaps" not in data or not isinstance(data.get("gaps"), dict):
        data["gaps"] = DEFAULT_GAP
        
    # Ensure other high-level keys exist
    for key in ["intent", "ai_perception", "impact", "fixes"]:
        if key not in data:
            data[key] = DEFAULT_AUDIT[key]
            
    return data

def strip_code_fences(text: str) -> str:
    """Removes markdown code blocks and backticks."""
    if not isinstance(text, str):
        return "{}"
    text = re.sub(r'```json\s*', '', text)
    text = re.sub(r'```\s*', '', text)
    return text.strip() or "{}"

def safe_json_parse(text: str) -> dict:
    """Safely parses JSON string with fallback to empty dict."""
    try:
        return json.loads(text or "{}")
    except Exception:
        return {}

def flatten_to_strings(v):
    """Recursively flattens lists/nested lists into a flat list of strings."""
    if isinstance(v, list):
        out = []
        for item in v:
            if isinstance(item, list):
                out.extend(flatten_to_strings(item))
            elif item is not None:
                out.append(str(item))
        return out
    return []

def safe_int(value, default=5):
    try:
        if isinstance(value, str) and value.isdigit():
            return int(value)
        if isinstance(value, (int, float)):
            return int(value)
        return default
    except Exception:
        return default

def safe_float(value, default=0.5):
    try:
        return float(value)
    except Exception:
        return default

def safe_str(value, default=""):
    if value is None:
        return default
    return str(value)

def clean_full_response(data: dict) -> dict:
    """Ensures top-level keys exist in a raw LLM response."""
    if not isinstance(data, dict):
        return DEFAULT_AUDIT
    
    # Check for specific keys and normalize
    # Sometimes models return 'perception' instead of 'ai_perception'
    if "perception" in data and "ai_perception" not in data:
        data["ai_perception"] = data.get("perception", {})

    for key in DEFAULT_AUDIT.keys():
        if key not in data:
            data[key] = DEFAULT_AUDIT.get(key, {})
    return data

def clean_gap_response(data: dict) -> dict:
    """Sanitizes GapAnalysis response data for Pydantic safety."""
    if not isinstance(data, dict):
        return DEFAULT_GAP

    data["missing_attributes"] = flatten_to_strings(data.get("missing_attributes", []))
    data["misinterpretations"] = flatten_to_strings(data.get("misinterpretations", []))
    data["confidence_drop_reasons"] = flatten_to_strings(data.get("confidence_drop_reasons", []))

    data["insight"] = safe_str(data.get("insight", "Analysis complete."))
    data["severity"] = safe_int(data.get("severity", 5))
    data["impact_level"] = safe_str(data.get("impact_level", "medium"))
    data.setdefault("detailed_explanation", "")

    return data

def clean_intent_response(data: dict) -> dict:
    """Sanitizes MerchantIntent response data."""
    if not isinstance(data, dict):
        return DEFAULT_AUDIT["intent"]
    data.setdefault("category", "General")
    data.setdefault("target_user", "General Consumer")
    data.setdefault("use_case", "General Usage")
    data.setdefault("price_segment", "Mid-range")
    data["key_attributes"] = flatten_to_strings(data.get("key_attributes", []))
    data["important_keywords"] = flatten_to_strings(data.get("important_keywords", []))
    return data

def clean_perception_response(data: dict) -> dict:
    """Sanitizes AIPerception response data."""
    if not isinstance(data, dict):
        return DEFAULT_AUDIT["ai_perception"]
    data.setdefault("summary", "Product analyzed.")
    data.setdefault("target_user", "AI Agents")
    data["key_benefits"] = flatten_to_strings(data.get("key_benefits", []))
    data["confidence"] = safe_float(data.get("confidence", 0.5))
    data.setdefault("recommendation", "yes")
    data.setdefault("reason", "Standard listing.")
    data.setdefault("detailed_reasoning", "")
    return data

def clean_impact_response(data: dict) -> dict:
    """Sanitizes ImpactEstimate response data."""
    if not isinstance(data, dict):
        return DEFAULT_AUDIT["impact"]
    data["before_score"] = safe_float(data.get("before_score", 0.4))
    data["after_score"] = safe_float(data.get("after_score", 0.7))
    data.setdefault("improvement_percentage", "0%")
    data.setdefault("reason", "Optimization will clarify product utility.")
    data.setdefault("detailed_impact", "")
    return data

def clean_fix_response(data: dict) -> dict:
    """Sanitizes OptimizedFixes response data."""
    if not isinstance(data, dict):
        return DEFAULT_AUDIT["fixes"]
    data.setdefault("improved_description", "Updated description for AI clarity.")
    data["added_keywords"] = flatten_to_strings(data.get("added_keywords", []))
    data["structured_tags"] = flatten_to_strings(data.get("structured_tags", []))
    data["faq_suggestions"] = flatten_to_strings(data.get("faq_suggestions", []))
    data.setdefault("explanation", "Standard optimization applied.")
    return data
