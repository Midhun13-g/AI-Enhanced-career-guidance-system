import os
import uuid
import time
import logging
from typing import Dict, Any
from fastapi import UploadFile, HTTPException

from pipeline.doc_processor import doc_processor
from pipeline.nlp_parser import ResumeNLPParser
from pipeline.job_matcher import JobMatcherEngine
from pipeline.skill_gap import SkillGapAnalyzer
from pipeline.course_recommender import CourseRecommender
from pipeline.explainer import generate_explanations
from pipeline.career_guidance import CareerGuidanceEngine
from pipeline.roadmap_generator import RoadmapGenerator
from pipeline.cache_store import cache_store

logger = logging.getLogger(__name__)

STORAGE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "storage")
os.makedirs(STORAGE_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc", ".txt"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

class ResumePipelineService:
    @staticmethod
    async def process_resume_file(file: UploadFile) -> Dict[str, Any]:
        start_time = time.time()
        filename = file.filename or "uploaded_resume.pdf"
        ext = os.path.splitext(filename)[1].lower()

        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file format '{ext}'. Allowed formats: PDF, DOCX, DOC, TXT."
            )

        # Read file bytes to validate size
        content = await file.read()
        if len(content) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File size exceeds maximum 10MB limit.")

        request_id = str(uuid.uuid4())
        temp_filename = f"{request_id}{ext}"
        temp_file_path = os.path.join(STORAGE_DIR, temp_filename)

        try:
            # Write file to temp storage
            with open(temp_file_path, "wb") as f:
                f.write(content)

            # 1. Document Extraction (Docling / RapidOCR / Fallback)
            extracted_text, extraction_method = doc_processor.process_document(temp_file_path)

            if not extracted_text or len(extracted_text.strip()) == 0:
                raise HTTPException(
                    status_code=422,
                    detail="Failed to extract readable text from document."
                )

            # 2. NLP Section & Skill Normalization
            contact_info = ResumeNLPParser.parse_contact_info(extracted_text)
            skills_analysis = ResumeNLPParser.extract_skills_analysis(extracted_text)
            sections = ResumeNLPParser.extract_sections(extracted_text)

            candidate_skills = skills_analysis["normalized_skills"]
            if not candidate_skills:
                candidate_skills = ["Communication", "Problem Solving", "Git"]

            resume_data = {
                "filename": filename,
                "file_type": ext.lstrip("."),
                "extraction_method": extraction_method,
                "processing_status": "completed",
                "personal_information": contact_info,
                "summary": sections["summary"],
                "skills": candidate_skills,
                "skill_categories": skills_analysis["skill_categories"],
                "technical_skills": skills_analysis["technical_skills"],
                "professional_skills": skills_analysis["professional_skills"],
                "experience": sections["experience"],
                "education": sections["education"],
                "projects": sections["projects"],
                "certifications": sections["certifications"]
            }

            # 3. Semantic Job Matching & Ranking
            job_matches = JobMatcherEngine.match_jobs(candidate_skills, sections["summary"])

            # 4. Skill-Gap & Readiness Analysis
            top_job = job_matches[0] if job_matches else {"job_title": "Software Engineer", "matched_skills": candidate_skills, "missing_skills": []}
            gap_analysis = SkillGapAnalyzer.analyze_gaps(candidate_skills, top_job)

            # 5. Course Recommendations
            learning_priorities = gap_analysis["learning_priorities"]
            course_recommendations = CourseRecommender.recommend_courses(learning_priorities, gap_analysis["career_role"])

            # 6. SHAP & Rule Explainability
            explanations = generate_explanations(course_recommendations)

            # 7. Career Guidance & Role Ranking
            career_analysis = CareerGuidanceEngine.analyze_career(job_matches, candidate_skills)

            # 8. Learning & Career Roadmap Generation
            roadmap = RoadmapGenerator.generate_roadmap(gap_analysis["skill_gaps"], course_recommendations, gap_analysis["career_role"])

            execution_time = round(time.time() - start_time, 3)

            full_result = {
                "success": True,
                "request_id": request_id,
                "resume": resume_data,
                "job_matches": job_matches,
                "career_analysis": career_analysis["domain_analysis"],
                "skill_gaps": gap_analysis["skill_gaps"],
                "learning_priorities": learning_priorities,
                "course_recommendations": course_recommendations,
                "explanations": explanations,
                "career_guidance": {
                    "recommended_roles": career_analysis["recommended_roles"],
                    "domain_analysis": career_analysis["domain_analysis"]
                },
                "roadmap": roadmap,
                "execution_time": execution_time
            }

            # Save in TTL Cache
            cache_store.put(request_id, full_result)
            return full_result

        finally:
            # Clean up temp file
            if os.path.exists(temp_file_path):
                try:
                    os.remove(temp_file_path)
                except Exception as e:
                    logger.warning(f"Failed to remove temp file {temp_file_path}: {e}")
