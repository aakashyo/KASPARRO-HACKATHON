import re
from typing import List, Dict, Any

REFUND_TRIGGERS = [
    "return", "refund", "money back", "money-back", "exchange", "no questions asked"
]
SHIPPING_TRIGGERS = [
    "free shipping", "free delivery", "ships in", "delivered in", "next day", "same day",
    "2-day", "express shipping", "overnight"
]
WARRANTY_TRIGGERS = [
    "warranty", "guarantee", "year guarantee", "lifetime", "guaranteed for"
]
SUBSCRIPTION_TRIGGERS = [
    "subscribe", "subscription", "auto-renew", "recurring"
]


def _extract_policy_claims(text: str) -> List[str]:
    text_lower = text.lower()
    found = []
    for trigger in REFUND_TRIGGERS:
        if trigger in text_lower:
            found.append(f"return/refund claim: '{trigger}'")
    for trigger in SHIPPING_TRIGGERS:
        if trigger in text_lower:
            found.append(f"shipping claim: '{trigger}'")
    for trigger in WARRANTY_TRIGGERS:
        if trigger in text_lower:
            found.append(f"warranty claim: '{trigger}'")
    for trigger in SUBSCRIPTION_TRIGGERS:
        if trigger in text_lower:
            found.append(f"subscription claim: '{trigger}'")
    return found


def _policy_text_allows_returns(policies: List[Dict]) -> bool:
    for p in policies:
        body = (p.get("body") or p.get("content") or "").lower()
        title = (p.get("title") or "").lower()
        if "no refund" in body or "no return" in body or "all sales final" in body:
            return False
        if "refund" in body or "return" in body or "exchange" in body:
            return True
        if "refund" in title or "return" in title:
            return True
    return None


def _policy_mentions_free_shipping(policies: List[Dict]) -> bool:
    for p in policies:
        body = (p.get("body") or p.get("content") or "").lower()
        if "free shipping" in body or "free delivery" in body:
            return True
    return False


def validate_fixes_against_policies(
    generated_description: str,
    generated_tags: List[str],
    policies: List[Dict]
) -> Dict[str, Any]:
    combined_text = generated_description + " " + " ".join(
        t if isinstance(t, str) else f"{t.get('name', '')} {t.get('value', '')}"
        for t in generated_tags
    )
    
    claims_found = _extract_policy_claims(combined_text)
    flags = []
    is_safe = True

    if not policies:
        return {"is_safe": True, "flags": [], "claims_checked": claims_found, "policy_source": "no_policies_available"}

    returns_allowed = _policy_text_allows_returns(policies)
    free_shipping_present = _policy_mentions_free_shipping(policies)

    for claim in claims_found:
        if "return/refund" in claim and returns_allowed is False:
            flags.append({
                "severity": "critical",
                "claim": claim,
                "reason": "Store policy explicitly states no refunds or all sales final. This claim would create legal liability."
            })
            is_safe = False
        elif "return/refund" in claim and returns_allowed is None:
            flags.append({
                "severity": "warning",
                "claim": claim,
                "reason": "No return policy found on this store. Cannot verify this claim."
            })

        if "shipping" in claim and not free_shipping_present:
            flags.append({
                "severity": "warning",
                "claim": claim,
                "reason": "Free shipping was not found in store policies. This claim may be inaccurate."
            })

    return {
        "is_safe": is_safe,
        "flags": flags,
        "claims_checked": claims_found,
        "policy_source": "store_policies"
    }
