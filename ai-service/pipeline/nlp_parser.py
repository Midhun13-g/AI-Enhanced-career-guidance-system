import re
from typing import List, Dict, Any, Optional

SKILL_TAXONOMY = {
    # Web & Frontend
    "react": ("React.js", "Technical", "Web Development"),
    "reactjs": ("React.js", "Technical", "Web Development"),
    "react.js": ("React.js", "Technical", "Web Development"),
    "vue": ("Vue.js", "Technical", "Web Development"),
    "vuejs": ("Vue.js", "Technical", "Web Development"),
    "angular": ("Angular", "Technical", "Web Development"),
    "angularjs": ("Angular", "Technical", "Web Development"),
    "nextjs": ("Next.js", "Technical", "Web Development"),
    "next.js": ("Next.js", "Technical", "Web Development"),
    "html": ("HTML5", "Technical", "Web Development"),
    "html5": ("HTML5", "Technical", "Web Development"),
    "css": ("CSS3", "Technical", "Web Development"),
    "css3": ("CSS3", "Technical", "Web Development"),
    "tailwind": ("Tailwind CSS", "Technical", "Web Development"),
    "tailwindcss": ("Tailwind CSS", "Technical", "Web Development"),
    "bootstrap": ("Bootstrap", "Technical", "Web Development"),
    "typescript": ("TypeScript", "Technical", "Languages"),
    "javascript": ("JavaScript", "Technical", "Languages"),
    "js": ("JavaScript", "Technical", "Languages"),

    # Backend & Frameworks
    "node": ("Node.js", "Technical", "Backend & APIs"),
    "nodejs": ("Node.js", "Technical", "Backend & APIs"),
    "express": ("Express.js", "Technical", "Backend & APIs"),
    "expressjs": ("Express.js", "Technical", "Backend & APIs"),
    "spring": ("Spring Boot", "Technical", "Backend & APIs"),
    "springboot": ("Spring Boot", "Technical", "Backend & APIs"),
    "spring boot": ("Spring Boot", "Technical", "Backend & APIs"),
    "fastapi": ("FastAPI", "Technical", "Backend & APIs"),
    "django": ("Django", "Technical", "Backend & APIs"),
    "flask": ("Flask", "Technical", "Backend & APIs"),
    "rest": ("REST API", "Technical", "Backend & APIs"),
    "rest api": ("REST API", "Technical", "Backend & APIs"),
    "restful": ("REST API", "Technical", "Backend & APIs"),
    "graphql": ("GraphQL", "Technical", "Backend & APIs"),
    "microservices": ("Microservices", "Technical", "Architecture"),

    # Languages
    "python": ("Python", "Technical", "Languages"),
    "java": ("Java", "Technical", "Languages"),
    "c++": ("C++", "Technical", "Languages"),
    "cpp": ("C++", "Technical", "Languages"),
    "c#": ("C#", "Technical", "Languages"),
    "csharp": ("C#", "Technical", "Languages"),
    "go": ("Go", "Technical", "Languages"),
    "golang": ("Go", "Technical", "Languages"),
    "rust": ("Rust", "Technical", "Languages"),
    "sql": ("SQL", "Technical", "Languages"),

    # Databases & Caching
    "postgresql": ("PostgreSQL", "Technical", "Databases"),
    "postgres": ("PostgreSQL", "Technical", "Databases"),
    "mysql": ("MySQL", "Technical", "Databases"),
    "mongodb": ("MongoDB", "Technical", "Databases"),
    "mongo": ("MongoDB", "Technical", "Databases"),
    "redis": ("Redis", "Technical", "Databases"),
    "elasticsearch": ("Elasticsearch", "Technical", "Databases"),

    # Cloud & DevOps
    "docker": ("Docker", "Technical", "Cloud & DevOps"),
    "kubernetes": ("Kubernetes", "Technical", "Cloud & DevOps"),
    "k8s": ("Kubernetes", "Technical", "Cloud & DevOps"),
    "aws": ("AWS", "Technical", "Cloud & DevOps"),
    "amazon web services": ("AWS", "Technical", "Cloud & DevOps"),
    "azure": ("Microsoft Azure", "Technical", "Cloud & DevOps"),
    "gcp": ("Google Cloud", "Technical", "Cloud & DevOps"),
    "google cloud": ("Google Cloud", "Technical", "Cloud & DevOps"),
    "ci/cd": ("CI/CD", "Technical", "Cloud & DevOps"),
    "jenkins": ("Jenkins", "Technical", "Cloud & DevOps"),
    "git": ("Git", "Technical", "Tools & Version Control"),
    "github": ("Git", "Technical", "Tools & Version Control"),
    "linux": ("Linux", "Technical", "Systems"),

    # AI / ML & Data Science
    "machine learning": ("Machine Learning", "Technical", "AI & Machine Learning"),
    "ml": ("Machine Learning", "Technical", "AI & Machine Learning"),
    "deep learning": ("Deep Learning", "Technical", "AI & Machine Learning"),
    "dl": ("Deep Learning", "Technical", "AI & Machine Learning"),
    "tensorflow": ("TensorFlow", "Technical", "AI & Machine Learning"),
    "pytorch": ("PyTorch", "Technical", "AI & Machine Learning"),
    "scikit-learn": ("Scikit-Learn", "Technical", "AI & Machine Learning"),
    "pandas": ("Pandas", "Technical", "Data Science"),
    "numpy": ("NumPy", "Technical", "Data Science"),
    "nlp": ("Natural Language Processing", "Technical", "AI & Machine Learning"),

    # Soft Skills & Professional
    "communication": ("Communication", "Professional", "Soft Skills"),
    "leadership": ("Leadership", "Professional", "Soft Skills"),
    "teamwork": ("Teamwork", "Professional", "Soft Skills"),
    "problem solving": ("Problem Solving", "Professional", "Soft Skills"),
    "critical thinking": ("Critical Thinking", "Professional", "Soft Skills"),
    "adaptability": ("Adaptability", "Professional", "Soft Skills"),
    "agile": ("Agile / Scrum", "Professional", "Methodologies"),
    "scrum": ("Agile / Scrum", "Professional", "Methodologies"),
}

EMAIL_RE = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b")
PHONE_RE = re.compile(r"(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}")
LINKEDIN_RE = re.compile(r"linkedin\.com/in/[A-Za-z0-9_-]+", re.IGNORECASE)
GITHUB_RE = re.compile(r"github\.com/[A-Za-z0-9_-]+", re.IGNORECASE)

class ResumeNLPParser:
    @staticmethod
    def parse_contact_info(text: str) -> Dict[str, Optional[str]]:
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        name = lines[0] if lines and len(lines[0]) < 50 and not EMAIL_RE.search(lines[0]) else "Candidate"
        
        emails = EMAIL_RE.findall(text)
        phones = PHONE_RE.findall(text)
        linkedins = LINKEDIN_RE.findall(text)
        githubs = GITHUB_RE.findall(text)

        return {
            "name": name,
            "email": emails[0] if emails else None,
            "phone": phones[0] if phones else None,
            "linkedin": f"https://{linkedins[0]}" if linkedins else None,
            "github": f"https://{githubs[0]}" if githubs else None,
        }

    @staticmethod
    def extract_skills_analysis(text: str) -> Dict[str, Any]:
        lower_text = text.lower()
        raw_found = []
        normalized_set = set()
        technical_skills = set()
        professional_skills = set()
        categories: Dict[str, set] = {}

        for key, (canonical, skill_type, category) in SKILL_TAXONOMY.items():
            pattern = r'\b' + re.escape(key) + r'\b'
            if re.search(pattern, lower_text):
                raw_found.append(key)
                normalized_set.add(canonical)
                if skill_type == "Technical":
                    technical_skills.add(canonical)
                else:
                    professional_skills.add(canonical)
                
                if category not in categories:
                    categories[category] = set()
                categories[category].add(canonical)

        cat_dict = {k: sorted(list(v)) for k, v in categories.items()}

        return {
            "raw_skills": list(dict.fromkeys(raw_found)),
            "normalized_skills": sorted(list(normalized_set)),
            "technical_skills": sorted(list(technical_skills)),
            "professional_skills": sorted(list(professional_skills)),
            "skill_categories": cat_dict,
        }

    @staticmethod
    def extract_sections(text: str) -> Dict[str, Any]:
        # Summary
        summary = ""
        summary_m = re.search(r"(summary|profile|about me|objective)\s*[:\-]?\s*\n(.*?)(?=\n[A-Z][A-Z\s]{3,}|\Z)", text, re.IGNORECASE | re.DOTALL)
        if summary_m:
            summary = summary_m.group(2).strip()[:400]
        else:
            summary = text.strip()[:300] + "..." if len(text) > 300 else text.strip()

        # Education
        education = []
        edu_m = re.search(r"(education|academic|qualification)\s*[:\-]?\s*\n(.*?)(?=\n[A-Z][A-Z\s]{3,}|\Z)", text, re.IGNORECASE | re.DOTALL)
        edu_text = edu_m.group(2) if edu_m else text
        
        degree_patterns = [
            r"\b(b\.?tech|bachelor of technology|b\.?e\.?|bachelor of engineering)\b",
            r"\b(m\.?tech|master of technology|m\.?e\.?|master of engineering)\b",
            r"\b(b\.?sc|bachelor of science|m\.?sc|master of science)\b",
            r"\b(b\.?c\.?a|bachelor of computer applications)\b",
            r"\b(m\.?c\.?a|master of computer applications)\b",
            r"\b(ph\.?d|doctorate)\b",
        ]
        for pat in degree_patterns:
            for m in re.finditer(pat, edu_text, re.IGNORECASE):
                education.append({
                    "degree": m.group(0).strip(),
                    "institution": "University / College",
                    "cgpa": None,
                    "graduationYear": 2024
                })

        # Experience
        experience = []
        exp_m = re.search(r"(experience|work experience|employment|history)\s*[:\-]?\s*\n(.*?)(?=\n[A-Z][A-Z\s]{3,}|\Z)", text, re.IGNORECASE | re.DOTALL)
        if exp_m:
            lines = [l.strip() for l in exp_m.group(2).split("\n") if len(l.strip()) > 10]
            for l in lines[:4]:
                experience.append({
                    "company": "Organization",
                    "designation": l[:60],
                    "duration": "1 - 2 Years",
                    "description": l
                })

        # Projects
        projects = []
        proj_m = re.search(r"(projects?|academic projects?)\s*[:\-]?\s*\n(.*?)(?=\n[A-Z][A-Z\s]{3,}|\Z)", text, re.IGNORECASE | re.DOTALL)
        if proj_m:
            lines = [l.strip() for l in proj_m.group(2).split("\n") if len(l.strip()) > 10]
            for l in lines[:4]:
                techs = [v[0] for k, v in SKILL_TAXONOMY.items() if k in l.lower()]
                projects.append({
                    "name": l[:60],
                    "description": l,
                    "technologies": list(set(techs))[:5],
                    "duration": "3 Months"
                })

        # Certifications
        certifications = []
        cert_keywords = ["certified", "certification", "certificate", "coursera", "udemy", "nptel", "aws certified"]
        for line in text.split("\n"):
            if any(kw in line.lower() for kw in cert_keywords) and len(line.strip()) > 5:
                certifications.append({
                    "name": line.strip()[:100],
                    "provider": "Online Platform",
                    "completionDate": "2024"
                })

        return {
            "summary": summary,
            "education": education,
            "experience": experience,
            "projects": projects,
            "certifications": certifications[:5]
        }
