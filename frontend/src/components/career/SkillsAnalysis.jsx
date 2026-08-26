import React from 'react';
import { Cpu, Wrench, Layers, Tag } from 'lucide-react';

export default function SkillsAnalysis({ resume, careerAnalysis }) {
  const resumeData = resume ?? {};
  const careerData = careerAnalysis ?? {};

  // Extract skills lists safely
  const rawSkills = Array.isArray(resumeData.skills)
    ? resumeData.skills
    : (Array.isArray(resumeData.extracted_skills) ? resumeData.extracted_skills : []);

  const normalizedSkills = Array.isArray(resumeData.normalized_skills)
    ? resumeData.normalized_skills
    : (Array.isArray(careerData.normalized_skills) ? careerData.normalized_skills : rawSkills);

  const technicalSkills = Array.isArray(resumeData.technical_skills)
    ? resumeData.technical_skills
    : normalizedSkills.filter(s => typeof s === 'string');

  const softSkills = Array.isArray(resumeData.soft_skills)
    ? resumeData.soft_skills
    : [];

  return (
    <div className="card p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Cpu className="text-blue-600" size={22} /> Skills Analysis
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Normalized skill extraction via Hugging Face AI & NLP taxonomy matching.
          </p>
        </div>
        <span className="rounded-xl bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-700 border border-blue-100">
          {rawSkills.length} Total Extracted Skills
        </span>
      </div>

      {/* Technical Skills */}
      <div>
        <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-3 text-sm">
          <Wrench size={16} className="text-blue-600" /> Technical Skills
        </h3>
        {technicalSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {technicalSkills.map((sk, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/70 px-3 py-1.5 text-xs font-bold text-blue-800 shadow-sm"
              >
                <Tag size={12} className="text-blue-500" />
                {typeof sk === 'string' ? sk : sk.name || JSON.stringify(sk)}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 italic">No technical skills extracted.</p>
        )}
      </div>

      {/* Professional & Soft Skills */}
      {softSkills.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-3 text-sm">
            <Layers size={16} className="text-indigo-600" /> Professional & Soft Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {softSkills.map((sk, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs font-bold text-indigo-800 shadow-sm"
              >
                <Tag size={12} className="text-indigo-500" />
                {typeof sk === 'string' ? sk : sk.name || JSON.stringify(sk)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* All Normalized Skills */}
      {normalizedSkills.length > 0 && (
        <div className="pt-2 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Normalized Skill Taxonomy Map
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {normalizedSkills.map((sk, idx) => (
              <span
                key={idx}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
              >
                {typeof sk === 'string' ? sk : sk.name || JSON.stringify(sk)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
