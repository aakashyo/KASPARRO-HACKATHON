import re

MATERIAL_KEYWORDS = [
    "cotton", "polyester", "nylon", "leather", "silk", "wool", "linen", "bamboo",
    "stainless steel", "aluminum", "aluminium", "plastic", "rubber", "latex",
    "zinc oxide", "titanium", "ceramic", "wood", "glass", "carbon fiber",
    "spandex", "fleece", "memory foam", "gel", "foam"
]
DIMENSION_PATTERNS = [
    r'\d+\s*(cm|mm|inch|inches|in|ft|kg|g|lb|lbs|oz|ml|l|litre|liter|watt|w|mah|nm|nm|m)\b',
    r'\d+\s*x\s*\d+',
    r'(spf|upf)\s*\d+',
    r'\d+%',
]
WARRANTY_KEYWORDS = ["warranty", "guarantee", "year warranty", "month warranty", "lifetime", "guaranteed"]
CERTIFICATIONS = [
    "fda", "ce", "rohs", "bpa free", "bpa-free", "usda organic", "organic", "iso",
    "reef safe", "reef-safe", "cruelty free", "cruelty-free", "vegan", "dermatologist",
    "clinically tested", "clinically proven", "non-comedogenic", "fragrance free",
    "fragrance-free", "hypoallergenic", "ewg", "jas organic"
]
INGREDIENT_KEYWORDS = [
    "vitamin c", "retinol", "hyaluronic acid", "niacinamide", "salicylic acid",
    "glycolic acid", "zinc", "collagen", "peptides", "ceramides", "aha", "bha",
    "l-ascorbic acid", "glycerin", "shea butter", "aloe vera", "argan oil",
    "caffeine", "squalane", "trehalose"
]
SIZE_PATTERNS = [
    r'\b(xs|s|m|l|xl|xxl|2xl|3xl)\b',
    r'(size[s]?\s*:?\s*[\w,\s/-]+)',
    r'(fit[s]?\s+\w+)',
    r'(small|medium|large|one size)',
]
USE_CASE_KEYWORDS = [
    "outdoor", "indoor", "gym", "office", "travel", "sensitive skin",
    "oily skin", "dry skin", "all skin types", "kids", "children", "adults",
    "professional", "home use", "sports", "gaming", "workout", "daily use",
    "night use", "morning"
]


def _detect_attributes(text: str) -> dict:
    text_lower = text.lower()
    
    has_material = any(kw in text_lower for kw in MATERIAL_KEYWORDS)
    has_dimensions = any(re.search(p, text_lower) for p in DIMENSION_PATTERNS)
    has_warranty = any(kw in text_lower for kw in WARRANTY_KEYWORDS)
    has_certs = [c for c in CERTIFICATIONS if c in text_lower]
    has_ingredients = [i for i in INGREDIENT_KEYWORDS if i in text_lower]
    has_size = any(re.search(p, text_lower) for p in SIZE_PATTERNS)
    has_use_case = any(kw in text_lower for kw in USE_CASE_KEYWORDS)

    return {
        "has_material": has_material,
        "has_dimensions": has_dimensions,
        "has_warranty": has_warranty,
        "certifications_found": has_certs,
        "ingredients_found": has_ingredients,
        "has_size_info": has_size,
        "has_use_case": has_use_case,
    }


def fast_scan(product: dict) -> dict:
    score = 100
    issues = []
    structural_gaps = []

    description = product.get("body_html") or product.get("description") or ""
    tags = product.get("tags") or []
    title = product.get("title") or ""
    price = product.get("price", "")

    if isinstance(tags, str):
        tags = [t.strip() for t in tags.split(",") if t.strip()]

    full_text = f"{title} {description}"
    attrs = _detect_attributes(full_text)

    if not description:
        score -= 30
        issues.append("Missing product description")
        structural_gaps.append("No description")
    elif len(description) < 50:
        score -= 15
        issues.append("Description too short (under 50 characters)")
        structural_gaps.append("Description too short")
    elif len(description) < 150:
        score -= 5
        structural_gaps.append("Description lacks depth")

    if not tags:
        score -= 20
        issues.append("Missing product tags")
        structural_gaps.append("No tags")
    elif len(tags) < 3:
        score -= 10
        issues.append("Insufficient tag density")
        structural_gaps.append("Fewer than 3 tags")

    if not title:
        score -= 40
        issues.append("Missing title")
    elif len(title.split()) < 3:
        score -= 10
        issues.append("Title lacks descriptive detail")

    if not attrs["has_material"] and not attrs["ingredients_found"]:
        score -= 15
        structural_gaps.append("Missing material or ingredients")
    elif not attrs["has_material"]:
        score -= 8
        structural_gaps.append("Missing material data")
        
    if not attrs["has_dimensions"] and not attrs["has_size_info"]:
        score -= 15
        structural_gaps.append("Missing size or dimensions")

    if not attrs["has_use_case"]:
        score -= 15
        structural_gaps.append("Missing intended use-case")
    
    if not attrs["certifications_found"]:
        score -= 5
        structural_gaps.append("No trust certifications found")

    if not price or price == "0.00":
        score -= 5
        structural_gaps.append("Missing price data")

    all_gaps = issues + structural_gaps
    # Final Severity calculation
    # Severity 1-3: Optimized
    # Severity 4-6: Warning
    # Severity 7-10: Critical
    severity = min(10, max(1, (100 - score) // 8)) # Use // 8 to make it slightly more sensitive

    return {
        "quick_score": max(5, score),
        "severity": severity,
        "basic_gap": ", ".join(issues) if issues else "Optimal base structure",
        "structural_gaps": structural_gaps,
        "detected_attributes": attrs,
        "priority": "high" if severity >= 7 else "medium" if severity >= 4 else "low"
    }
