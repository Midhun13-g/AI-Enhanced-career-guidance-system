import logging
from typing import List, Dict, Any
from pipeline.model_loader import compute_semantic_similarity

logger = logging.getLogger(__name__)

JOB_DATASET = [
    {
        "id": "job_001",
        "job_title": "Full Stack Developer",
        "company": "Tech Corp",
        "domain": "Software Engineering",
        "required_skills": ["React.js", "Node.js", "JavaScript", "TypeScript", "HTML5", "CSS3", "REST API", "SQL", "Git"],
        "job_summary": "Design and implement end-to-end full stack web applications with modern frontend and backend frameworks."
    },
    {
        "id": "job_002",
        "job_title": "Software Engineer",
        "company": "Enterprise Systems",
        "domain": "Software Engineering",
        "required_skills": ["Java", "Spring Boot", "REST API", "SQL", "PostgreSQL", "Microservices", "Git", "Docker"],
        "job_summary": "Develop high-throughput enterprise backend services, microservices, and database systems."
    },
    {
        "id": "job_003",
        "job_title": "Backend Engineer",
        "company": "Cloud Scale",
        "domain": "Software Engineering",
        "required_skills": ["Python", "FastAPI", "PostgreSQL", "Redis", "REST API", "Docker", "Git", "Microservices"],
        "job_summary": "Build high-performance REST APIs, cache architectures, and distributed backend services."
    },
    {
        "id": "job_004",
        "job_title": "Frontend Developer",
        "company": "Creative UI Solutions",
        "domain": "Web Development",
        "required_skills": ["React.js", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS", "REST API", "Git"],
        "job_summary": "Craft responsive, user-friendly, and accessible web application frontends."
    },
    {
        "id": "job_005",
        "job_title": "Data Scientist",
        "company": "DataInsights AI",
        "domain": "AI & Data Science",
        "required_skills": ["Python", "Machine Learning", "Deep Learning", "Pandas", "NumPy", "Scikit-Learn", "SQL"],
        "job_summary": "Analyze large datasets, construct predictive machine learning models, and derive business metrics."
    },
    {
        "id": "job_006",
        "job_title": "Machine Learning Engineer",
        "company": "Neural Intelligence",
        "domain": "AI & Data Science",
        "required_skills": ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Docker", "REST API"],
        "job_summary": "Train, evaluate, deploy, and monitor scalable deep learning and NLP models in production."
    },
    {
        "id": "job_007",
        "job_title": "DevOps Engineer",
        "company": "Infrastructure Cloud",
        "domain": "Cloud & DevOps",
        "required_skills": ["Docker", "Kubernetes", "AWS", "CI/CD", "Jenkins", "Linux", "Git", "Python"],
        "job_summary": "Automate deployment pipelines, cloud infrastructure, container orchestration, and monitoring."
    },
    {
        "id": "job_008",
        "job_title": "Cloud Architect",
        "company": "Global Cloud Services",
        "domain": "Cloud & DevOps",
        "required_skills": ["AWS", "Microsoft Azure", "Docker", "Kubernetes", "Microservices", "Linux", "CI/CD"],
        "job_summary": "Architect resilient, secure, multi-cloud enterprise architectures and infrastructure solutions."
    },
    {
        "id": "job_009",
        "job_title": "Data Engineer",
        "company": "BigData Pipeline",
        "domain": "AI & Data Science",
        "required_skills": ["Python", "SQL", "PostgreSQL", "MongoDB", "Redis", "Docker", "Git"],
        "job_summary": "Design ETL pipelines, data warehouses, data streams, and high-volume database storage systems."
    },
    {
        "id": "job_010",
        "job_title": "Cybersecurity Analyst",
        "company": "SecureNet Guard",
        "domain": "Cybersecurity",
        "required_skills": ["Linux", "Python", "Problem Solving", "Critical Thinking", "Git"],
        "job_summary": "Monitor security vulnerabilities, implement threat mitigation strategies, and perform security audits."
    }
]

class JobMatcherEngine:
    @staticmethod
    def match_jobs(candidate_skills: List[str], resume_summary: str = "") -> List[Dict[str, Any]]:
        candidate_skills_set = set(candidate_skills)
        matches = []

        candidate_profile_text = " ".join(candidate_skills) + " " + (resume_summary or "")

        for job in JOB_DATASET:
            req_skills = job["required_skills"]
            req_set = set(req_skills)

            matched_skills = sorted(list(candidate_skills_set.intersection(req_set)))
            missing_skills = sorted(list(req_set.difference(candidate_skills_set)))

            # Skill overlap score (0 to 100)
            skill_score = (len(matched_skills) / len(req_skills)) * 100.0 if req_skills else 0.0

            # Semantic vector similarity using sentence-transformers MiniLM-L6-v2
            job_text = job["job_title"] + " " + job["domain"] + " " + " ".join(req_skills) + " " + job["job_summary"]
            semantic_sim = compute_semantic_similarity(candidate_profile_text, job_text)

            # Combined weighted score (60% skill match + 40% semantic similarity)
            overall_match_score = round(0.60 * skill_score + 0.40 * (semantic_sim * 100.0), 1)

            matches.append({
                "job_title": job["job_title"],
                "company": job["company"],
                "domain": job["domain"],
                "match_score": overall_match_score,
                "matched_skills": matched_skills,
                "missing_skills": missing_skills,
                "semantic_similarity": round(semantic_sim, 4),
                "job_summary": job["job_summary"]
            })

        # Sort from highest match score to lowest
        matches.sort(key=lambda x: x["match_score"], reverse=True)

        # Assign ranks
        for idx, item in enumerate(matches, start=1):
            item["rank"] = idx

        return matches
