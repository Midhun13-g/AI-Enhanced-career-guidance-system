import React from 'react';
import { User, Mail, Phone, MapPin, GraduationCap, Briefcase, Code, Award, Sparkles, CheckCircle2, FileText } from 'lucide-react';

export default function ResumeOverview({ resume }) {
  const data = resume ?? {};
  const personal = data.personal_information || data.personal_info || {};

  const name = personal.name || data.name || data.candidate_name || 'Resume Candidate';
  const email = personal.email || data.email || null;
  const phone = personal.phone || data.phone || null;
  const location = personal.location || data.location || null;
  const summary = data.summary || data.profile_summary || data.objective || null;

  const education = Array.isArray(data.education) ? data.education : (data.education ? [data.education] : []);
  const experience = Array.isArray(data.experience) ? data.experience : (data.experience ? [data.experience] : []);
  const projects = Array.isArray(data.projects) ? data.projects : (data.projects ? [data.projects] : []);
  const certifications = Array.isArray(data.certifications) ? data.certifications : (data.certifications ? [data.certifications] : []);
  const skillsCount = Array.isArray(data.skills) ? data.skills.length : (data.skills_count ?? 0);

  return (
    <div className="card p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 font-bold text-xl">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              {name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs font-medium text-slate-500">
              {email && (
                <span className="flex items-center gap-1">
                  <Mail size={13} className="text-slate-400" /> {email}
                </span>
              )}
              {phone && (
                <span className="flex items-center gap-1">
                  <Phone size={13} className="text-slate-400" /> {phone}
                </span>
              )}
              {location && (
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-slate-400" /> {location}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 px-4 py-2 text-center border border-blue-100">
            <span className="block text-2xl font-black text-blue-600">{skillsCount}</span>
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Detected Skills</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Executive Summary</h3>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            {summary}
          </p>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Education */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-3 text-sm">
            <GraduationCap size={18} className="text-blue-600" /> Education
          </h3>
          {education.length > 0 ? (
            <div className="space-y-2.5">
              {education.map((item, idx) => {
                const degree = typeof item === 'string' ? item : item.degree || item.title || item.name || JSON.stringify(item);
                const institution = typeof item === 'object' ? item.institution || item.school || item.university || null : null;
                const year = typeof item === 'object' ? item.year || item.graduation_year || null : null;
                return (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800">{degree}</span>
                      {institution && <span className="text-slate-500 block text-xs">{institution} {year ? `(${year})` : ''}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No formal education entries parsed.</p>
          )}
        </div>

        {/* Experience */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-3 text-sm">
            <Briefcase size={18} className="text-indigo-600" /> Experience
          </h3>
          {experience.length > 0 ? (
            <div className="space-y-2.5">
              {experience.map((item, idx) => {
                const role = typeof item === 'string' ? item : item.role || item.position || item.title || JSON.stringify(item);
                const company = typeof item === 'object' ? item.company || item.organization || null : null;
                return (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800">{role}</span>
                      {company && <span className="text-slate-500 block text-xs">{company}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No employment experience parsed.</p>
          )}
        </div>

        {/* Projects */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-3 text-sm">
            <Code size={18} className="text-teal-600" /> Highlighted Projects
          </h3>
          {projects.length > 0 ? (
            <div className="space-y-2.5">
              {projects.map((item, idx) => {
                const projName = typeof item === 'string' ? item : item.name || item.title || JSON.stringify(item);
                const desc = typeof item === 'object' ? item.description || null : null;
                return (
                  <div key={idx} className="text-sm text-slate-600">
                    <span className="font-bold text-slate-800 block">{projName}</span>
                    {desc && <span className="text-slate-500 text-xs block mt-0.5">{desc}</span>}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No projects listed.</p>
          )}
        </div>

        {/* Certifications */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-3 text-sm">
            <Award size={18} className="text-amber-600" /> Certifications
          </h3>
          {certifications.length > 0 ? (
            <div className="space-y-2">
              {certifications.map((item, idx) => {
                const cert = typeof item === 'string' ? item : item.title || item.name || JSON.stringify(item);
                return (
                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                    <Award size={15} className="text-amber-500 shrink-0" />
                    <span>{cert}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No certifications detected.</p>
          )}
        </div>
      </div>
    </div>
  );
}
