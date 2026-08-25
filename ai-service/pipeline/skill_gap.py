import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

HIGH_PRIORITY_KEYWORDS = {"java", "python", "react.js", "docker", "aws", "sql", "machine learning", "kubernetes", "spring boot", "fastapi", "node.js"}
MEDIUM_PRIORITY_KEYWORDS = {"typescript", "postgresql", "redis", "ci/cd", "microservices", "pandas", "tensorflow", "pytorch", "rest api"}

class SkillGapAnalyzer:
    @staticmethod
    def analyze_gaps(candidate_skills: List[str], target_job_match: Dict[str, Any]) -> Dict[str, Any]:
        career_role = target_job_match.get("job_title", "Software Engineer")
        matched_skills = target_job_match.get("matched_skills", [])
        missing_skills = target_job_match.get("missing_skills", [])

        total_req = len(matched_skills) + len(missing_skills)
        readiness_score = round((len(matched_skills) / total_req) * 100.0, 1) if total_req > 0 else 50.0

        skill_gaps = []
        high_priorities = []
        med_priorities = []
        low_priorities = []

        for skill in missing_skills:
            skill_lower = skill.lower()
            if any(hp in skill_lower for hp in HIGH_PRIORITY_KEYWORDS):
                priority = "High"
                reason = f"Essential core foundation requirement for {career_role} roles."
                high_priorities.append(skill)
            elif any(mp in skill_lower for mp in MEDIUM_PRIORITY_KEYWORDS):
                priority = "Medium"
                reason = f"Important technology stack enhancement for {career_role} workflows."
                med_priorities.append(skill)
            else:
                priority = "Low"
                reason = f"Supplementary skill that expands overall domain proficiency."
                low_priorities.append(skill)

            skill_gaps.append({
                "skill": skill,
                "priority": priority,
                "reason": reason
            })

        learning_priorities = high_priorities + med_priorities + low_priorities

        return {
            "career_role": career_role,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "skill_gaps": skill_gaps,
            "readiness_score": readiness_score,
            "learning_priorities": learning_priorities
        }
