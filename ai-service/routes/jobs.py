from fastapi import APIRouter
from services.analysis_service import CachedAnalysisService

router = APIRouter(prefix="/api/resume", tags=["Job Matching"])

@router.get("/{request_id}/jobs")
async def get_job_matches(request_id: str):
    """Retrieve job match rankings for request_id."""
    return CachedAnalysisService.get_jobs(request_id)
