/**
 * Central Adapter / Normalizer for AI Career Guidance Analysis
 * Normalizes raw API response (from Python AI API or Spring Boot proxy)
 * into a single predictable frontend data model.
 */

function toArray(val) {
  if (Array.isArray(val)) return val;
  if (val !== null && val !== undefined && val !== '') return [val];
  return [];
}

function normalizeScore(score) {
  if (typeof score !== 'number' || isNaN(score)) return 0;
  if (score <= 1) return Math.round(score * 100);
  return Math.round(score);
}

function toTextList(value) {
  return toArray(value)
    .map((item) => typeof item === 'string'
      ? item
      : (item?.skill || item?.canonical_skill || item?.name || item?.title || ''))
    .filter(Boolean);
}

function readPipelineResult(rawResponse) {
  if (typeof rawResponse !== 'string' || !rawResponse.trim()) return null;
  try {
    const parsed = JSON.parse(rawResponse);
    const root = Array.isArray(parsed) ? parsed[0] : parsed;
    return root?.final_result && typeof root.final_result === 'object' ? root.final_result : null;
  } catch {
    return null;
  }
}

// The HF Step 9 response is role-centric. Some backend versions persist the
// compact DTO plus the complete Step 9 payload in raw_ai_response. Rehydrate
// that payload here so saved analyses remain fully usable without re-running
// a limited daily resume analysis.
function hydrateStep9Data(data) {
  const step9 = readPipelineResult(data.raw_ai_response || data.rawAiResponse);
  if (!step9) return data;

  const selectedRole = step9.selected_role || step9.default_selected_role || {};
  const courseExplanations = toArray(selectedRole.recommended_courses)
    .map((item) => item?.explanation)
    .filter(Boolean);

  return {
    ...data,
    resume: {
      ...(data.resume || {}),
      career_profile: step9.career_profile || data.resume?.career_profile,
      skills: toArray(selectedRole.skills_you_have).length > 0
        ? selectedRole.skills_you_have
        : data.resume?.skills,
    },
    career_analysis: step9.career_profile || data.career_analysis,
    career_guidance: {
      ...(data.career_guidance || {}),
      recommended_roles: step9.top_5_roles || data.career_guidance?.recommended_roles,
      domain_analysis: step9.career_profile || data.career_guidance?.domain_analysis,
    },
    job_matches: toArray(step9.top_5_roles).length > 0 ? step9.top_5_roles : data.job_matches,
    selected_role: selectedRole,
    role_guidance: step9.role_guidance || data.role_guidance,
    skill_gaps: toTextList(selectedRole.skill_gap?.required?.missing_skills).length > 0
      ? [
          ...toTextList(selectedRole.skill_gap?.required?.missing_skills).map((skill) => ({ skill, priority: 'HIGH', reason: 'Required for the selected role' })),
          ...toTextList(selectedRole.skill_gap?.preferred?.missing_skills).map((skill) => ({ skill, priority: 'MEDIUM', reason: 'Preferred for the selected role' })),
          ...toTextList(selectedRole.skill_gap?.soft_skills?.missing_skills).map((skill) => ({ skill, priority: 'LOW', reason: 'Professional skill for the selected role' })),
        ]
      : (toArray(selectedRole.skills_to_learn).length > 0 ? selectedRole.skills_to_learn : data.skill_gaps),
    learning_priorities: toArray(step9.learning_priorities).length > 0
      ? step9.learning_priorities
      : (selectedRole.skills_to_learn || data.learning_priorities),
    course_recommendations: toArray(selectedRole.recommended_courses).length > 0
      ? selectedRole.recommended_courses
      : data.course_recommendations,
    explanations: courseExplanations.length > 0 ? courseExplanations : data.explanations,
    roadmap: toArray(step9.roadmap_phases).length > 0 ? step9.roadmap_phases : data.roadmap,
  };
}

export function normalizeAnalysisResponse(raw) {
  if (!raw) return null;

  // Handle wrapper envelope { success: true, data: { ... } }
  const responseData = (raw.data && typeof raw.data === 'object' && (raw.data.resume || raw.data.job_matches || raw.data.career_analysis))
    ? raw.data
    : raw;
  const data = hydrateStep9Data(responseData);

  // 1. Resume section
  const rawResume = data.resume || data.parsed_resume || data.resume_overview || {};
  const personal = rawResume.personal_information || rawResume.personal_info || {};

  const name = personal.name || rawResume.name || rawResume.candidate_name || 'Resume Candidate';
  const email = personal.email || rawResume.email || null;
  const phone = personal.phone || rawResume.phone || null;
  const location = personal.location || rawResume.location || null;
  const summary = rawResume.summary || rawResume.profile_summary || rawResume.objective || null;

  const fallbackSkills = toArray(data.selected_role?.skills_you_have);
  const skills = toArray(rawResume.skills || rawResume.normalized_skills || rawResume.extracted_skills).length > 0
    ? toArray(rawResume.skills || rawResume.normalized_skills || rawResume.extracted_skills)
    : fallbackSkills;
  const skillCategories = rawResume.skill_categories && typeof rawResume.skill_categories === 'object' ? rawResume.skill_categories : {};
  const technicalSkills = toArray(rawResume.technical_skills);
  const professionalSkills = toArray(rawResume.professional_skills);

  const education = toArray(rawResume.education);
  const experience = toArray(rawResume.experience);
  const projects = toArray(rawResume.projects);
  const certifications = toArray(rawResume.certifications);

  // 2. Job matches section
  const rawMatches = toArray(data.job_matches || data.jobMatches || data.top_5_roles);
  const jobMatches = rawMatches.map((job, idx) => {
    const rank = job.rank ?? (idx + 1);
    const jobTitle = job.job_title || job.jobTitle || job.title || 'Career Role';
    const company = job.company || '';
    const domain = job.domain || job.career_domain || '';
    const rawScore = job.match_score ?? job.matchScore ?? job.job_match_score ?? job.match_percentage ?? job.overall_score ?? job.combined_score ?? job.final_role_score ?? job.semantic_similarity ?? 0;
    const matchScore = normalizeScore(rawScore);
    const roleGuide = toArray(data.role_guidance).find((role) => role?.job?.job_id === job.job_id || role?.job?.job_title === jobTitle);
    const matchedSkills = toTextList(job.matched_skills || job.matchedSkills || job.role_explanation?.skills_you_have || roleGuide?.skills_you_have);
    const missingSkills = toTextList(job.missing_skills || job.missingSkills || job.role_explanation?.main_skill_gaps || roleGuide?.skills_to_learn);
    const semanticSimilarity = typeof job.semantic_similarity === 'number' ? job.semantic_similarity : null;
    const jobSummary = job.job_summary || job.jobSummary || job.role_explanation?.summary || job.summary || '';

    return {
      rank,
      jobTitle,
      company,
      domain,
      matchScore,
      matchedSkills,
      missingSkills,
      semanticSimilarity,
      jobSummary,
    };
  });

  // 3. Career Analysis & Guidance section
  const careerAnalysis = data.career_analysis || data.careerAnalysis || {};
  const careerGuidance = data.career_guidance || data.careerGuidance || {};
  const careerProfile = data.career_profile || {};
  const primaryDomain = careerAnalysis.primary_domain || careerGuidance.domain_analysis?.primary_domain || careerProfile.primary_domain || (jobMatches[0]?.domain) || '';
  const rawDomainConf = careerAnalysis.domain_confidence || careerAnalysis.primary_confidence || careerGuidance.domain_analysis?.domain_confidence || careerGuidance.domain_analysis?.primary_confidence || careerProfile.primary_confidence || (jobMatches[0]?.matchScore) || 0;
  const domainConfidence = normalizeScore(rawDomainConf);
  const domainSummary = careerAnalysis.summary || careerGuidance.domain_analysis?.summary || careerProfile.domain_explanation?.primary_domain_selection_reason || '';
  const recommendedRoles = toArray(careerGuidance.recommended_roles || careerGuidance.recommendedRoles || data.top_5_roles);

  // 4. Skill Gap Analysis & Priorities section
  const selectedRole = data.selected_role || (data.role_guidance && data.role_guidance[0]) || {};
  const rawGaps = toArray(data.skill_gaps || data.skillGaps || selectedRole.skills_to_learn || selectedRole.skill_gap?.required?.missing_skills);
  const skillGaps = rawGaps.map((item) => {
    if (typeof item === 'string') {
      return { skill: item, priority: 'HIGH', reason: 'Target role requirement' };
    }
    return {
      skill: item.skill || item.canonical_skill || item.name || '',
      priority: item.priority || (item.category === 'REQUIRED' ? 'HIGH' : 'MEDIUM'),
      reason: item.reason || item.description || `Requirement for ${selectedRole.job?.job_title || 'target role'}`,
    };
  });

  const learningPriorities = toArray(data.learning_priorities || data.learningPriorities || selectedRole.learning_priorities);

  // 5. Course Recommendations section
  const extractedRoleCourses = data.role_guidance
    ? data.role_guidance.flatMap(rg => toArray(rg.recommended_courses))
    : [];
  const rawCourses = toArray(data.course_recommendations || data.courseRecommendations || data.recommended_courses || selectedRole.recommended_courses || extractedRoleCourses);
  const courses = rawCourses.map((c) => {
    const courseObj = c.course || c;
    return {
      title: courseObj.title || courseObj.course_name || courseObj.courseName || c.skill || '',
      provider: courseObj.provider || courseObj.institution || courseObj.platform || '',
      targetSkill: c.target_skill || c.skill || courseObj.target_skill || '',
      difficulty: courseObj.difficulty || 'Intermediate',
      duration: courseObj.duration || (courseObj.duration_hours ? `${courseObj.duration_hours} hrs` : ''),
      reason: c.explanation?.why_this_course || c.explanation?.why_you_need_it || c.reason || courseObj.reason || '',
      url: courseObj.course_url || courseObj.courseUrl || courseObj.url || courseObj.link
        || courseObj.course_link || courseObj.courseLink || courseObj.href || null,
      score: normalizeScore(courseObj.final_score || courseObj.score_percentage || c.recommendation_score || c.score || 0),
    };
  });

  // 6. Explainability section
  const extractedRoleExplanations = data.role_guidance
    ? data.role_guidance.flatMap(rg => toArray(rg.recommended_courses).map(c => c.explanation).filter(Boolean))
    : [];
  const rawExplanations = toArray(data.explanations || data.recommendation_explanations || data.explainability || extractedRoleExplanations);
  const explanations = rawExplanations.map((exp) => ({
    factor: exp.target_skill || exp.title || exp.recommendation || exp.factor || 'Match Factor',
    explanation: exp.why_this_course || exp.why_you_need_it || exp.human_readable_explanation || exp.humanReadableExplanation || exp.explanation || exp.reasoning || '',
    featureContributions: exp.feature_contributions || exp.featureContributions || null,
  }));

  // 7. Roadmap section
  const selectedRoleGapSkills = new Set([
    ...toTextList(selectedRole.skill_gap?.required?.missing_skills),
    ...toTextList(selectedRole.skill_gap?.preferred?.missing_skills),
    ...toTextList(selectedRole.skill_gap?.soft_skills?.missing_skills),
  ].map((skill) => skill.toLowerCase()));
  const rawRoadmap = toArray(data.roadmap || data.roadmap_phases || selectedRole.roadmap);
  const roadmap = rawRoadmap.map((p, idx) => ({
    phase: p.phase ?? p.phase_number ?? (idx + 1),
    title: p.title || p.phase_name || `Phase ${idx + 1}`,
    duration: p.duration || p.estimated_duration || '',
    skillsToLearn: toTextList(p.skills_to_learn || p.skillsToLearn || p.target_skills || p.missing_skills_covered)
      .filter((skill) => selectedRoleGapSkills.size === 0 || selectedRoleGapSkills.has(skill.toLowerCase())),
    recommendedCourses: toArray(p.recommended_courses || p.recommendedCourses)
      .map((course) => typeof course === 'string' ? course : (course.course?.title || course.title || course.skill || 'Learning resource')),
    projects: toArray(p.projects),
    expectedOutcome: p.expected_outcome || p.expectedOutcome || p.learning_objective || p.completion_criteria || '',
  })).filter((phase) => phase.skillsToLearn.length > 0 || phase.recommendedCourses.length > 0 || phase.projects.length > 0);

  const normalizedRoadmap = roadmap.map((phase) => ({
    ...phase,
    title: phase.skillsToLearn.length > 0 ? `Phase ${phase.phase}: Learn ${phase.skillsToLearn.join(', ')}` : phase.title,
  }));
  const roleFit = selectedRole.career_fit || {};
  const selectedJob = selectedRole.job || {};

  return {
    requestId: data.request_id || data.requestId || 'gradio-' + Date.now(),
    executionTime: data.execution_time || data.executionTime || null,
    resume: {
      candidateName: name,
      email,
      phone,
      location,
      summary,
      careerProfile: rawResume.career_profile || rawResume.careerProfile || data.career_profile || null,
      skills,
      skillCategories,
      technicalSkills,
      professionalSkills,
      education,
      experience,
      projects,
      certifications,
      totalSkills: skills.length,
    },
    career: {
      primaryDomain,
      domainConfidence,
      domainSummary,
      domainScores: careerAnalysis.candidate_domain_profile || careerGuidance.domain_analysis?.candidate_domain_profile || careerProfile.candidate_domain_profile || {},
      recommendedRoles,
      selectedRole: {
        title: selectedJob.job_title || selectedRole.job_title || jobMatches[0]?.jobTitle || '',
        readiness: normalizeScore(roleFit.career_readiness_percentage),
        skillGap: normalizeScore(roleFit.overall_skill_gap_percentage),
        domainAlignment: normalizeScore(selectedJob.domain_score),
        finalRoleScore: normalizeScore(selectedJob.final_role_score),
        status: roleFit.status || '',
        summary: selectedRole.role_explanation?.summary || '',
      },
    },
    jobMatches,
    skillGap: {
      gaps: skillGaps,
      priorities: learningPriorities,
    },
    courses,
    explanations,
    roadmap: normalizedRoadmap,
    raw: data,
  };
}
