import logging
from typing import Dict, Any, Optional
from fastapi import HTTPException
from pipeline.cache_store import cache_store

logger = logging.getLogger(__name__)

class CachedAnalysisService:
    @staticmethod
    def get_full_analysis(request_id: str) -> Dict[str, Any]:
        data = cache_store.get(request_id)
        if not data:
            raise HTTPException(
                status_code=404,
                detail=f"Analysis session '{request_id}' not found or expired."
            )
        return data

    @staticmethod
    def get_skills(request_id: str) -> Dict[str, Any]:
        full = CachedAnalysisService.get_full_analysis(request_id)
        resume = full.get("resume", {})
        return {
            "request_id": request_id,
            "skills": resume.get("skills", []),
            "skill_categories": resume.get("skill_categories", {}),
            "technical_skills": resume.get("technical_skills", []),
            "professional_skills": resume.get("professional_skills", [])
        }

    @staticmethod
    def get_jobs(request_id: str) -> Dict[str, Any]:
        full = CachedAnalysisService.get_full_analysis(request_id)
        return {
            "request_id": request_id,
            "job_matches": full.get("job_matches", [])
        }

    @staticmethod
    def get_skill_gaps(request_id: str) -> Dict[str, Any]:
        full = CachedAnalysisService.get_full_analysis(request_id)
        return {
            "request_id": request_id,
            "skill_gaps": full.get("skill_gaps", []),
            "learning_priorities": full.get("learning_priorities", [])
        }

    @staticmethod
    def get_courses(request_id: str) -> Dict[str, Any]:
        full = CachedAnalysisService.get_full_analysis(request_id)
        return {
            "request_id": request_id,
            "course_recommendations": full.get("course_recommendations", [])
        }

    @staticmethod
    def get_explanations(request_id: str) -> Dict[str, Any]:
        full = CachedAnalysisService.get_full_analysis(request_id)
        return {
            "request_id": request_id,
            "explanations": full.get("explanations", [])
        }

    @staticmethod
    def get_career_guidance(request_id: str) -> Dict[str, Any]:
        full = CachedAnalysisService.get_full_analysis(request_id)
        return {
            "request_id": request_id,
            "career_guidance": full.get("career_guidance", {})
        }

    @staticmethod
    def get_roadmap(request_id: str) -> Dict[str, Any]:
        full = CachedAnalysisService.get_full_analysis(request_id)
        return {
            "request_id": request_id,
            "roadmap": full.get("roadmap", [])
        }

    @staticmethod
    def delete_cache(request_id: str) -> Dict[str, Any]:
        deleted = cache_store.delete(request_id)
        if not deleted:
            raise HTTPException(status_code=404, detail=f"Session '{request_id}' not found.")
        return {"success": True, "message": f"Session '{request_id}' cleared."}
