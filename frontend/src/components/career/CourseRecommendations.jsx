import React from 'react';
import { BookOpen, ExternalLink, Award, Sparkles, AlertCircle, CheckCircle2, Target } from 'lucide-react';

export default function CourseRecommendations({ courseRecommendations }) {
  const recommendations = Array.isArray(courseRecommendations) ? courseRecommendations : [];

  if (recommendations.length === 0) {
    return (
      <div className="card p-6 text-center text-slate-500">
        <BookOpen className="mx-auto mb-2 text-slate-300" size={32} />
        <p className="font-bold">No Course Recommendations Available</p>
      </div>
    );
  }

  return (
    <div className="card p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="text-indigo-600" size={22} /> Recommended Courses & Learning Targets
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Targeted courses and learning objectives matched to resolve your identified skill gaps.
          </p>
        </div>
        <span className="rounded-xl bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 border border-indigo-100">
          {recommendations.length} Recommendations
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {recommendations.map((rec, idx) => {
          const courseName = rec.course_name || rec.title || null;
          const targetSkill = rec.target_skill || rec.skill || 'Key Competency';
          const isLearningTarget = !courseName
            || ['fallback', 'learning_target', 'learning-target'].includes(
              String(rec.recommendation_type || rec.recommendationType || '').toLowerCase(),
            );

          const provider = rec.provider || null;
          const difficulty = rec.difficulty || null;
          const duration = rec.duration || null;
          const rating = rec.rating ? Number(rec.rating).toFixed(1) : null;
          const rawScore = rec.recommendation_score ?? rec.score ?? null;
          const score = rawScore !== null ? Math.round(Number(rawScore) * (Number(rawScore) <= 1 ? 100 : 1)) : null;
          const reason = rec.reason || null;
          const url = rec.course_url || rec.courseUrl || rec.url || rec.link
            || rec.course_link || rec.courseLink || rec.href || null;

          if (isLearningTarget) {
            return (
              <div
                key={idx}
                className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/50 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                      <Target size={12} /> Learning Target
                    </span>
                    {score !== null && (
                      <span className="text-xs font-bold text-amber-700">Priority Fit: {score}%</span>
                    )}
                  </div>
                  <h3 className="font-black text-slate-900 text-base">{targetSkill}</h3>
                  <p className="text-xs text-amber-900/80 mt-2 leading-relaxed">
                    {reason || `Focus on mastering ${targetSkill} to bridge high-priority career requirements.`}
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:border-indigo-200 transition duration-200 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 border border-indigo-100">
                    <Sparkles size={12} /> Course Match
                  </span>
                  {score !== null && (
                    <span className="text-xs font-extrabold text-indigo-600">
                      {score}% Match
                    </span>
                  )}
                </div>

                <h3 className="font-black text-slate-900 text-base leading-snug">
                  {courseName}
                </h3>

                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-500 font-medium">
                  {provider && (
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-bold text-slate-700">
                      {provider}
                    </span>
                  )}
                  {difficulty && (
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600">
                      {difficulty}
                    </span>
                  )}
                  {duration && (
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600">
                      {duration}
                    </span>
                  )}
                  {rating && (
                    <span className="rounded-md bg-amber-50 px-2 py-0.5 font-bold text-amber-700 border border-amber-200/60">
                      ★ {rating}
                    </span>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-50">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Target Skill
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                    <CheckCircle2 size={12} className="text-blue-500" /> {targetSkill}
                  </span>
                </div>

                {reason && (
                  <p className="text-xs text-slate-500 mt-2.5 leading-relaxed bg-slate-50 p-2.5 rounded-xl">
                    {reason}
                  </p>
                )}
              </div>

              {url && (
                <div className="pt-2">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    View Course Content <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
