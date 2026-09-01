import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiTerminal,
  FiBarChart2,
  FiCpu,
  FiCompass,
  FiCheckCircle,
  FiClock,
  FiArrowRight,
  FiShield,
  FiLayers,
  FiInfo,
} from 'react-icons/fi';
import AppLayout from '../../components/layout/AppLayout';
import useAssessment from '../../hooks/useAssessment';
import { assessmentSections } from '../../utils/assessmentData';

const sectionIcons = {
  technical: FiTerminal,
  aptitude: FiBarChart2,
  personality: FiCpu,
  interests: FiCompass,
};

export default function AssessmentInstructions() {
  const navigate = useNavigate();
  const { start, loading } = useAssessment();

  const handleStart = async () => {
    await start();
    navigate('/assessment/quiz');
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-6xl mx-auto antialiased selection:bg-[#0038FF] selection:text-white">
        
        {/* ── Top Header Ribbon ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Examination Briefing
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                <FiShield size={9} /> Proctored Module 03
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              Skills & Competency Assessment
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Standardized diagnostic battery evaluating core software development, quantitative aptitude, cognitive working style, and trajectory alignment.
            </p>
          </div>

          <div className="text-xs font-mono text-neutral-400 flex items-center gap-1.5 shrink-0 self-start md:self-end">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Session Ready</span>
          </div>
        </div>

        {/* ── Main Two-Column Briefing Workspace ── */}
        <div className="grid gap-6 lg:grid-cols-12">
          
          {/* Left: Section Breakdown Grid (7 cols) */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-xs space-y-6"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                  Curriculum Scope
                </span>
                <h2 className="text-base font-bold text-neutral-950 mt-0.5">Evaluation Sections</h2>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded uppercase">
                4 Key Domains
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {assessmentSections.map((section, idx) => {
                const Icon = sectionIcons[section.id] || FiTerminal;
                return (
                  <div
                    key={section.id}
                    className="group relative flex flex-col justify-between rounded-xl border border-neutral-200/90 bg-white p-5 transition-all duration-150 hover:border-[#0038FF]/60 hover:shadow-md hover:shadow-blue-500/5"
                  >
                    <div>
                      {/* Top Bar: Icon + Step Counter */}
                      <div className="flex items-center justify-between">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-blue-50/80 text-[#0038FF] transition-colors group-hover:bg-[#0038FF] group-hover:text-white">
                          <Icon size={16} />
                        </div>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 group-hover:text-neutral-600">
                          Part 0{idx + 1}
                        </span>
                      </div>

                      {/* Section Titles */}
                      <div className="mt-4 space-y-1">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#0038FF]">
                          {section.eyebrow || `Section ${idx + 1}`}
                        </span>
                        <h3 className="text-sm font-extrabold tracking-tight text-neutral-950 transition-colors group-hover:text-[#0038FF]">
                          {section.title}
                        </h3>
                      </div>

                      {/* Scope Description */}
                      <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                        {section.description}
                      </p>
                    </div>

                    {/* Structural Bottom Accent Line */}
                    <div className="mt-4 h-0.5 w-full rounded-full bg-neutral-100 transition-colors group-hover:bg-blue-100" />
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* Right: Candidate Instructions & Launch Panel (5 cols) */}
          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="lg:col-span-5 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6"
          >
            <div className="space-y-5">
              <div className="border-b border-neutral-100 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                  Protocols & Constraints
                </span>
                <h2 className="text-base font-bold text-neutral-950 mt-0.5">Examination Guidelines</h2>
              </div>

              {/* Checklist Items */}
              <div className="space-y-3">
                {[
                  { text: '32 items distributed across 4 domain sections', icon: FiLayers },
                  { text: 'Allocated duration: 35–45 minutes total', icon: FiClock },
                  { text: 'All required items must be committed before final submission', icon: FiCheckCircle },
                  { text: 'Synthesizes skill radar vectors, gap analysis, and trajectory recommendations', icon: FiShield },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-neutral-700 leading-relaxed">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#0038FF]">
                      <item.icon size={11} />
                    </span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Notice Box */}
              <div className="flex items-start gap-2.5 rounded-xl border border-neutral-200/80 bg-[#F8FAFC] p-3.5 text-xs text-neutral-600 font-mono">
                <FiInfo size={14} className="mt-0.5 shrink-0 text-[#0038FF]" />
                <span>An active elapsed timer is displayed during the test session. Answers are saved locally on each step.</span>
              </div>
            </div>

            {/* Standardized Primary CTA Button */}
            <button
              onClick={handleStart}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-5 font-mono text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20 group"
            >
              <span>{loading ? 'Initializing Session...' : 'Begin Assessment'}</span>
              <FiArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </motion.aside>

        </div>

      </div>
    </AppLayout>
  );
}