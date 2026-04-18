import json
import re

def strip_code_fences(text: str) -> str:
    """Removes markdown code blocks and backticks."""
    if not isinstance(text, str):
        return ""
    text = re.sub(r'```json\s*', '', text)
    text = re.sub(r'```\s*', '', text)
    return text.strip()

def safe_json_parse(text: str) -> dict:
    """Safely parses JSON string with fallback to empty dict."""
    try:
        return json.loads(text)
    except Exception:
        return {}

def flatten_to_strings(v):
    """Recursively flattens lists/nested lists into a flat list of strings."""
    if isinstance(v, list):
        out = []
        for item in v:
            if isinstance(item, list):
                out.extend(flatten_to_strings(item))
            else:
                out.append(str(item))
        return out
    return []

def safe_int(value, default=5):
    try:
        return int(value)
    except Exception:
        return default

def safe_float(value, default=0.5):
    try:
        return float(value)
    except Exception:
        return default

def safe_str(value, default=""):
    try:
        return str(value)
    except Exception:
        return default

def clean_full_response(data: dict) -> dict:
    """Ensures top-level keys exist in a raw LLM response."""
    if not isinstance(data, dict):
        data = {}
    data.setdefault("intent", {})
    data.setdefault("perception", {})
    data.setdefault("gaps", {})
    data.setdefault("impact", {})
    data.setdefault("fixes", {})
    return data

def clean_gap_response(data: dict) -> dict:
    """Sanitizes GapAnalysis response data for Pydantic safety."""
    if not isinstance(data, dict):
        data = {}

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
        data = {}
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
        data = {}
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
        data = {}
    data["before_score"] = safe_float(data.get("before_score", 0.4))
    data["after_score"] = safe_float(data.get("after_score", 0.7))
    data.setdefault("improvement_percentage", "0%")
    data.setdefault("reason", "Optimization will clarify product utility.")
    data.setdefault("detailed_impact", "")
    return data

def clean_fix_response(data: dict) -> dict:
    """Sanitizes OptimizedFixes response data."""
    if not isinstance(data, dict):
        data = {}
    data.setdefault("improved_description", "Updated description for AI clarity.")
    data["added_keywords"] = flatten_to_strings(data.get("added_keywords", []))
    data["structured_tags"] = flatten_to_strings(data.get("structured_tags", []))
    data["faq_suggestions"] = flatten_to_strings(data.get("faq_suggestions", []))
    data.setdefault("explanation", "Standard optimization applied.")
    return data
