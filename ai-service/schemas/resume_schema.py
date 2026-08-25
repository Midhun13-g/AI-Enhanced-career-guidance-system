from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class PersonalInformation(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None

class ParsedEducation(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    cgpa: Optional[str] = None
    graduationYear: Optional[int] = None

class ParsedProject(BaseModel):
    name: str
    description: Optional[str] = None
    technologies: List[str] = Field(default_factory=list)
    duration: Optional[str] = None

class ParsedCertification(BaseModel):
    name: str
    provider: Optional[str] = None
    completionDate: Optional[str] = None

class ParsedExperience(BaseModel):
    company: Optional[str] = None
    designation: Optional[str] = None
    duration: Optional[str] = None
    description: Optional[str] = None

class SkillCategoryBreakdown(BaseModel):
    raw_skills: List[str] = Field(default_factory=list)
    normalized_skills: List[str] = Field(default_factory=list)
    technical_skills: List[str] = Field(default_factory=list)
    professional_skills: List[str] = Field(default_factory=list)
    skill_categories: Dict[str, List[str]] = Field(default_factory=dict)

class ParsedResumeData(BaseModel):
    filename: Optional[str] = ""
    file_type: Optional[str] = ""
    processing_status: str = "completed"
    personal_information: Optional[PersonalInformation] = None
    summary: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    experience: List[ParsedExperience] = Field(default_factory=list)
    education: List[ParsedEducation] = Field(default_factory=list)
    projects: List[ParsedProject] = Field(default_factory=list)
    certifications: List[ParsedCertification] = Field(default_factory=list)

class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[str] = None

class ErrorResponse(BaseModel):
    success: bool = False
    request_id: Optional[str] = None
    error: ErrorDetail

class FullAnalysisResponse(BaseModel):
    success: bool = True
    request_id: str
    resume: Dict[str, Any] = Field(default_factory=dict)
    job_matches: List[Dict[str, Any]] = Field(default_factory=list)
    career_analysis: Dict[str, Any] = Field(default_factory=dict)
    skill_gaps: List[Dict[str, Any]] = Field(default_factory=list)
    learning_priorities: List[Dict[str, Any]] = Field(default_factory=list)
    course_recommendations: List[Dict[str, Any]] = Field(default_factory=list)
    explanations: List[Dict[str, Any]] = Field(default_factory=list)
    career_guidance: Dict[str, Any] = Field(default_factory=dict)
    roadmap: List[Dict[str, Any]] = Field(default_factory=list)
    execution_time: float = 0.0
