import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Loader2, Sparkles, XCircle } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { processResume } from '../../services/resumeService';

const STEPS = [
  { label: 'Uploading Resume',         detail: 'Securely transferring your file…' },
  { label: 'Text Extraction',          detail: 'Parsing PDF/DOCX content…' },
  { label: 'NLP Entity Recognition',   detail: 'Identifying skills, education, projects…' },
  { label: 'Skill Taxonomy Mapping',   detail: 'Normalizing skills against taxonomy…' },
  { label: 'Education Extraction',     detail: 'Detecting degrees and institutions…' },
  { label: 'Project Extraction',       detail: 'Identifying project descriptions…' },
  { label: 'Generating Career Insights', detail: 'Building your AI career profile…' },
];

export default function ResumeParsing() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [failed, setFailed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const resumeId = sessionStorage.getItem('resumeId');
    if (!resumeId) {
      setFailed(true);
      setErrorMsg('No resume ID found. Please upload your resume first.');
      return;
    }

    // Animate steps while the API call runs in parallel
    let currentStep = 0;
    const ticker = setInterval(() => {
      currentStep += 1;
      setStep(currentStep);
      if (currentStep >= STEPS.length - 1) clearInterval(ticker);
    }, 900);

    processResume(resumeId)
      .then(() => {
        clearInterval(ticker);
        setStep(STEPS.length);
        setTimeout(() => navigate('/resume/nlp-results'), 600);
      })
      .catch((err) => {
        clearInterval(ticker);
        setFailed(true);
        setErrorMsg(
          err?.response?.data?.message || 'Resume processing failed. Please try again.'
        );
      });

    return () => clearInterval(ticker);
  }, [navigate]);

  const progress = Math.round((Math.min(step, STEPS.length) / STEPS.length) * 100);

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl py-6">
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-200">
            <motion.div animate={{ rotate: failed ? 0 : 360 }} transition={{ duration: 3, repeat: failed ? 0 : Infinity, ease: 'linear' }}>
              {failed ? <XCircle size={34} className="text-white" /> : <Sparkles size={34} className="text-white" />}
            </motion.div>
          </div>
          <h1 className="text-2xl font-black text-slate-950">
            {failed ? '❌ Processing failed' : '🤖 AI is analysing your resume…'}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {failed ? errorMsg : 'Please keep this page open. Usually takes less than a minute.'}
          </p>
          {failed && (
            <button
              onClick={() => navigate('/resume/upload')}
              className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
            >
              Try again
            </button>
          )}
        </motion.div>

        {!failed && (
          <>
            {/* Progress bar */}
            <div className="mb-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
              <div className="mb-2 flex justify-between text-xs font-bold text-slate-500">
                <span>{STEPS[Math.min(step, STEPS.length - 1)]?.label}…</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Pipeline steps */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-sm font-black uppercase tracking-widest text-slate-400">Processing Pipeline</h2>
              <div className="space-y-4">
                {STEPS.map((s, i) => {
                  const done   = i < step;
                  const active = i === step;
                  return (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      className={`flex items-start gap-4 rounded-xl p-3 transition-colors ${active ? 'bg-blue-50' : done ? 'bg-emerald-50/60' : 'bg-slate-50'}`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {done ? (
                          <CheckCircle2 size={20} className="text-emerald-500" />
                        ) : active ? (
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                            <Loader2 size={20} className="text-blue-600" />
                          </motion.div>
                        ) : (
                          <Circle size={20} className="text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${done ? 'text-emerald-700' : active ? 'text-blue-700' : 'text-slate-400'}`}>
                          {s.label}
                          {done   && <span className="ml-2 text-xs font-semibold text-emerald-500">✓ Completed</span>}
                          {active && <span className="ml-2 text-xs font-semibold text-blue-500">Processing…</span>}
                        </p>
                        {(done || active) && <p className="mt-0.5 text-xs text-slate-500">{s.detail}</p>}
                      </div>
                      <span className="text-xs font-bold text-slate-300">Step {i + 1}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
