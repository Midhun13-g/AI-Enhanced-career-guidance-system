import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Award, BookOpen, Briefcase, FileText, Loader2, Sparkles, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { getResumeEntities, getStudentSkills } from '../../services/resumeService';

const CONF_COLOR = (c) => c >= 0.9 ? 'bg-emerald-100 text-emerald-700' : c >= 0.75 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700';
const TABS = ['Skills', 'Education', 'Projects', 'Certifications', 'Experience'];

function SectionHeader({ icon: Icon, title, color }) {
  return (
    <div className={`mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest ${color}`}>
      <Icon size={15} /> {title}
    </div>
  );
}

function ConfBadge({ value }) {
  const pct = Math.round((value ?? 0) * 100);
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${CONF_COLOR(value ?? 0)}`}>{pct}%</span>;
}

function groupEntities(entities) {
  return (entities ?? []).reduce((acc, e) => {
    const key = e.entityType ?? 'OTHER';
    (acc[key] = acc[key] || []).push(e);
    return acc;
  }, {});
}

export default function ResumeNLPResults() {
  const [tab, setTab] = useState('Skills');
  const [entities, setEntities] = useState({});
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const resumeId = sessionStorage.getItem('resumeId');
    if (!resumeId) { setError('No resume found. Please upload and process a resume first.'); setLoading(false); return; }

    Promise.all([getResumeEntities(resumeId), getStudentSkills()])
      .then(([entRes, skillRes]) => {
        setEntities(groupEntities(entRes.data));
        setSkills(skillRes.data ?? []);
      })
      .catch(() => setError('Failed to load extraction results.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AppLayout><div className="flex h-64 items-center justify-center gap-3 text-slate-500">
      <Loader2 className="animate-spin" size={22} /> Loading extraction results…
    </div></AppLayout>
  );

  if (error) return (
    <AppLayout><div className="mx-auto max-w-lg py-16 text-center">
      <p className="font-bold text-red-600">{error}</p>
      <Link to="/resume/upload" className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white">Upload Resume</Link>
    </div></AppLayout>
  );

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Module 3 · NLP Extraction</p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">Extraction Results</h1>
            <p className="mt-1 text-slate-500">AI identified the following entities from your resume.</p>
          </div>
          <Link to="/resume/skill-taxonomy" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
            Skill Taxonomy <ArrowRight size={16} />
          </Link>
        </div>

        {/* Tab bar */}
        <div className="mb-5 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${tab === t ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Skills */}
        {tab === 'Skills' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <SectionHeader icon={Sparkles} title="Extracted Skills" color="text-teal-600" />
            {skills.length === 0 && <p className="col-span-full text-sm text-slate-500">No skills extracted yet.</p>}
            {skills.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div>
                  <p className="font-bold text-slate-800">{s.normalizedName}</p>
                  <p className="mt-0.5 text-[10px] font-semibold text-slate-400">{s.category}</p>
                </div>
                <ConfBadge value={s.confidence} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Education */}
        {tab === 'Education' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <SectionHeader icon={BookOpen} title="Education" color="text-indigo-600" />
            {(entities['EDUCATION'] ?? []).length === 0 && <p className="text-sm text-slate-500">No education entries extracted.</p>}
            {(entities['EDUCATION'] ?? []).map((e, i) => (
              <div key={i} className="card flex items-start justify-between gap-3 p-5">
                <p className="font-bold text-slate-900">{e.entityValue}</p>
                <ConfBadge value={e.confidenceScore} />
              </div>
            ))}
          </motion.div>
        )}

        {/* Projects */}
        {tab === 'Projects' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <SectionHeader icon={Briefcase} title="Projects" color="text-purple-600" />
            {(entities['PROJECT'] ?? []).length === 0 && <p className="text-sm text-slate-500">No projects extracted.</p>}
            {(entities['PROJECT'] ?? []).map((e, i) => (
              <div key={i} className="card flex items-start justify-between gap-3 p-5">
                <p className="font-bold text-slate-900">{e.entityValue}</p>
                <ConfBadge value={e.confidenceScore} />
              </div>
            ))}
          </motion.div>
        )}

        {/* Certifications */}
        {tab === 'Certifications' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <SectionHeader icon={Award} title="Certifications" color="text-amber-600" />
            {(entities['CERTIFICATION'] ?? []).length === 0 && <p className="text-sm text-slate-500">No certifications extracted.</p>}
            {(entities['CERTIFICATION'] ?? []).map((e, i) => (
              <div key={i} className="card flex items-center gap-4 p-5">
                <Award size={20} className="shrink-0 text-amber-500" />
                <p className="flex-1 font-bold text-slate-900">{e.entityValue}</p>
                <ConfBadge value={e.confidenceScore} />
              </div>
            ))}
          </motion.div>
        )}

        {/* Experience */}
        {tab === 'Experience' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <SectionHeader icon={User} title="Experience" color="text-blue-600" />
            {(entities['EXPERIENCE'] ?? []).length === 0 && <p className="text-sm text-slate-500">No experience entries extracted.</p>}
            {(entities['EXPERIENCE'] ?? []).map((e, i) => (
              <div key={i} className="card flex items-start justify-between gap-3 p-5">
                <div className="flex items-center gap-3">
                  <FileText size={16} className="shrink-0 text-blue-400" />
                  <p className="font-bold text-slate-900">{e.entityValue}</p>
                </div>
                <ConfBadge value={e.confidenceScore} />
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
