import os
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import re

# Import AI Guidance Routers
from routes import resume, jobs, career

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai_service")

app = FastAPI(
    title="AI Career Guidance System API",
    description="Full AI Career Guidance system processing PDF/DOCX resumes, semantic matching, skill gaps, course recommendations, SHAP explainability, and career roadmaps.",
    version="2.0.0"
)

# Register Router Modules
app.include_router(resume.router)
app.include_router(jobs.router)
app.include_router(career.router)

# ---------------------------------------------------------------------------
# Legacy NLP Schema & Parsing Logic for Backward Compatibility
# ---------------------------------------------------------------------------

class ParseRequest(BaseModel):
    resumeText: str
    fileName: Optional[str] = None

class NlpSkill(BaseModel):
    name: str
    confidence: float

class NlpEducation(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    cgpa: Optional[str] = None
    graduationYear: Optional[int] = None

class NlpProject(BaseModel):
    name: str
    description: Optional[str] = None
    technologies: List[str] = []
    duration: Optional[str] = None

class NlpCertification(BaseModel):
    name: str
    provider: Optional[str] = None
    completionDate: Optional[str] = None

class NlpExperience(BaseModel):
    company: Optional[str] = None
    designation: Optional[str] = None
    duration: Optional[str] = None
    description: Optional[str] = None

class ParseResponse(BaseModel):
    skills: List[NlpSkill] = []
    education: List[NlpEducation] = []
    projects: List[NlpProject] = []
    certifications: List[NlpCertification] = []
    experience: List[NlpExperience] = []
    resumeScore: float = 0.0
    summary: Optional[str] = None

SKILL_TAXONOMY = {
    "reactjs": "React.js", "react js": "React.js", "react": "React.js",
    "nodejs": "Node.js", "node js": "Node.js", "node": "Node.js",
    "postgresql": "PostgreSQL", "postgres": "PostgreSQL", "postgresSQL": "PostgreSQL",
    "springboot": "Spring Boot", "spring boot": "Spring Boot", "spring": "Spring Boot",
    "machine learning": "Machine Learning", "ml": "Machine Learning",
    "deep learning": "Deep Learning", "dl": "Deep Learning",
    "tensorflow": "TensorFlow", "pytorch": "PyTorch",
    "docker": "Docker", "kubernetes": "Kubernetes", "k8s": "Kubernetes",
    "aws": "AWS", "amazon web services": "AWS",
    "gcp": "Google Cloud", "google cloud": "Google Cloud",
    "azure": "Microsoft Azure",
    "python": "Python", "java": "Java", "javascript": "JavaScript",
    "typescript": "TypeScript", "c++": "C++", "c#": "C#", "golang": "Go", "go": "Go",
    "sql": "SQL", "mongodb": "MongoDB", "redis": "Redis", "mysql": "MySQL",
    "git": "Git", "github": "Git", "rest api": "REST API", "restful": "REST API",
    "graphql": "GraphQL", "microservices": "Microservices",
    "ci/cd": "CI/CD", "jenkins": "Jenkins", "github actions": "GitHub Actions",
    "html": "HTML", "css": "CSS", "tailwind": "Tailwind CSS",
    "flutter": "Flutter", "react native": "React Native",
    "fastapi": "FastAPI", "django": "Django", "flask": "Flask",
    "hibernate": "Hibernate", "jpa": "JPA",
    "kafka": "Apache Kafka", "rabbitmq": "RabbitMQ",
    "elasticsearch": "Elasticsearch", "linux": "Linux",
}

DEGREE_PATTERNS = [
    r"\b(b\.?tech|bachelor of technology|b\.?e\.?|bachelor of engineering)\b",
    r"\b(m\.?tech|master of technology|m\.?e\.?|master of engineering)\b",
    r"\b(b\.?sc|bachelor of science|m\.?sc|master of science)\b",
    r"\b(b\.?c\.?a|bachelor of computer applications)\b",
    r"\b(m\.?c\.?a|master of computer applications)\b",
    r"\b(b\.?b\.?a|m\.?b\.?a)\b",
    r"\b(ph\.?d|doctorate)\b",
]

CERT_KEYWORDS = [
    "certified", "certification", "certificate", "aws certified",
    "google certified", "microsoft certified", "coursera", "udemy",
    "nptel", "oracle certified", "cisco", "comptia",
]

PROJECT_SECTION_RE = re.compile(
    r"(projects?|personal projects?|academic projects?)\s*[:\-]?\s*\n(.*?)(?=\n[A-Z][A-Z\s]{3,}|\Z)",
    re.IGNORECASE | re.DOTALL
)

EXPERIENCE_SECTION_RE = re.compile(
    r"(experience|work experience|internship|employment)\s*[:\-]?\s*\n(.*?)(?=\n[A-Z][A-Z\s]{3,}|\Z)",
    re.IGNORECASE | re.DOTALL
)

EDUCATION_SECTION_RE = re.compile(
    r"(education|academic background|qualifications?)\s*[:\-]?\s*\n(.*?)(?=\n[A-Z][A-Z\s]{3,}|\Z)",
    re.IGNORECASE | re.DOTALL
)

YEAR_RE = re.compile(r"\b(20\d{2}|19\d{2})\b")
CGPA_RE = re.compile(r"\b(\d\.\d{1,2})\s*(cgpa|gpa|/10|/4)?\b", re.IGNORECASE)

def extract_skills(text: str) -> List[NlpSkill]:
    lower = text.lower()
    found = []
    seen = set()
    for raw, normalized in SKILL_TAXONOMY.items():
        if re.search(r'\b' + re.escape(raw) + r'\b', lower):
            if normalized not in seen:
                seen.add(normalized)
                found.append(NlpSkill(name=normalized, confidence=round(0.80 + (len(raw) % 20) * 0.01, 2)))
    return found

def extract_education(text: str) -> List[NlpEducation]:
    results = []
    section_match = EDUCATION_SECTION_RE.search(text)
    section_text = section_match.group(2) if section_match else text

    for pattern in DEGREE_PATTERNS:
        for m in re.finditer(pattern, section_text, re.IGNORECASE):
            edu = NlpEducation(degree=m.group(0).strip())
            years = YEAR_RE.findall(section_text[max(0, m.start()-200):m.end()+200])
            if years:
                edu.graduationYear = int(max(years))
            cgpa_m = CGPA_RE.search(section_text[max(0, m.start()-200):m.end()+200])
            if cgpa_m:
                edu.cgpa = cgpa_m.group(1)
            results.append(edu)

    return results[:3]

def extract_projects(text: str) -> List[NlpProject]:
    results = []
    section_match = PROJECT_SECTION_RE.search(text)
    if not section_match:
        return results
    section = section_match.group(2)
    lines = [l.strip() for l in section.split("\n") if l.strip()]
    for line in lines[:5]:
        if len(line) > 10:
            techs = [SKILL_TAXONOMY[s] for s in SKILL_TAXONOMY if re.search(r'\b' + re.escape(s) + r'\b', line.lower())]
            results.append(NlpProject(name=line[:80], technologies=list(set(techs))[:5]))
    return results

def extract_certifications(text: str) -> List[NlpCertification]:
    results = []
    lines = text.split("\n")
    for line in lines:
        lower = line.lower()
        if any(kw in lower for kw in CERT_KEYWORDS) and len(line.strip()) > 5:
            results.append(NlpCertification(name=line.strip()[:120]))
    return results[:5]

def extract_experience(text: str) -> List[NlpExperience]:
    results = []
    section_match = EXPERIENCE_SECTION_RE.search(text)
    if not section_match:
        return results
    section = section_match.group(2)
    lines = [l.strip() for l in section.split("\n") if l.strip()]
    for line in lines[:4]:
        if len(line) > 10:
            results.append(NlpExperience(designation=line[:80]))
    return results

def calculate_score(skills, education, projects, certifications, experience) -> float:
    score = 0.0
    score += min(40, len(skills) * 4)
    score += min(20, len(education) * 10)
    score += min(20, len(projects) * 5)
    score += min(10, len(certifications) * 3)
    score += min(10, len(experience) * 3)
    return round(min(100.0, score), 2)

# ---------------------------------------------------------------------------
# Health & Backward-Compatible Endpoints
# ---------------------------------------------------------------------------

@app.get("/health")
def health():
    return {"status": "AI Career Guidance Service is running", "version": "2.0.0"}

@app.post("/api/nlp/parse", response_model=ParseResponse)
def parse_resume(req: ParseRequest):
    if not req.resumeText or len(req.resumeText.strip()) < 50:
        raise HTTPException(status_code=422, detail="Resume text is too short to parse")

    text = req.resumeText

    skills = extract_skills(text)
    education = extract_education(text)
    projects = extract_projects(text)
    certifications = extract_certifications(text)
    experience = extract_experience(text)
    score = calculate_score(skills, education, projects, certifications, experience)

    summary = (
        f"Extracted {len(skills)} skills, {len(education)} education entries, "
        f"{len(projects)} projects, {len(certifications)} certifications, "
        f"{len(experience)} experience entries. Resume score: {score}/100."
    )

    return ParseResponse(
        skills=skills,
        education=education,
        projects=projects,
        certifications=certifications,
        experience=experience,
        resumeScore=score,
        summary=summary,
    )

# ---------------------------------------------------------------------------
# Gradio UI Integration (for Hugging Face Spaces UI tab)
# ---------------------------------------------------------------------------
try:
    import gradio as gr
    def gradio_interface():
        with gr.Blocks(title="AI Career Guidance System") as demo:
            gr.Markdown("# AI Career Guidance & Resume Analysis System")
            gr.Markdown("Upload your Resume (PDF/DOCX) to get complete job matching, skill gaps, course recommendations, SHAP explainability, and career roadmap.")
            file_input = gr.File(label="Upload Resume (PDF/DOCX)")
            output_json = gr.JSON(label="Full AI Analysis Result")
            
            async def run_gradio_pipeline(file_obj):
                if file_obj is None:
                    return {"error": "No file uploaded."}
                from services.resume_service import ResumePipelineService
                from fastapi import UploadFile
                
                with open(file_obj.name, "rb") as f:
                    content = f.read()
                
                upload_file = UploadFile(filename=os.path.basename(file_obj.name), file=open(file_obj.name, "rb"))
                return await ResumePipelineService.process_resume_file(upload_file)

            analyze_btn = gr.Button("Analyze Resume", variant="primary")
            analyze_btn.click(fn=run_gradio_pipeline, inputs=[file_input], outputs=[output_json])
        return demo

    gr_app = gradio_interface()
    app = gr.mount_gradio_app(app, gr_app, path="/gradio")
    logger.info("Mounted Gradio interface at /gradio")
except Exception as e:
    logger.info(f"Gradio mounting skipped: {e}")
