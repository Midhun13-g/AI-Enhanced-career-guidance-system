from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class JobMatchItem(BaseModel):
    rank: int
    job_title: str
    company: Optional[str] = ""
    domain: Optional[str] = ""
    match_score: float
    matched_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    semantic_similarity: float
    job_summary: Optional[str] = ""

class JobMatchResponse(BaseModel):
    success: bool = True
    request_id: str
    job_matches: List[JobMatchItem] = Field(default_factory=list)
