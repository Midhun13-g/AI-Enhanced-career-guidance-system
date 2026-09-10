import React from 'react';
import { Map, CheckCircle2, ArrowDown, BookOpen, Code2, Target, Flag } from 'lucide-react';

export default function CareerRoadmap({ roadmap }) {
  const phases = Array.isArray(roadmap) ? roadmap : [];

  if (phases.length === 0) {
    return (
      <div className="card p-6 text-center text-slate-500">
        <Map className="mx-auto mb-2 text-slate-300" size={32} />
        <p className="font-bold">No Personalized Career Roadmap Available</p>
      </div>
    );
  }

  return (
    <div className="card p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Map className="text-blue-600" size={22} /> Personalized Career Roadmap
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Dynamic phase-by-phase learning sequence generated specifically for your career goals.
          </p>
        </div>
        <span className="rounded-xl bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-700 border border-blue-100">
          {phases.length} Execution Phases
        </span>
      </div>

      {/* Timeline flow */}
      <div className="space-y-6 relative">
        {phases.map((phase, idx) => {
          const phaseNum = phase.phase ?? (idx + 1);
          const title = phase.title || `Phase ${phaseNum}`;
          const skills = Array.isArray(phase.skillsToLearn) ? phase.skillsToLearn : (Array.isArray(phase.skills_to_learn) ? phase.skills_to_learn : []);
          const courses = Array.isArray(phase.recommendedCourses) ? phase.recommendedCourses : (Array.isArray(phase.recommended_courses) ? phase.recommended_courses : []);
          const projects = Array.isArray(phase.projects) ? phase.projects : [];
          const outcome = phase.expectedOutcome || phase.expected_outcome || null;
          const duration = phase.duration || null;
          const objective = phase.learningObjective || null;
          const skillLinks = Array.isArray(phase.skillCourseLinks) ? phase.skillCourseLinks : [];

          return (
            <React.Fragment key={idx}>
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:border-blue-200 transition duration-200 space-y-5">
                {/* Phase Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 font-black text-white text-sm shadow-md shadow-blue-200">
                      P{phaseNum}
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 block">
                        PHASE {phaseNum}
                      </span>
                      <h3 className="text-lg font-black text-slate-900">{title}</h3>
                      <div className="mt-0.5 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500">
                        {duration && <span className="rounded-md bg-slate-100 px-2 py-0.5">⏱ {duration}</span>}
                        {phase.courseCount != null && phase.courseCount > 0 && <span className="rounded-md bg-slate-100 px-2 py-0.5">{phase.courseCount} course{phase.courseCount === 1 ? '' : 's'}</span>}
                      </div>
                    </div>
                  </div>
                  {objective && <p className="text-xs text-slate-500 leading-relaxed">{objective}</p>}
                  {outcome && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                      <Flag size={13} className="text-blue-600" /> {outcome}
                    </span>
                  )}
                </div>

                {/* Grid for Skills, Courses, Projects */}
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Skills to Learn */}
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                    <h4 className="flex items-center gap-1.5 font-bold text-slate-900 text-xs uppercase tracking-wider mb-2.5">
                      <Target size={14} className="text-blue-600" /> Skills to Acquire
                    </h4>
                    {skills.length > 0 ? (
                      <div className="space-y-1.5">
                        {skills.map((sk, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                            <CheckCircle2 size={14} className="text-blue-500 shrink-0" />
                            <span>{sk}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No specific skills listed.</p>
                    )}
                  </div>

                  {/* Recommended Courses */}
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                    <h4 className="flex items-center gap-1.5 font-bold text-slate-900 text-xs uppercase tracking-wider mb-2.5">
                      <BookOpen size={14} className="text-indigo-600" /> Recommended Courses
                    </h4>
                    {courses.length > 0 ? (
                      <div className="space-y-1.5">
                        {courses.map((crs, cIdx) => (
                          <div key={cIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                            <CheckCircle2 size={14} className="text-indigo-500 shrink-0" />
                            <span>{crs}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Self-guided study.</p>
                    )}
                  </div>

                  {/* Portfolio Projects */}
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                    <h4 className="flex items-center gap-1.5 font-bold text-slate-900 text-xs uppercase tracking-wider mb-2.5">
                      <Code2 size={14} className="text-teal-600" /> Portfolio Milestone Projects
                    </h4>
                    {projects.length > 0 ? (
                      <div className="space-y-1.5">
                        {projects.map((proj, pIdx) => (
                          <div key={pIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                            <CheckCircle2 size={14} className="text-teal-500 shrink-0" />
                            <span>{proj}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No milestone project specified.</p>
                    )}
                  </div>
                </div>

                {/* Skill → course traceability links (Step-9 skill_course_links) */}
                {skillLinks.length > 0 && (
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 mb-2">Skill → course links</h4>
                    <div className="space-y-1.5">
                      {skillLinks.map((link, lIdx) => (
                        <p key={lIdx} className="text-xs text-slate-600">
                          <span className="font-bold text-slate-800">{link.skill}</span>
                          <span className="text-slate-400"> → </span>
                          {(link.courses || []).filter(Boolean).length > 0
                            ? (link.courses || []).filter(Boolean).join(' • ')
                            : <span className="italic text-slate-400">self-directed learning (no verified course)</span>}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Arrow connector between phases */}
              {idx < phases.length - 1 && (
                <div className="flex justify-center my-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                    <ArrowDown size={16} />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
