import { Link } from 'react-router-dom';
import { Award, BarChart3, Brain, Code2, Compass, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import AppLayout from '../../components/layout/AppLayout';
import LoadingAnimation from '../../components/common/LoadingAnimation';
import EmptyState from '../../components/common/EmptyState';
import ResultCard from '../../components/assessment/ResultCard';
import ScoreCircle from '../../components/assessment/ScoreCircle';
import PersonalityCard from '../../components/assessment/PersonalityCard';
import CareerPreviewCard from '../../components/assessment/CareerPreviewCard';
import SkillRadarChart from '../../components/charts/SkillRadarChart';
import InterestChart from '../../components/charts/InterestChart';
import useAssessment from '../../hooks/useAssessment';
import { calculateAssessmentResult } from '../../utils/assessmentScoring';

export default function AssessmentResult() {
  const assessment = useAssessment();
  const result = assessment.result || calculateAssessmentResult(assessment.answers);

  if (assessment.loading) return <LoadingAnimation />;
  if (!result) {
    return (
      <AppLayout>
        <EmptyState
          title="No result yet"
          message="Complete the assessment to view your personalized result dashboard."
          action={<Link to="/assessment" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white">Start Assessment</Link>}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Assessment Results</p>
            <h1 className="mt-1 text-2xl font-extrabold text-slate-950 sm:text-3xl">Your career readiness dashboard</h1>
            <p className="mt-2 text-sm text-slate-600">Scores, skill patterns, personality insights, and recommended career previews.</p>
          </div>
          <Link to="/profile" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Continue to Career Recommendation
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <ScoreCircle value={result.overallScore} />
            <div className="mt-6 rounded-xl bg-blue-50 p-4 text-center">
              <p className="text-sm font-bold text-blue-800">Recommended track</p>
              <p className="mt-1 text-lg font-extrabold text-blue-950">{result.careers?.[0]?.title || 'Career Explorer'}</p>
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ResultCard icon={Code2} label="Technical Score" value={`${result.technicalScore}%`} tone="blue" />
            <ResultCard icon={BarChart3} label="Aptitude Score" value={`${result.aptitudeScore}%`} tone="sky" />
            <ResultCard icon={Compass} label="Interest Score" value={`${result.interestScore}%`} tone="green" />
            <ResultCard icon={Brain} label="Personality Score" value={`${result.personalityScore}%`} tone="amber" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={20} aria-hidden="true" />
              <h2 className="text-lg font-extrabold text-slate-950">Skill Radar</h2>
            </div>
            <SkillRadarChart data={result.technicalBySkill} />
          </section>

          <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Compass className="text-sky-600" size={20} aria-hidden="true" />
              <h2 className="text-lg font-extrabold text-slate-950">Interest Distribution</h2>
            </div>
            <InterestChart data={result.interestDistribution} />
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <PersonalityCard type={result.personalityType} strengths={result.strengths} />
          <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Award className="text-emerald-600" size={20} aria-hidden="true" />
              <h2 className="text-lg font-extrabold text-slate-950">Improvement Areas</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {result.improvementAreas.map((area) => (
                <div key={area} className="rounded-xl bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-700">{area}</div>
              ))}
            </div>
          </section>
        </div>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-950">Recommended Career Preview</h2>
              <p className="mt-1 text-sm text-slate-600">Explore the best early matches from your assessment profile.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {result.careers.map((career) => <CareerPreviewCard key={career.title} career={career} />)}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
