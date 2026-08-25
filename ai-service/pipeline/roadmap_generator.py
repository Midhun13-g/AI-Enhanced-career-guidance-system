import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class RoadmapGenerator:
    @staticmethod
    def generate_roadmap(
        skill_gaps: List[Dict[str, Any]],
        course_recommendations: List[Dict[str, Any]],
        target_role: str = "Software Engineer"
    ) -> List[Dict[str, Any]]:
        
        high_gaps = [g["skill"] for g in skill_gaps if g.get("priority") == "High"]
        med_gaps = [g["skill"] for g in skill_gaps if g.get("priority") == "Medium"]
        low_gaps = [g["skill"] for g in skill_gaps if g.get("priority") == "Low"]

        all_missing = [g["skill"] for g in skill_gaps]

        if not high_gaps and all_missing:
            high_gaps = all_missing[:2]
            med_gaps = all_missing[2:4]
            low_gaps = all_missing[4:]

        # Map courses to skills
        courses_by_skill: Dict[str, str] = {}
        for rec in course_recommendations:
            skill = rec.get("target_skill")
            course = rec.get("course_name")
            if skill and course and skill not in courses_by_skill:
                courses_by_skill[skill] = course

        phase1_courses = [courses_by_skill[s] for s in high_gaps if s in courses_by_skill]
        phase2_courses = [courses_by_skill[s] for s in med_gaps if s in courses_by_skill]
        phase3_courses = [courses_by_skill[s] for s in low_gaps if s in courses_by_skill]

        roadmap = [
            {
                "phase": 1,
                "title": "Immediate Skill Foundations (Weeks 1 - 4)",
                "skills_to_learn": high_gaps if high_gaps else ["Core Skill Fundamentals"],
                "recommended_courses": phase1_courses if phase1_courses else ["Foundation Developer Training"],
                "projects": [
                    f"Build a foundational application demonstrating {', '.join(high_gaps[:2]) if high_gaps else 'core skills'}.",
                    "Set up GitHub repository with automated CI/CD and clean code architecture."
                ],
                "expected_outcome": f"Eliminate critical skill gaps and gain core readiness for {target_role} entry requirements."
            },
            {
                "phase": 2,
                "title": "Advanced Core Competencies (Weeks 5 - 8)",
                "skills_to_learn": med_gaps if med_gaps else ["Advanced Stack Integration"],
                "recommended_courses": phase2_courses if phase2_courses else ["Intermediate Microservices & Cloud Specialization"],
                "projects": [
                    f"Develop a full-featured microservice architecture leveraging {', '.join(med_gaps[:2]) if med_gaps else 'modern tech stack'}.",
                    "Implement end-to-end unit and integration test coverage with performance benchmarks."
                ],
                "expected_outcome": f"Master intermediate tech stack components and achieve strong competitive alignment for {target_role} roles."
            },
            {
                "phase": 3,
                "title": "Domain Mastery & Capstone Project (Weeks 9 - 12)",
                "skills_to_learn": low_gaps if low_gaps else ["Production Deployment & Optimization"],
                "recommended_courses": phase3_courses if phase3_courses else ["Production Cloud Architecture & Security Mastery"],
                "projects": [
                    f"Build and deploy an enterprise-grade capstone project tailored for {target_role}.",
                    "Optimize application latency, database query performance, and publish live interactive demo."
                ],
                "expected_outcome": f"Complete career readiness with a portfolio-grade capstone project for target role of {target_role}."
            }
        ]

        return roadmap
