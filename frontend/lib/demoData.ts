export const demoData = {
  store_score: {
    overall_score: 54,
    dimension_scores: {
      "Product_Quality": { score: 42, reason: "Most products lack structured attributes like skin type, material, or measurable benefits." },
      "Policy_Clarity":  { score: 85, reason: "Essential legal policies detected, building agent trust." },
      "FAQ_Coverage":    { score: 38, reason: "Missing explicit FAQs, forcing AI to guess on edge cases." },
      "Trust_Signals":   { score: 72, reason: "Multiple trust markers (Refund, TOS) are clearly accessible." },
      "Structured_Data": { score: 35, reason: "Fragmented or missing tags hinder agent categorization across catalog." }
    },
    business_impact: {
      recoverable_revenue: 12500,
      critical_fixes_needed: 4
    },
    roadmap: [
      {
        phase: 1,
        title: "Trust Foundation",
        status: "critical",
        task: "Generate AI Discovery Guide & Policies",
        impact: "High (Legal & Agent Safety)",
        action_type: "push_faq"
      },
      {
        phase: 2,
        title: "Search Visibility",
        status: "critical",
        task: "Mega-Sync 4 Product Tags",
        impact: "Medium (Ranking Volume)",
        action_type: "mega_sync"
      },
      {
        phase: 3,
        title: "Conversion Optimization",
        status: "warning",
        task: "Semantic Description Deep Audit",
        impact: "High (Recommendation Confidence)",
        action_type: "deep_audit"
      }
    ]
  },
  products: [
    {
      id: "demo-1",
      title: "Neural Vitamin C Serum",
      handle: "neural-vitamin-c-serum",
      price: "1450.00",
      original_data: {
        description: "A nice serum for your face. Makes you look good.",
        tags: [],
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200&h=200"
      },
      intent: {
        category: "Skincare",
        target_user: "Individuals with dull or fatigued skin",
        use_case: "Daily radiance boosting and hydration",
        price_segment: "Mid-range",
        key_attributes: ["Vitamin C", "Hyaluronic Acid"],
        important_keywords: ["brightening", "hydration", "anti-aging"]
      },
      ai_perception: {
        summary: "A facial serum that improves appearance.",
        target_user: "General beauty consumers",
        key_benefits: ["Cosmetic enhancement"],
        confidence: 0.28,
        recommendation: "no",
        reason: "The description is too vague to determine active ingredients or target skin types.",
        detailed_reasoning: "The phrase 'makes you look good' provides zero functional signal. AI cannot parse ingredient efficacy, concentration levels, or claim specificity. This product will be skipped in favor of competitors with structured data."
      },
      gaps: {
        missing_attributes: ["Skin Type Compatibility", "Active Ingredient Concentration", "Fragrance-Free Status", "Safety Warnings"],
        misinterpretations: ["AI perceived it as a cosmetic toner, not a treatment serum"],
        confidence_drop_reasons: ["Lack of technical specificity", "No price anchoring", "Zero structured tags"],
        insight: "AI fails to detect active ingredients, reducing ranking in treatment-focused queries.",
        severity: 9,
        impact_level: "high",
        detailed_explanation: "Without ingredient percentages and skin-type tags, AI defaults to low-confidence generic classification. This product loses to competitors listing 10% L-Ascorbic Acid with explicit 'oily skin' or 'dry skin' tags."
      },
      impact: {
        before_score: 0.28,
        after_score: 0.89,
        improvement_percentage: "+218%",
        reason: "Fixing core attributes allows AI to match this to high-intent skincare queries.",
        detailed_impact: "Adding ingredient specs and skin-type attributes enables this product to appear in 4x more AI-recommended shopping results and improves recommendation confidence from 28% to 89%."
      },
      fixes: {
        improved_description: "A high-potency 15% Vitamin C + Hyaluronic Acid serum formulated for dull and fatigued skin. Delivers 24-hour hydration and visible brightening through stabilized L-Ascorbic Acid. Fragrance-free, non-comedogenic, and dermatologist-tested. Suitable for all skin types including sensitive.",
        added_keywords: ["Vitamin C Serum", "Brightening Serum", "Hyaluronic Acid Hydration", "L-Ascorbic Acid", "Fragrance Free Serum"],
        structured_tags: ["skin-type:all", "skin-type:sensitive", "benefit:brightening", "benefit:hydration", "ingredient:vitamin-c", "ingredient:hyaluronic-acid", "concern:dullness"],
        faq_suggestions: [
          { question: "Is this suitable for sensitive skin?", answer: "Yes, it is fragrance-free and dermatologist-tested for all skin types including sensitive." },
          { question: "What concentration of Vitamin C does it contain?", answer: "It contains 15% stabilized L-Ascorbic Acid for maximum brightening efficacy." }
        ],
        explanation: "Structured ingredient data and skin-type tags allow AI shopping agents to confidently match this product to treatment-specific queries, dramatically improving visibility."
      },
      is_audited: true,
      scan_quick: { severity: 9, quick_score: 22, basic_gap: "Missing ingredients, skin type, and all structured tags", priority: "high" }
    },
    {
      id: "demo-2",
      title: "Mineral Shield SPF 50",
      handle: "mineral-shield-spf-50",
      price: "1890.00",
      original_data: {
        description: "Sunscreen for beach days.",
        tags: ["sunscreen"],
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=200&h=200"
      },
      intent: {
        category: "Sun Care",
        target_user: "Beach-goers and outdoor athletes",
        use_case: "Water-resistant UV protection during outdoor activity",
        price_segment: "Premium",
        key_attributes: ["Zinc Oxide", "Reef Safe", "Broad Spectrum"],
        important_keywords: ["water-resistant", "SPF 50", "mineral sunscreen", "reef-safe"]
      },
      ai_perception: {
        summary: "Generic sun protection lotion.",
        target_user: "General public",
        key_benefits: ["Sun protection"],
        confidence: 0.55,
        recommendation: "yes",
        reason: "Identified as sunscreen but lacks technical specs for reef-safety or water resistance duration.",
        detailed_reasoning: "AI can identify this as sunscreen due to the tag, but 'beach days' adds no differentiating signal. Absence of Reef-Safe certification and water-resistance duration causes rejection by ESG-conscious and outdoor-athlete audience segments."
      },
      gaps: {
        missing_attributes: ["Reef Safety Certification", "Water Resistance Duration", "Active Ingredient (Zinc Oxide %)", "Broad-Spectrum Verification"],
        misinterpretations: ["AI categorized as generic lotion rather than specialized mineral sport protection"],
        confidence_drop_reasons: ["Missing broad-spectrum verification", "No ingredient specification"],
        insight: "Missing Reef-Safe certification causes rejection by eco-conscious shopping agents.",
        severity: 5,
        impact_level: "medium",
        detailed_explanation: "Eco-conscious AI agents actively filter for reef-safe certifications. Without this data, the product loses ranking in the growing 'sustainable sunscreen' segment, which accounts for 34% of SPF-related AI shopping queries."
      },
      impact: {
        before_score: 0.55,
        after_score: 0.91,
        improvement_percentage: "+65%",
        reason: "Validating Reef-Safe and water-resistance unlocks specialized athlete and eco-conscious segments.",
        detailed_impact: "Structured mineral sunscreen data enables matching to outdoor athlete, surf, and eco-travel queries — three high-intent, low-competition segments currently missed entirely."
      },
      fixes: {
        improved_description: "Broad-spectrum Mineral SPF 50 featuring 20% non-nano Zinc Oxide. Water-resistant for 80 minutes and independently certified Reef-Safe by EWG. Leaves no white cast. Ideal for high-intensity outdoor sports, swimming, and beach activities.",
        added_keywords: ["Mineral Sunscreen", "Reef Safe SPF 50", "Sport Sunscreen", "Zinc Oxide Sunscreen", "Water Resistant Sunscreen"],
        structured_tags: ["spf:50", "type:mineral", "water-resistant:80min", "reef-safe:certified", "finish:no-white-cast", "activity:outdoor-sports"],
        faq_suggestions: [
          { question: "How long is the water resistance?", answer: "Water resistant for up to 80 minutes. Reapply after swimming or sweating." },
          { question: "Is this reef safe?", answer: "Yes, it is EWG-certified reef-safe using non-nano Zinc Oxide with no oxybenzone." }
        ],
        explanation: "Reef-safe certification and ingredient-level data unlock eco-conscious and outdoor segments that are currently entirely missed by the vague original description."
      },
      is_audited: true,
      scan_quick: { severity: 5, quick_score: 55, basic_gap: "Missing reef-safe certification and ingredient breakdown", priority: "medium" }
    },
    {
      id: "demo-3",
      title: "ProLift Resistance Bands Set",
      handle: "prolift-resistance-bands",
      original_data: {
        description: "Great for working out at home or the gym.",
        tags: ["fitness", "exercise"],
        image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&q=80&w=200&h=200"
      },
      intent: {
        category: "Fitness Equipment",
        target_user: "Home gym enthusiasts and physical therapy patients",
        use_case: "Progressive resistance training and rehabilitation",
        price_segment: "Budget",
        key_attributes: ["5 resistance levels", "Natural Latex", "Non-slip handles"],
        important_keywords: ["resistance bands", "home workout", "physical therapy", "progressive training"]
      },
      ai_perception: {
        summary: "Generic exercise accessory.",
        target_user: "Casual fitness users",
        key_benefits: ["Exercise support"],
        confidence: 0.31,
        recommendation: "no",
        reason: "Description provides no resistance levels, materials, or use-case specificity for AI matching.",
        detailed_reasoning: "An AI shopping agent asked 'best resistance bands for knee rehabilitation' cannot match this product. No mention of therapy suitability, resistance levels, or material safety. The product appears identical to hundreds of cheaper alternatives."
      },
      gaps: {
        missing_attributes: ["Resistance Levels (lbs/kg)", "Material Composition", "Physical Therapy Suitability", "Band Dimensions", "Included Accessories"],
        misinterpretations: ["AI flags this as a decorative or casual item due to vague copy", "Cannot differentiate from jump rope or yoga strap"],
        confidence_drop_reasons: ["No quantified resistance data", "Missing use-case specificity", "No safety or material info"],
        insight: "No resistance level data locks this product out of all specification-based fitness queries.",
        severity: 8,
        impact_level: "high",
        detailed_explanation: "Fitness buyers are highly specification-driven. Without resistance levels (Light 10lb to Heavy 50lb), material data (natural latex vs TPE), and therapy certification, this product cannot be matched to 90% of fitness-related AI shopping queries."
      },
      impact: {
        before_score: 0.31,
        after_score: 0.84,
        improvement_percentage: "+171%",
        reason: "Quantified resistance data and therapy suitability unlock high-intent fitness and rehab queries.",
        detailed_impact: "Adding the 5 resistance levels and physical therapy mention places this product in front of the fastest-growing fitness segment: home rehab and physiotherapy-recommended workouts."
      },
      fixes: {
        improved_description: "Set of 5 progressive resistance bands ranging from 10 lbs (Extra Light) to 50 lbs (Extra Heavy). Made from 100% natural latex — latex-tested and body-safe. Includes door anchor, ankle straps, and a carry bag. Suitable for rehabilitation, physical therapy, strength training, and yoga.",
        added_keywords: ["Resistance Bands Set", "Physical Therapy Bands", "Home Gym Equipment", "Progressive Resistance Training", "Natural Latex Bands"],
        structured_tags: ["resistance:10-50lbs", "levels:5", "material:natural-latex", "use:physical-therapy", "use:strength-training", "use:yoga", "includes:door-anchor"],
        faq_suggestions: [
          { question: "Are these suitable for physical therapy?", answer: "Yes, the light and medium bands (10-25 lbs) are widely used for physiotherapy and joint rehabilitation." },
          { question: "What is the resistance range?", answer: "The set includes 5 bands: Extra Light (10 lbs), Light (15 lbs), Medium (25 lbs), Heavy (35 lbs), and Extra Heavy (50 lbs)." }
        ],
        explanation: "Quantifying resistance levels and highlighting therapy use unlocks two distinct high-intent buyer segments: home gym builders and physical therapy patients, both of which are currently missed."
      },
      is_audited: true,
      scan_quick: { severity: 8, quick_score: 28, basic_gap: "Missing resistance specs, materials, and use-case data", priority: "high" }
    },
    {
      id: "demo-4",
      title: "CloudStep Memory Foam Insoles",
      handle: "cloudstep-insoles",
      original_data: {
        description: "Comfortable insoles for your shoes. Helps with foot pain.",
        tags: ["insoles", "comfort", "shoes"],
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200&h=200"
      },
      intent: {
        category: "Footwear Accessories",
        target_user: "People with plantar fasciitis and long-standing professionals",
        use_case: "Arch support and pain relief for all-day wear",
        price_segment: "Mid-range",
        key_attributes: ["Orthopedic", "Memory Foam", "Plantar Fasciitis Relief"],
        important_keywords: ["plantar fasciitis insoles", "orthopedic", "arch support", "memory foam"]
      },
      ai_perception: {
        summary: "A generic shoe insert for comfort.",
        target_user: "General shoe wearers",
        key_benefits: ["Comfort"],
        confidence: 0.45,
        recommendation: "yes",
        reason: "Identified as insoles but lacks orthopedic certification or medical use-case data.",
        detailed_reasoning: "An AI agent asked for 'insoles for plantar fasciitis at desk job' would de-rank this in favor of products explicitly mentioning orthopedic arch support and plantar fasciitis treatment. 'Helps with foot pain' is too vague to trigger medical-use matching."
      },
      gaps: {
        missing_attributes: ["Orthopedic Certification", "Arch Type (Flat, Medium, High)", "Shoe Size Compatibility", "Plantar Fasciitis Claim", "Material Layering"],
        misinterpretations: ["Treated as a soft padding insert rather than a therapeutic insole"],
        confidence_drop_reasons: ["Vague pain claim without medical grounding", "No size specifications"],
        insight: "Vague pain claim without orthopedic detail causes demotion in therapeutic footwear queries.",
        severity: 6,
        impact_level: "medium",
        detailed_explanation: "'Helps with foot pain' is the same generic claim on every budget insole. AI agents ranking therapeutic products require specific condition mentions (plantar fasciitis, flat feet, overpronation) and material details to differentiate clinical intent."
      },
      impact: {
        before_score: 0.45,
        after_score: 0.88,
        improvement_percentage: "+96%",
        reason: "Orthopedic specification and condition-specific language targets high-purchase-intent medical queries.",
        detailed_impact: "Explicitly mentioning plantar fasciitis and orthopedic arch support doubles the number of high-intent queries this product can match, including searches from healthcare professionals recommending products to patients."
      },
      fixes: {
        improved_description: "Orthopedic memory foam insoles engineered for plantar fasciitis relief and all-day arch support. Features a 3-layer construction: gel heel cushion, high-density memory foam mid-layer, and a moisture-wicking top fabric. Trimmable to fit any shoe size (Men 7-13, Women 5-11). Clinically recommended for flat feet, overpronation, and long-standing professionals.",
        added_keywords: ["Plantar Fasciitis Insoles", "Orthopedic Insoles", "Arch Support Insoles", "Memory Foam Shoe Insert", "Flat Feet Insoles"],
        structured_tags: ["condition:plantar-fasciitis", "condition:flat-feet", "arch:high-support", "material:memory-foam", "size:trimmable", "use:all-day-wear", "type:orthopedic"],
        faq_suggestions: [
          { question: "Do these help with plantar fasciitis?", answer: "Yes, the deep heel cup and arch support design specifically targets plantar fasciitis pain relief." },
          { question: "What shoe sizes do these fit?", answer: "They are trimmable to fit Men's 7-13 and Women's 5-11. Cutting guides are printed on the insole." }
        ],
        explanation: "Condition-specific medical language and size data transforms this from a generic comfort product to a targeted therapeutic solution, dramatically improving match rates for high-intent medical queries."
      },
      is_audited: true,
      scan_quick: { severity: 6, quick_score: 48, basic_gap: "Vague pain claim without orthopedic specification or size data", priority: "medium" }
    },
    {
      id: "demo-5",
      title: "ArcLight Wireless Desk Lamp",
      handle: "arclight-wireless-lamp",
      original_data: {
        description: "A lamp for your desk. Has different brightness settings.",
        tags: ["lamp", "desk", "lighting"],
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=200&h=200"
      },
      intent: {
        category: "Home Office Lighting",
        target_user: "Remote workers, students, and gamers",
        use_case: "Adjustable task lighting for extended desk sessions",
        price_segment: "Mid-range",
        key_attributes: ["Wireless Charging Base", "3 Color Temperatures", "10 Brightness Levels", "USB-C"],
        important_keywords: ["wireless charging desk lamp", "adjustable color temperature", "study lamp", "gaming lamp"]
      },
      ai_perception: {
        summary: "A standard adjustable desk lamp.",
        target_user: "Office and home users",
        key_benefits: ["Lighting"],
        confidence: 0.38,
        recommendation: "no",
        reason: "No mention of wireless charging, color temperature range, or compatibility data.",
        detailed_reasoning: "The wireless charging capability — the key differentiating feature — is completely absent from the product listing. An AI agent asked 'desk lamp with wireless phone charging for home office' would never surface this product, even though it is the perfect match."
      },
      gaps: {
        missing_attributes: ["Wireless Charging Output (Wattage)", "Color Temperature Range (Kelvin)", "Brightness Level Count", "USB-C Compatibility", "Eye-Care Certification"],
        misinterpretations: ["AI classified as a basic budget lamp, not a premium smart home office tool"],
        confidence_drop_reasons: ["Missing primary differentiation feature (wireless charging)", "No technical specs provided"],
        insight: "The wireless charging feature — the core selling point — is invisible to AI agents.",
        severity: 8,
        impact_level: "high",
        detailed_explanation: "This product's wireless charging base is its primary competitive advantage over hundreds of similar lamps. Without this in the listing data, an AI agent recommending 'work-from-home desk lamps' will rank it below cheaper alternatives that have no wireless charging but better structured data."
      },
      impact: {
        before_score: 0.38,
        after_score: 0.92,
        improvement_percentage: "+142%",
        reason: "Surfacing the wireless charging feature enables matching to premium home-office queries.",
        detailed_impact: "The work-from-home market is highly specification-driven. Adding wireless charging specs, color temperature data, and eye-care certification places this in the premium home-office category where average order values are 3x higher."
      },
      fixes: {
        improved_description: "Premium wireless charging desk lamp with 10 adjustable brightness levels and 3 color temperatures (3000K Warm, 4500K Natural, 6500K Cool). Built-in 10W Qi wireless charging pad — place your phone on the base to charge. USB-C port for additional device charging. TUV Rheinland eye-care certified. Silent touch controls. Ideal for remote work, study sessions, and gaming setups.",
        added_keywords: ["Wireless Charging Desk Lamp", "Adjustable Color Temperature Lamp", "Home Office Lamp", "Eye Care Desk Light", "Study Lamp with Charger"],
        structured_tags: ["feature:wireless-charging", "charging:10W-qi", "color-temp:3000-6500K", "brightness:10-levels", "certification:eye-care", "port:usb-c", "use:home-office", "use:gaming"],
        faq_suggestions: [
          { question: "What phones does the wireless charging support?", answer: "Supports all Qi-compatible phones including iPhone 8 and later, Samsung Galaxy S6 and later, and most Android devices." },
          { question: "Does the USB-C port charge while the wireless pad is also in use?", answer: "Yes, the USB-C port and wireless charging base operate independently and can charge two devices simultaneously." }
        ],
        explanation: "Naming the wireless charging feature explicitly — along with the 10W output and Qi compatibility — is the single change that transforms this from invisible to highly rankable in premium home-office searches."
      },
      is_audited: true,
      scan_quick: { severity: 8, quick_score: 31, basic_gap: "Wireless charging and all technical specs are missing from listing", priority: "high" }
    },
    {
      id: "demo-6",
      title: "Matcha Ceremonial Grade Powder",
      handle: "matcha-ceremonial-grade",
      original_data: {
        description: "Premium matcha green tea powder. Perfect for lattes and smoothies.",
        tags: ["matcha", "tea", "organic"],
        image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=200&h=200"
      },
      intent: {
        category: "Specialty Food and Beverage",
        target_user: "Health-conscious consumers and matcha enthusiasts",
        use_case: "Ceremonial-grade drinking and culinary use",
        price_segment: "Premium",
        key_attributes: ["Ceremonial Grade", "First Harvest", "USDA Organic", "Uji, Japan Origin"],
        important_keywords: ["ceremonial grade matcha", "USDA organic matcha", "first harvest", "Uji matcha"]
      },
      ai_perception: {
        summary: "A green tea powder suitable for drinks.",
        target_user: "Tea drinkers",
        key_benefits: ["Beverage ingredient"],
        confidence: 0.62,
        recommendation: "yes",
        reason: "Recognized as matcha powder, but lacks origin, grade certification, and harvest data.",
        detailed_reasoning: "The term 'ceremonial grade' is used but not backed by origin or harvest cycle data. AI agents aware of matcha quality tiers (ceremonial vs culinary) cannot confirm authenticity without Uji or Nishio origin data and first-harvest specification."
      },
      gaps: {
        missing_attributes: ["Geographic Origin (Prefecture)", "Harvest Cycle (First, Second)", "Certification Details (JAS Organic)", "Taste Profile", "Recommended Preparation Method"],
        misinterpretations: ["Ranked alongside culinary-grade matcha instead of premium ceremonial tier"],
        confidence_drop_reasons: ["'Premium' and 'ceremonial' are unverified claims without origin data"],
        insight: "Unverified 'ceremonial' claim causes ranking alongside culinary-grade competitors.",
        severity: 4,
        impact_level: "low",
        detailed_explanation: "Educated matcha buyers and AI agents filter on geographic origin (Uji vs generic), harvest cycle (first-harvest Ichibancha vs second-harvest), and dual certification (USDA + JAS Organic). Without these, the premium price cannot be justified to AI agents."
      },
      impact: {
        before_score: 0.62,
        after_score: 0.93,
        improvement_percentage: "+50%",
        reason: "Origin and harvest data verifies the ceremonial-grade claim and justifies premium positioning.",
        detailed_impact: "First-harvest Uji matcha is a searchable quality filter for educated consumers. Adding origin and harvest data captures the premium tea segment where average basket sizes are double that of generic tea purchases."
      },
      fixes: {
        improved_description: "Ceremonial-grade matcha from Uji, Kyoto — Japan's most revered tea-growing region. First-harvest Ichibancha leaves shade-grown for 30 days before hand-picking. USDA and JAS Organic dual-certified. Stone-ground to 10-micron fineness for a smooth, umami-rich flavor with no bitterness. Perfect for traditional whisked matcha, oat milk lattes, and smoothie bowls.",
        added_keywords: ["Ceremonial Grade Matcha", "Uji Matcha Powder", "First Harvest Matcha", "USDA Organic Matcha", "Japanese Matcha Powder"],
        structured_tags: ["grade:ceremonial", "origin:uji-kyoto", "harvest:first-ichibancha", "cert:usda-organic", "cert:jas-organic", "grind:stone-ground", "flavor:umami"],
        faq_suggestions: [
          { question: "What makes this ceremonial grade vs culinary grade?", answer: "Ceremonial grade uses first-harvest shade-grown leaves stone-ground to a fine texture — it is meant for drinking straight, not baking. Culinary grade uses later harvests with stronger, more bitter flavor suited for cooking." },
          { question: "Is this suitable for matcha lattes?", answer: "Yes, while primarily a drinking-grade matcha, it produces exceptional lattes with oat or almond milk due to its naturally sweet, umami-rich flavor profile." }
        ],
        explanation: "Origin verification (Uji) and harvest specification (first-harvest Ichibancha) are the two data points educated matcha consumers and AI agents use to filter premium from generic products."
      },
      is_audited: true,
      scan_quick: { severity: 4, quick_score: 62, basic_gap: "Origin and harvest data missing — ceremonial claim is unverified", priority: "medium" }
    }
  ],
  query_simulation: {
    ranked_results: [
      { rank: 1, product_id: "demo-2", match_score: 94, reason: "Explicitly matches reef-safe mineral sunscreen with water resistance data." },
      { rank: 2, product_id: "demo-6", match_score: 88, reason: "Recognized as a beverage-grade matcha with organic certification." }
    ],
    rejected_products: [
      { product_id: "demo-1", reason: "No structured ingredient data to match against skincare queries." },
      { product_id: "demo-3", reason: "Missing resistance level specs required for fitness equipment queries." }
    ]
  }
};
