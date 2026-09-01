import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiTerminal,
  FiBarChart2,
  FiCpu,
  FiCompass,
  FiTrendingUp,
  FiAward,
  FiArrowRight,
  FiShield,
  FiCheckCircle,
  FiTarget,
  FiActivity,
  FiLayers,
} from 'react-icons/fi';
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
  const result =
    assessment.result || calculateAssessmentResult(assessment.answers);

  if (assessment.loading) return <LoadingAnimation />;

  if (!result) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto py-12 antialiased selection:bg-[#0038FF] selection:text-white">
          <EmptyState
            title="No Evaluation Synthesized"
            message="Complete a standardized assessment module to generate your cognitive skill vectors and role alignment preview."
            action={
              <Link
                to="/assessment"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white py-2.5 px-5 font-mono text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20 group"
              >
                <span>Launch Assessment Module</span>
                <FiArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            }
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8 max-w-[1400px] mx-auto pb-12 antialiased selection:bg-[#0038FF] selection:text-white">
        
        {/* ── Top Header Ribbon & Global Action Bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Diagnostic Telemetry
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                <FiShield size={9} /> Evaluated & Calibrated
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              Career Readiness & Competency Synthesis
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Synthesized scores across algorithmic problem-solving, cognitive reasoning, professional interests, and academic trajectory matches.
            </p>
          </div>

          <Link
            to="/profile"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white py-2.5 px-5 font-mono text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20 shrink-0 group"
          >
            <span>Continue to Career Recommendation</span>
            <FiArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* ── Section 1: Score Telemetry & Standardized 4-Metric Grid ── */}
        <div className="grid gap-6 lg:grid-cols-12">
          
          {/* Overall Score Circle Card (4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-4 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6"
          >
            <div>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                  Composite Index
                </span>
                <span className="text-[10px] font-mono text-[#0038FF] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded font-bold uppercase">
                  Calibrated
                </span>
              </div>

              <div className="py-2 flex justify-center">
                <ScoreCircle value={result.overallScore} />
              </div>
            </div>

            <div className="rounded-xl border border-blue-100/80 bg-blue-50/40 p-4 space-y-1 text-center font-mono">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0038FF]">
                Primary Trajectory Recommendation
              </span>
              <p className="text-base font-extrabold text-neutral-950 font-sans">
                {result.careers?.[0]?.title || 'Backend Systems Engineer'}
              </p>
            </div>
          </motion.div>

          {/* 4 Standardized Metric Cards (8 cols) */}
          <div className="lg:col-span-8 grid gap-4 sm:grid-cols-2">
            <ResultCard
              icon={FiTerminal}
              label="Technical Execution"
              value={`${result.technicalScore}%`}
              tone="blue"
              sub="Algorithmic problem-solving"
            />
            <ResultCard
              icon={FiBarChart2}
              label="Cognitive Aptitude"
              value={`${result.aptitudeScore}%`}
              tone="neutral"
              sub="Logical deduction & patterns"
            />
            <ResultCard
              icon={FiCompass}
              label="Domain Interest Index"
              value={`${result.interestScore}%`}
              tone="neutral"
              sub="Curriculum alignment"
            />
            <ResultCard
              icon={FiCpu}
              label="Personality Archetype"
              value={`${result.personalityScore}%`}
              tone="neutral"
              sub="Collaborative workstyle"
            />
          </div>
        </div>

        {/* ── Section 2: Visual Telemetry (Radar + Interest Charts) ── */}
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* Skill Radar */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF]">
                  <FiTrendingUp size={14} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                    Geometric Breakdown
                  </span>
                  <h2 className="text-sm font-bold text-neutral-950">Skill Proficiency Polygon</h2>
                </div>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">Multi-axis Vector</span>
            </div>

            <div className="pt-2">
              <SkillRadarChart data={result.technicalBySkill} />
            </div>
          </section>

          {/* Interest Distribution */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF]">
                  <FiCompass size={14} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                    Focus Allocation
                  </span>
                  <h2 className="text-sm font-bold text-neutral-950">Interest Domain Distribution</h2>
                </div>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">Relative Weight</span>
            </div>

            <div className="pt-2">
              <InterestChart data={result.interestDistribution} />
            </div>
          </section>

        </div>

        {/* ── Section 3: Diagnostic Observations (Personality & Targeted Gaps) ── */}
        <div className="grid gap-6 lg:grid-cols-12">
          
          {/* Personality Card (5 cols) */}
          <div className="lg:col-span-5">
            <PersonalityCard
              type={result.personalityType}
              strengths={result.strengths}
            />
          </div>

          {/* Improvement Areas (7 cols) */}
          <section className="lg:col-span-7 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF]">
                    <FiAward size={14} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                      Curriculum Gaps
                    </span>
                    <h2 className="text-sm font-bold text-neutral-950">Targeted Focus & Improvement Areas</h2>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded font-bold uppercase">
                  Action Required
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {result.improvementAreas?.map((area, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between rounded-xl border border-neutral-200/80 bg-neutral-50/40 p-3.5 space-y-2 hover:border-neutral-300 hover:bg-white transition-all"
                  >
                    <div className="flex items-center gap-1.5 text-[#0038FF]">
                      <FiTarget size={13} />
                      <span className="text-[10px] font-mono font-bold uppercase">Priority 0{i + 1}</span>
                    </div>
                    <p className="text-xs font-semibold text-neutral-800 leading-snug">
                      {area}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-neutral-100 pt-3">
              <span>Resolving these areas optimizes career matching confidence.</span>
            </div>
          </section>

        </div>

        {/* ── Section 4: Recommended Trajectory Roles ── */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-neutral-200/80 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Trajectory Matches
              </span>
              <h2 className="text-lg font-extrabold tracking-tight text-neutral-950 mt-0.5">
                Recommended Career Roles
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-500">
              Ranked by profile and competency match percentage
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {result.careers?.map((career) => (
              <CareerPreviewCard key={career.title} career={career} />
            ))}
          </div>
        </section>

      </div>
    </AppLayout>
  );
}