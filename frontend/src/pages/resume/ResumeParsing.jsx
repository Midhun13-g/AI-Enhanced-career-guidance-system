import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCheckCircle,
  FiAlertCircle,
  FiActivity,
  FiShield,
  FiUploadCloud,
  FiFileText,
  FiCpu,
  FiLayers,
  FiCompass,
  FiRefreshCw,
  FiClock,
} from 'react-icons/fi';
import AppLayout from '../../components/layout/AppLayout';
import { processResume } from '../../services/resumeService';

const STEPS = [
  { label: 'Ingesting Document Stream', detail: 'Secure cryptographic transmission of source file...', icon: FiUploadCloud },
  { label: 'OCR & Text Extraction', detail: 'Extracting structured raw text from PDF/DOCX payload...', icon: FiFileText },
  { label: 'Named Entity Recognition (NER)', detail: 'Tokenizing skills, project artifacts, and academic timelines...', icon: FiCpu },
  { label: 'Taxonomy Normalization', detail: 'Mapping extracted tokens against European & global skill taxonomy...', icon: FiLayers },
  { label: 'Academic & Institutional Parsing', detail: 'Validating accreditation levels and degree classifications...', icon: FiShield },
  { label: 'Project Scope & Impact Extraction', detail: 'Quantifying architectural scope and technical stacks...', icon: FiActivity },
  { label: 'Synthesizing Career Vectors', detail: 'Generating semantic job fit and dimensional quality vectors...', icon: FiCompass },
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
      setErrorMsg('No active resume record identifier found. Please upload a resume first.');
      return;
    }

    let currentStep = 0;
    const ticker = setInterval(() => {
      currentStep += 1;
      setStep(currentStep);
      if (currentStep >= STEPS.length - 1) clearInterval(ticker);
    }, 950);

    processResume(resumeId)
      .then(() => {
        clearInterval(ticker);
        setStep(STEPS.length);
        setTimeout(() => navigate('/resume/nlp-results'), 650);
      })
      .catch((err) => {
        clearInterval(ticker);
        setFailed(true);
        setErrorMsg(
          err?.response?.data?.message || 'Resume parsing pipeline execution failed. Please verify document formatting and retry.'
        );
      });

    return () => clearInterval(ticker);
  }, [navigate]);

  const progress = Math.round((Math.min(step, STEPS.length) / STEPS.length) * 100);

  return (
    <AppLayout>
      <div className="space-y-8 max-w-3xl mx-auto py-8 pb-16 antialiased selection:bg-[#0038FF] selection:text-white">
        
        {/* ── Pipeline Status Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="flex justify-center">
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border shadow-sm ${
              failed
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-blue-50 border-blue-100 text-[#0038FF]'
            }`}>
              {failed ? (
                <FiAlertCircle size={24} />
              ) : (
                <FiActivity size={24} className="animate-spin" />
              )}
            </div>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[10px] font-bold font-mono uppercase tracking-wider">
              <FiShield size={10} /> Module 03 Pipeline Execution
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              {failed ? 'Resume Pipeline Fault' : 'Processing Resume Document'}
            </h1>
            
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto font-mono leading-relaxed">
              {failed ? errorMsg : 'Executing transformer models for named entity extraction, taxonomy normalization, and career matching.'}
            </p>
          </div>

          {failed && (
            <div className="pt-2">
              <button
                onClick={() => navigate('/resume/upload')}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white px-5 py-2.5 text-xs font-mono font-bold transition-all shadow-md shadow-blue-500/20"
              >
                <FiRefreshCw size={13} />
                <span>Re-Upload & Retry</span>
              </button>
            </div>
          )}
        </motion.div>

        {!failed && (
          <div className="space-y-6">
            
            {/* ── Progress Rail Telemetry Card ── */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-neutral-800 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0038FF] animate-pulse" />
                  <span>{STEPS[Math.min(step, STEPS.length - 1)]?.label}</span>
                </div>
                <span className="font-bold text-neutral-950">{progress}% Complete</span>
              </div>

              <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[#0038FF]"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-1">
                <span>Inference Worker Latency: ~120ms</span>
                <span>Stage {Math.min(step + 1, STEPS.length)} of {STEPS.length}</span>
              </div>
            </motion.div>

            {/* ── Sequential Stepper Timeline ── */}
            <div className="rounded-2xl border border-neutral-200/90 bg-white shadow-xs overflow-hidden">
              <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0038FF] font-mono">
                    Parser Execution Plan
                  </span>
                  <h2 className="text-sm font-bold text-neutral-950 mt-0.5">
                    Stage Pipeline Diagnostics
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded">
                  SpaCy + RoBERTa v4
                </span>
              </div>

              <div className="divide-y divide-neutral-100">
                {STEPS.map((s, i) => {
                  const done = i < step;
                  const active = i === step;
                  const StepIcon = s.icon;

                  return (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`flex items-start gap-4 px-6 py-4 transition-colors font-mono ${
                        active
                          ? 'bg-blue-50/50'
                          : done
                          ? 'bg-white'
                          : 'bg-neutral-50/40 opacity-50'
                      }`}
                    >
                      {/* Step Status Icon */}
                      <div className="mt-0.5 shrink-0">
                        {done ? (
                          <div className="h-6 w-6 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                            <FiCheckCircle size={13} />
                          </div>
                        ) : active ? (
                          <div className="h-6 w-6 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0038FF]">
                            <FiActivity size={13} className="animate-spin" />
                          </div>
                        ) : (
                          <div className="h-6 w-6 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400">
                            <span className="text-[10px] font-bold">{i + 1}</span>
                          </div>
                        )}
                      </div>

                      {/* Step Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-xs font-bold ${
                            done ? 'text-neutral-900' : active ? 'text-[#0038FF]' : 'text-neutral-500'
                          }`}>
                            {s.label}
                          </p>

                          {done && (
                            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded">
                              Complete
                            </span>
                          )}
                          {active && (
                            <span className="text-[10px] font-semibold text-[#0038FF] bg-blue-50 border border-blue-100 px-1.5 py-0.2 rounded animate-pulse">
                              Processing
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-neutral-400 font-sans mt-0.5 leading-relaxed">
                          {s.detail}
                        </p>
                      </div>

                      <span className="text-[11px] font-bold text-neutral-400 shrink-0">
                        0{i + 1}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </AppLayout>
  );
}