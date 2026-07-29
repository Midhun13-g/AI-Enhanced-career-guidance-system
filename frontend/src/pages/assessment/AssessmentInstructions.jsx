import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Brain, CheckCircle2, Clock, Code2, Compass, PenLine, Sparkles } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import CategoryHeader from '../../components/assessment/CategoryHeader';
import useAssessment from '../../hooks/useAssessment';
import { assessmentSections } from '../../utils/assessmentData';

const sectionIcons = {
  technical: Code2,
  aptitude: BarChart3,
  personality: Brain,
  interests: Compass,
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
      <div className="mx-auto max-w-6xl">
        <CategoryHeader
          eyebrow="Module 3"
          title="Skills & Interest Assessment"
          description="Complete a guided assessment across technical skills, aptitude, personality, and interests to unlock personalized career recommendations."
          icon={Sparkles}
        />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-950">What to expect</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {assessmentSections.map((section) => {
                const Icon = sectionIcons[section.id];
                return (
                  <div key={section.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                      <Icon size={20} aria-hidden="true" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-600">{section.eyebrow}</p>
                    <h3 className="mt-1 font-bold text-slate-900">{section.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{section.description}</p>
                  </div>
                );
              })}
            </div>
          </motion.section>

          <motion.aside initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
            <div className="rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 p-5 text-white">
              <PenLine size={28} aria-hidden="true" />
              <h2 className="mt-4 text-xl font-extrabold">Ready when you are</h2>
              <p className="mt-2 text-sm leading-6 text-blue-50">You can move between questions, skip temporarily, and review everything before submitting.</p>
            </div>

            <div className="mt-5 space-y-3">
              {[
                '32 questions across 4 sections',
                'Estimated time: 35-45 minutes',
                'All required questions must be answered before submission',
                'Results include scores, charts, strengths, and career previews',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={18} aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-600">
              <Clock size={17} className="text-blue-600" aria-hidden="true" />
              Optional timer is shown during the quiz.
            </div>

            <button
              onClick={handleStart}
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? 'Starting...' : 'Start Assessment'}
            </button>
          </motion.aside>
        </div>
      </div>
    </AppLayout>
  );
}
