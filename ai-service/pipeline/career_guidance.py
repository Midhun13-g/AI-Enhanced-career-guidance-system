import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class CareerGuidanceEngine:
    @staticmethod
    def analyze_career(job_matches: List[Dict[str, Any]], candidate_skills: List[str]) -> Dict[str, Any]:
        recommended_roles = []
        domain_counts: Dict[str, int] = {}
        domain_scores: Dict[str, float] = {}

        for match in job_matches[:5]:
            domain = match.get("domain", "Software Engineering")
            match_score = match.get("match_score", 75.0)
            
            domain_counts[domain] = domain_counts.get(domain, 0) + 1
            domain_scores[domain] = max(domain_scores.get(domain, 0.0), match_score)

        # Build recommended roles
        for match in job_matches[:5]:
            rank = match.get("rank", 1)
            role = match.get("job_title", "Software Engineer")
            domain = match.get("domain", "Software Engineering")
            job_score = match.get("match_score", 75.0)
            matched = match.get("matched_skills", [])
            missing = match.get("missing_skills", [])

            readiness = round((len(matched) / (len(matched) + len(missing))) * 100.0, 1) if (len(matched) + len(missing)) > 0 else 60.0
            overall = round(0.50 * job_score + 0.50 * readiness, 1)

            strengths = [f"Strong background in {s}" for s in matched[:4]]
            if not strengths:
                strengths = ["Strong core problem-solving foundational skills."]

            improvements = [f"Focus on acquiring proficiency in {s}" for s in missing[:3]]
            if not improvements:
                improvements = ["Expand expertise in emerging cloud & AI architectures."]

            next_steps = [
                f"Complete target learning courses for missing skills ({', '.join(missing[:2]) if missing else 'Advanced Architecture'}).",
                f"Build a practical hands-on project demonstrating {role} capabilities.",
                "Prepare targeted resume & portfolio highlighting key technical strengths."
            ]

            recommended_roles.append({
                "rank": rank,
                "career_role": role,
                "career_domain": domain,
                "job_match_score": job_score,
                "readiness_score": readiness,
                "overall_score": overall,
                "strengths": strengths,
                "improvement_areas": improvements,
                "recommended_next_steps": next_steps
            })

        # Primary domain inference
        primary_domain = max(domain_scores.items(), key=lambda x: x[1])[0] if domain_scores else "Software Engineering"
        primary_confidence = domain_scores.get(primary_domain, 80.0)

        return {
            "recommended_roles": recommended_roles,
            "domain_analysis": {
                "primary_domain": primary_domain,
                "domain_confidence": primary_confidence,
                "domain_distribution": domain_counts,
                "summary": f"Candidate demonstrates strong alignment with {primary_domain} roles with an average match readiness of {primary_confidence}%."
            }
        }
