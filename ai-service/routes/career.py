from fastapi import APIRouter
from services.analysis_service import CachedAnalysisService

router = APIRouter(prefix="/api/resume", tags=["Career Guidance"])

@router.get("/{request_id}/skill-gaps")
async def get_skill_gaps(request_id: str):
    """Retrieve skill gap analysis & learning priorities."""
    return CachedAnalysisService.get_skill_gaps(request_id)

@router.get("/{request_id}/courses")
async def get_course_recommendations(request_id: str):
    """Retrieve recommended courses for missing skills."""
    return CachedAnalysisService.get_courses(request_id)

@router.get("/{request_id}/explanations")
async def get_explanations(request_id: str):
    """Retrieve SHAP & rule-based explainability details."""
    return CachedAnalysisService.get_explanations(request_id)

@router.get("/{request_id}/career-guidance")
async def get_career_guidance(request_id: str):
    """Retrieve career role guidance and domain analysis."""
    return CachedAnalysisService.get_career_guidance(request_id)

@router.get("/{request_id}/roadmap")
async def get_career_roadmap(request_id: str):
    """Retrieve multi-phase career roadmap."""
    return CachedAnalysisService.get_roadmap(request_id)
