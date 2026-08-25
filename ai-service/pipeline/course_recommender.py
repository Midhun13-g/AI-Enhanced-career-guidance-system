import logging
from typing import List, Dict, Any
from pipeline.model_loader import compute_semantic_similarity

logger = logging.getLogger(__name__)

COURSE_CATALOG = [
    {
        "id": "c01",
        "skill": "React.js",
        "course_name": "Full Modern React & Redux Toolkit Masterclass",
        "provider": "Udemy",
        "domain": "Web Development",
        "difficulty": "Intermediate",
        "duration": "28 Hours",
        "base_rating": 4.8
    },
    {
        "id": "c02",
        "skill": "Node.js",
        "course_name": "Node.js, Express, MongoDB & More: Complete Bootcamp",
        "provider": "Udemy",
        "domain": "Backend & APIs",
        "difficulty": "Intermediate",
        "duration": "42 Hours",
        "base_rating": 4.7
    },
    {
        "id": "c03",
        "skill": "Java",
        "course_name": "Java Programming Masterclass for Software Developers",
        "provider": "Coursera",
        "domain": "Software Engineering",
        "difficulty": "Beginner to Advanced",
        "duration": "80 Hours",
        "base_rating": 4.9
    },
    {
        "id": "c04",
        "skill": "Spring Boot",
        "course_name": "Building Microservices with Spring Boot & Spring Cloud",
        "provider": "Coursera",
        "domain": "Backend & APIs",
        "difficulty": "Advanced",
        "duration": "35 Hours",
        "base_rating": 4.8
    },
    {
        "id": "c05",
        "skill": "Python",
        "course_name": "Complete Python Developer: Zero to Mastery",
        "provider": "Udemy",
        "domain": "Languages",
        "difficulty": "Beginner",
        "duration": "30 Hours",
        "base_rating": 4.9
    },
    {
        "id": "c06",
        "skill": "Machine Learning",
        "course_name": "Machine Learning Specialization by Andrew Ng",
        "provider": "Coursera / Stanford",
        "domain": "AI & Data Science",
        "difficulty": "Intermediate",
        "duration": "60 Hours",
        "base_rating": 4.95
    },
    {
        "id": "c07",
        "skill": "Deep Learning",
        "course_name": "Deep Learning Specialization",
        "provider": "Coursera / DeepLearning.AI",
        "domain": "AI & Data Science",
        "difficulty": "Advanced",
        "duration": "75 Hours",
        "base_rating": 4.9
    },
    {
        "id": "c08",
        "skill": "Docker",
        "course_name": "Docker & Kubernetes: The Practical Guide",
        "provider": "Udemy",
        "domain": "Cloud & DevOps",
        "difficulty": "Intermediate",
        "duration": "24 Hours",
        "base_rating": 4.8
    },
    {
        "id": "c09",
        "skill": "Kubernetes",
        "course_name": "Certified Kubernetes Administrator (CKA) Prep",
        "provider": "Linux Foundation / Udemy",
        "domain": "Cloud & DevOps",
        "difficulty": "Advanced",
        "duration": "32 Hours",
        "base_rating": 4.85
    },
    {
        "id": "c10",
        "skill": "AWS",
        "course_name": "AWS Certified Solutions Architect Associate",
        "provider": "A Cloud Guru / Udemy",
        "domain": "Cloud & DevOps",
        "difficulty": "Intermediate",
        "duration": "27 Hours",
        "base_rating": 4.8
    },
    {
        "id": "c11",
        "skill": "FastAPI",
        "course_name": "FastAPI - Modern Python Web Development",
        "provider": "TestDriven.io",
        "domain": "Backend & APIs",
        "difficulty": "Intermediate",
        "duration": "18 Hours",
        "base_rating": 4.7
    },
    {
        "id": "c12",
        "skill": "PostgreSQL",
        "course_name": "The Complete SQL & PostgreSQL Bootcamp",
        "provider": "Udemy",
        "domain": "Databases",
        "difficulty": "Beginner to Intermediate",
        "duration": "22 Hours",
        "base_rating": 4.8
    }
]

class CourseRecommender:
    @staticmethod
    def recommend_courses(learning_priorities: List[str], target_role: str = "") -> List[Dict[str, Any]]:
        recommendations = []

        for skill in learning_priorities:
            skill_lower = skill.lower()
            matching_courses = [c for c in COURSE_CATALOG if c["skill"].lower() in skill_lower or skill_lower in c["skill"].lower()]

            if matching_courses:
                for course in matching_courses:
                    sim = compute_semantic_similarity(f"{skill} {target_role}", f"{course['course_name']} {course['domain']}")
                    quality_score = course["base_rating"] / 5.0
                    rec_score = round((0.50 * sim + 0.50 * quality_score) * 100.0, 1)

                    recommendations.append({
                        "target_skill": skill,
                        "recommendation_type": "course",
                        "course_name": course["course_name"],
                        "provider": course["provider"],
                        "domain": course["domain"],
                        "difficulty": course["difficulty"],
                        "duration": course["duration"],
                        "recommendation_score": rec_score,
                        "semantic_similarity": round(sim, 4),
                        "reason": f"Matches required skill '{skill}' for career target '{target_role}'."
                    })
            else:
                # Fallback actionable learning target
                sim = compute_semantic_similarity(f"{skill} {target_role}", f"{skill} mastery target documentation tutorial")
                recommendations.append({
                    "target_skill": skill,
                    "recommendation_type": "learning_target",
                    "course_name": f"{skill} Core Hands-on Learning Project & Docs",
                    "provider": "Official Documentation & Open Source Tutorials",
                    "domain": "Self-Paced Mastery",
                    "difficulty": "Intermediate",
                    "duration": "15 - 20 Hours",
                    "recommendation_score": 75.0,
                    "semantic_similarity": round(sim, 4),
                    "reason": f"Structured self-paced learning target to gain practical proficiency in {skill}."
                })

        # Sort recommendations by recommendation score
        recommendations.sort(key=lambda x: x["recommendation_score"], reverse=True)
        return recommendations
