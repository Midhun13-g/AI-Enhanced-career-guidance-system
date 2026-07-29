import { ArrowRight, BriefcaseBusiness } from 'lucide-react';

export default function CareerPreviewCard({ career }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <BriefcaseBusiness size={20} aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-bold text-slate-950">{career.title}</h3>
            <p className="text-xs font-bold text-emerald-600">{career.match}% match</p>
          </div>
        </div>
        <ArrowRight className="text-slate-300" size={18} aria-hidden="true" />
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{career.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {career.skills.map((skill) => (
          <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{skill}</span>
        ))}
      </div>
    </div>
  );
}
