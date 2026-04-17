from typing import List, Dict, Any

class Scorer:
    @staticmethod
    def calculate_scores(products_data: List[Dict], policies: List[Any], pages: List[Any]) -> Dict[str, Any]:
        # Intelligent scoring with reasons
        
        # 1. Product Context (Safe extraction from both scan and audit)
        total_confidence = 0
        for p in products_data:
            if p.get("is_audited") and p.get("audit_deep"):
                total_confidence += p["audit_deep"]["ai_perception"].get("confidence", 0.5)
            else:
                # Use quick_score as a proxy for confidence (0.0 - 1.0)
                total_confidence += (p.get("scan_quick", {}).get("quick_score", 50) / 100)
        
        avg_confidence = total_confidence / len(products_data) if products_data else 0
        prod_quality = int(avg_confidence * 100)
        prod_reason = "Product data provides clear signals for AI classification." if prod_quality > 70 else "Lacks structured attributes like price, skin type, or clear benefits."

        # 2. Policy Clarity
        policy_score = 85 if policies else 30
        policy_reason = "Essential legal policies detected, building agent trust." if policies else "Missing foundational trust signals (Privacy, Shipping)."

        # 3. FAQ Coverage
        faq_present = any("faq" in p.get("title", "").lower() for p in pages)
        faq_score = 75 if faq_present else 40
        faq_reason = "Dedicated FAQ content helps AI resolve user objections." if faq_present else "Missing explicit FAQs, forcing AI to guess on edge cases."

        # 4. Trust Signals
        trust_score = 80 if len(policies) >= 3 else 45
        trust_reason = "Multiple trust markers (Refund, TOS) are clearly accessible." if trust_score > 70 else "Minimal trust markers detected; agents may flag as high risk."

        # 5. Structured Data
        has_tags = all(p.get("original_data", {}).get("tags") for p in products_data[:5]) if products_data else False
        struct_score = 90 if has_tags else 35
        struct_reason = "Consistent use of Shopify tags enables precise filtering." if has_tags else "Fragmented or missing tags hinder agent categorization."

        overall = int((prod_quality + policy_score + faq_score + trust_score + struct_score) / 5)
        
        return {
            "overall_score": overall,
            "dimension_scores": {
                "Product_Quality": {"score": prod_quality, "reason": prod_reason},
                "Policy_Clarity": {"score": policy_score, "reason": policy_reason},
                "FAQ_Coverage": {"score": faq_score, "reason": faq_reason},
                "Trust_Signals": {"score": trust_score, "reason": trust_reason},
                "Structured_Data": {"score": struct_score, "reason": struct_reason}
            }
        }
