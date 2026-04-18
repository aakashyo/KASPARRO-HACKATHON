def fast_scan(product: dict):
    """
    High-speed, rule-based diagnostic scan (No LLM).
    Used for instant catalog sweeping.
    """
    score = 100
    issues = []

    # 1. Extraction
    description = product.get("body_html") or product.get("description") or ""
    tags = product.get("tags") or []
    title = product.get("title") or ""

    # Normalize tags if string
    if isinstance(tags, str):
        tags = [t.strip() for t in tags.split(",") if t.strip()]

    # 2. Logic Rules
    if not description:
        score -= 30
        issues.append("Missing product description")
    elif len(description) < 50:
        score -= 15
        issues.append("Description too short")

    if not tags:
        score -= 20
        issues.append("Missing product tags")
    elif len(tags) < 3:
        score -= 10
        issues.append("Insufficient tag density")

    if not title:
        score -= 40
        issues.append("Missing title")
    elif len(title.split()) < 3:
        score -= 10
        issues.append("Title lacks detail")

    # 3. Final Calculations
    severity = min(10, (100 - score) // 10)
    
    return {
        "quick_score": max(5, score),
        "severity": severity,
        "basic_gap": ", ".join(issues) if issues else "Optimal base structure",
        "priority": "high" if severity >= 7 else "medium" if severity >= 4 else "low"
    }
