from fastapi import APIRouter, UploadFile, File, Response, status
from services.resume_service import ResumePipelineService
from services.analysis_service import CachedAnalysisService

router = APIRouter(prefix="/api/resume", tags=["Resume Analysis"])

@router.post("/analyze", status_code=status.HTTP_200_OK)
async def analyze_resume(file: UploadFile = File(...)):
    """
    Core Resume Analysis Endpoint:
    Accepts PDF, DOCX, DOC files via multipart/form-data.
    Runs document extraction (Docling/RapidOCR), MiniLM embeddings, job matching,
    skill gap analysis, course recommendation, SHAP explainability, career guidance, and roadmaps.
    """
    return await ResumePipelineService.process_resume_file(file)

@router.get("/{request_id}")
async def get_full_analysis(request_id: str):
    """Retrieve full analysis result from session cache by request_id."""
    return CachedAnalysisService.get_full_analysis(request_id)

@router.get("/{request_id}/skills")
async def get_skills_breakdown(request_id: str):
    """Retrieve extracted skills and taxonomy categories by request_id."""
    return CachedAnalysisService.get_skills(request_id)

@router.delete("/{request_id}")
async def clear_session_cache(request_id: str):
    """Delete session cache for request_id."""
    return CachedAnalysisService.delete_cache(request_id)
