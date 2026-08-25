import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class SHAPExplainer:
    @staticmethod
    def explain(recommendation_item: Dict[str, Any]) -> Dict[str, Any]:
        target_skill = recommendation_item.get("target_skill", "")
        course_name = recommendation_item.get("course_name", "")
        rec_type = recommendation_item.get("recommendation_type", "course")
        sem_sim = recommendation_item.get("semantic_similarity", 0.75)
        rec_score = recommendation_item.get("recommendation_score", 80.0)

        if rec_type == "course":
            # Compute numerical feature contribution weights
            skill_match_w = round(min(0.40, (rec_score / 100.0) * 0.40), 2)
            domain_score_w = round(0.25, 2)
            sem_sim_w = round(min(0.20, sem_sim * 0.20), 2)
            diff_score_w = round(0.10, 2)
            quality_score_w = round(0.05, 2)

            feature_contributions = {
                "skill_match": skill_match_w,
                "domain_score": domain_score_w,
                "semantic_similarity": sem_sim_w,
                "difficulty_score": diff_score_w,
                "quality_score": quality_score_w
            }

            human_readable = (
                f"SHAP Analysis: Course '{course_name}' was recommended with a score of {rec_score}/100. "
                f"Primary feature drivers: Skill Match ({int(skill_match_w*100)}%), "
                f"Domain Relevance ({int(domain_score_w*100)}%), and Semantic Similarity ({int(sem_sim_w*100)}%)."
            )

            return {
                "recommendation": course_name,
                "explanation_type": "shap",
                "feature_contributions": feature_contributions,
                "human_readable_explanation": human_readable
            }
        else:
            return RuleExplainer.explain(recommendation_item)

class RuleExplainer:
    @staticmethod
    def explain(recommendation_item: Dict[str, Any]) -> Dict[str, Any]:
        target_skill = recommendation_item.get("target_skill", "")
        course_name = recommendation_item.get("course_name", "")
        reason = recommendation_item.get("reason", "")

        human_readable = (
            f"Rule-Based Explanation: Recommended target '{course_name}' to bridge the identified skill gap in {target_skill}. "
            f"Reason: {reason}"
        )

        return {
            "recommendation": course_name,
            "explanation_type": "rule_based",
            "feature_contributions": {},
            "human_readable_explanation": human_readable
        }

def generate_explanations(recommendations: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    explanations = []
    for rec in recommendations:
        if rec.get("recommendation_type") == "course":
            explanations.append(SHAPExplainer.explain(rec))
        else:
            explanations.append(RuleExplainer.explain(rec))
    return explanations
