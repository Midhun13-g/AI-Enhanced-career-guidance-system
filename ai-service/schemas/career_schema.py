from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class SkillGapItem(BaseModel):
    skill: str
    priority: str
    reason: Optional[str] = ""

class SkillGapAnalysis(BaseModel):
    career_role: str
    matched_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    skill_gaps: List[SkillGapItem] = Field(default_factory=list)
    readiness_score: float
    learning_priorities: List[str] = Field(default_factory=list)

class LearningRecommendation(BaseModel):
    target_skill: str
    recommendation_type: str  # "course" or "learning_target"
    course_name: str
    provider: Optional[str] = ""
    domain: Optional[str] = ""
    difficulty: Optional[str] = ""
    duration: Optional[str] = ""
    recommendation_score: float
    semantic_similarity: float
    reason: Optional[str] = ""

class ExplanationItem(BaseModel):
    recommendation: str
    explanation_type: str  # "shap" or "rule_based"
    feature_contributions: Optional[Dict[str, float]] = Field(default_factory=dict)
    human_readable_explanation: str

class CareerRecommendation(BaseModel):
    rank: int
    career_role: str
    career_domain: str
    job_match_score: float
    readiness_score: float
    overall_score: float
    strengths: List[str] = Field(default_factory=list)
    improvement_areas: List[str] = Field(default_factory=list)
    recommended_next_steps: List[str] = Field(default_factory=list)

class RoadmapPhase(BaseModel):
    phase: int
    title: str
    skills_to_learn: List[str] = Field(default_factory=list)
    recommended_courses: List[str] = Field(default_factory=list)
    projects: List[str] = Field(default_factory=list)
    expected_outcome: str
