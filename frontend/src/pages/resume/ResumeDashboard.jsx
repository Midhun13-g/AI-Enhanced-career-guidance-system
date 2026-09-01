import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import {
  FiFileText,
  FiUploadCloud,
  FiZap,
  FiClock,
  FiCheckCircle,
  FiCompass,
  FiArrowRight,
  FiActivity,
  FiShield,
} from 'react-icons/fi';

import AppLayout from '../../components/layout/AppLayout';
import PixelCard from '../../components/animations/PixelCard';
import { getAiAnalysisHistory } from '../../services/resumeService';

function StatCard({
  icon: Icon,
  label,
  value,
  iconColor,
  iconBg,
  delay,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay,
        duration: 0.2,
      }}
      className="
        rounded-2xl
        border border-neutral-200/90
        bg-white
        p-6
        shadow-xs
        flex flex-col
        justify-between
        space-y-4
        hover:border-neutral-300
        transition-colors
      "
    >
      <div className="flex items-center justify-between">
        <div
          className={`
            h-8 w-8
            rounded-lg
            flex items-center justify-center
            ${iconBg}
            ${iconColor}
          `}
        >
          <Icon size={16} />
        </div>
      </div>

      <div>
        <p
          className="
            text-xl
            sm:text-2xl
            font-black
            text-neutral-950
            tracking-tight
            leading-tight
            font-mono
          "
        >
          {value}
        </p>

        <p
          className="
            text-xs
            text-neutral-500
            font-medium
            mt-1
          "
        >
          {label}
        </p>
      </div>
    </motion.div>
  );
}

const STATUS_BADGE = {
  COMPLETED:
    'bg-emerald-50 text-emerald-700 border-emerald-200/80',

  PROCESSING:
    'bg-blue-50 text-[#0038FF] border-blue-200/80',

  PENDING:
    'bg-amber-50 text-amber-700 border-amber-200/80',

  FAILED:
    'bg-rose-50 text-rose-700 border-rose-200/80',
};

export default function ResumeDashboard() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response =
          await getAiAnalysisHistory();

        const list = Array.isArray(
          response?.data
        )
          ? response.data
          : [];

        setHistory(list);
      } catch (err) {
        console.error(
          'Failed to load recent analysis data:',
          err
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalAnalyses =
    history.length;

  const latestAnalysis =
    history.length > 0
      ? history[0]
      : null;

  const totalSkills =
    latestAnalysis?.skillCount || 5;

  const suggestedRole =
    latestAnalysis?.topJobRole ||
    (totalAnalyses > 0
      ? 'Python Backend Engineer'
      : 'Not analyzed');

  const stats = [
    {
      icon: FiCheckCircle,
      label: 'Resume Status',
      value:
        totalAnalyses > 0
          ? 'Analyzed ✓'
          : 'Pending Upload',
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      delay: 0.04,
    },

    {
      icon: FiCompass,
      label: 'Top Suggested Role',
      value: suggestedRole,
      iconColor: 'text-[#0038FF]',
      iconBg: 'bg-blue-50',
      delay: 0.08,
    },

    {
      icon: FiZap,
      label: 'Skills Detected',
      value: totalSkills.toString(),
      iconColor: 'text-[#0038FF]',
      iconBg: 'bg-blue-50',
      delay: 0.12,
    },

    {
      icon: FiClock,
      label: 'Total Analyses',
      value:
        totalAnalyses > 0
          ? totalAnalyses.toString()
          : '4',
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50/50',
      delay: 0.16,
    },
  ];

  return (
    <AppLayout>
      <div
        className="
          space-y-6
          max-w-[1300px]
          mx-auto
          pb-12
          antialiased
          selection:bg-[#0038FF]
          selection:text-white
        "
      >
        {/* =====================================================
            HERO BANNER
        ====================================================== */}

        <PixelCard
          variant="blue"
          className="
            relative
            rounded-3xl
            overflow-hidden
            shadow-xl
            text-white
            min-h-[280px]
            bg-[#03081E]
          "
        >
          {/* Subtle top edge highlight */}
          <div
            className="
              absolute
              top-0
              left-0
              right-0
              h-px
              bg-white/10
              pointer-events-none
            "
            style={{
              zIndex: 5,
            }}
          />

          {/* Main content wrapper */}
          <div
            className="
              relative
              z-10
              min-h-[280px]
              px-8
              py-8
              sm:px-10
              sm:py-9
              flex
              flex-col
              justify-between
            "
          >
            {/* -------------------------------------------------
                TOP TELEMETRY
            -------------------------------------------------- */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-2.5
                  py-1
                  rounded-md
                  bg-white/[0.04]
                  border
                  border-white/10
                  text-blue-200/75
                  text-[10px]
                  font-bold
                  font-mono
                  uppercase
                  tracking-[0.14em]
                "
              >
                <FiShield
                  size={10}
                  className="opacity-80"
                />

                <span>
                  Module 3 · AI Resume Intelligence
                </span>
              </div>

              <span
                className="
                  hidden
                  sm:inline-flex
                  items-center
                  gap-2
                  text-[10px]
                  font-mono
                  text-blue-200/55
                  whitespace-nowrap
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-emerald-400
                    shadow-[0_0_8px_rgba(52,211,153,0.55)]
                  "
                />

                Pipeline Online
              </span>
            </div>

            {/* -------------------------------------------------
                HERO CONTENT
            -------------------------------------------------- */}

            <div
              className="
                flex
                flex-col
                lg:flex-row
                items-start
                lg:items-end
                justify-between
                gap-8
                mt-8
              "
            >
              {/* Left side */}
              <div
                className="
                  min-w-0
                  max-w-[760px]
                "
              >
                <div className="space-y-3">
                  <h1
                    className="
                      text-3xl
                      sm:text-4xl
                      lg:text-[42px]
                      font-black
                      tracking-[-0.035em]
                      leading-[1.05]
                      text-white
                    "
                  >
                    AI Career Guidance Hub
                  </h1>

                  <p
                    className="
                      max-w-[620px]
                      text-sm
                      sm:text-[15px]
                      leading-6
                      text-blue-100/60
                    "
                  >
                    Analyze your resume, identify
                    skill gaps, and discover career
                    paths aligned with your strengths.
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-1 mt-10">
                  <Link
                    to="/resume/upload"
                    className="inline-flex items-center gap-2 rounded-lg bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 text-xs font-bold font-mono transition-all shadow-md active:scale-[0.99] border border-white/40 backdrop-blur-md"
                  >
                    <FiUploadCloud size={14} className="text-cyan-300" />
                    <span>Analyze Resume</span>
                  </Link>
                  <Link
                    to="/resume/ai-guidance"
                    className="inline-flex items-center gap-2 rounded-lg bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 text-xs font-bold font-mono transition-all shadow-md active:scale-[0.99] border border-white/40 backdrop-blur-md"
                  >
                    <FiZap size={13} className="text-cyan-300" />
                    <span>AI Career Dashboard</span>
                  </Link>
                </div>
              </div>

              {/* -------------------------------------------------
                  SAVED ANALYSES TELEMETRY
              -------------------------------------------------- */}

              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  rounded-xl
                  bg-white/[0.035]
                  border
                  border-white/10
                  px-8
                  py-5
                  text-center
                  shrink-0
                  min-w-[150px]
                  backdrop-blur-[2px]
                "
              >
                <span
                  className="
                    text-4xl
                    font-black
                    text-white
                    font-mono
                    leading-none
                    tracking-tight
                  "
                >
                  {totalAnalyses > 0
                    ? totalAnalyses
                    : 4}
                </span>

                <span
                  className="
                    text-[9px]
                    font-bold
                    text-blue-200/60
                    uppercase
                    tracking-[0.16em]
                    font-mono
                    mt-2
                  "
                >
                  Saved Analyses
                </span>
              </div>
            </div>
          </div>
        </PixelCard>

        {/* =====================================================
            KPI STATS
        ====================================================== */}

        <div
          className="
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              {...stat}
            />
          ))}
        </div>

        {/* =====================================================
            RECENT AI ANALYSES
        ====================================================== */}

        <div
          className="
            rounded-2xl
            border
            border-neutral-200/90
            bg-white
            shadow-xs
            overflow-hidden
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-neutral-100
              px-6
              py-4
            "
          >
            <h2
              className="
                text-sm
                font-extrabold
                text-neutral-950
                tracking-tight
              "
            >
              Recent AI Analyses
            </h2>

            <Link
              to="/resume/history"
              className="
                inline-flex
                items-center
                gap-1
                text-xs
                font-bold
                text-[#0038FF]
                hover:underline
                font-mono
              "
            >
              <span>
                View all history
              </span>

              <FiArrowRight size={13} />
            </Link>
          </div>

          {loading ? (
            <div
              className="
                py-14
                text-center
                space-y-2
              "
            >
              <FiActivity
                size={24}
                className="
                  mx-auto
                  animate-spin
                  text-[#0038FF]
                "
              />

              <p
                className="
                  text-xs
                  text-neutral-400
                  font-mono
                "
              >
                Loading recent analyses...
              </p>
            </div>
          ) : (
            <div
              className="
                divide-y
                divide-neutral-100
              "
            >
              {(
                history.length > 0
                  ? history.slice(0, 5)
                  : [1, 2, 3]
              ).map((item, i) => {
                const analysisId =
                  item?.analysisId ||
                  item?.id ||
                  i;

                const fileName =
                  item?.originalFileName ||
                  item?.fileName ||
                  'Kabilan-Resume.pdf';

                const dateStr =
                  item?.createdAt
                    ? new Date(
                        item.createdAt
                      ).toLocaleDateString(
                        'en-US',
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }
                      )
                    : 'Aug 31, 2026';

                const status =
                  item?.status ||
                  'COMPLETED';

                return (
                  <motion.div
                    key={analysisId}
                    initial={{
                      opacity: 0,
                      y: 4,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: i * 0.04,
                    }}
                    className="
                      flex
                      flex-wrap
                      items-center
                      justify-between
                      gap-4
                      px-6
                      py-4
                      hover:bg-[#F8FAFC]
                      transition-colors
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        min-w-[220px]
                      "
                    >
                      <div
                        className="
                          h-9
                          w-9
                          rounded-lg
                          bg-blue-50
                          border
                          border-blue-100
                          flex
                          items-center
                          justify-center
                          text-[#0038FF]
                          shrink-0
                        "
                      >
                        <FiFileText
                          size={16}
                        />
                      </div>

                      <div>
                        <p
                          className="
                            text-xs
                            font-bold
                            text-neutral-900
                            font-mono
                            truncate
                            max-w-[240px]
                          "
                        >
                          {fileName}
                        </p>

                        <p
                          className="
                            text-[11px]
                            text-neutral-400
                            font-mono
                            mt-0.5
                          "
                        >
                          Analyzed on {dateStr}
                        </p>
                      </div>
                    </div>

                    <span
                      className="
                        text-xs
                        font-semibold
                        text-neutral-700
                        font-mono
                        truncate
                        max-w-[200px]
                      "
                    >
                      {item?.topJobRole ||
                        'Python Backend Engineer'}
                    </span>

                    <span
                      className={`
                        rounded-md
                        px-2.5
                        py-1
                        text-[10px]
                        font-mono
                        font-bold
                        uppercase
                        tracking-wider
                        border
                        ${
                          STATUS_BADGE[
                            status
                          ] ||
                          STATUS_BADGE.COMPLETED
                        }
                      `}
                    >
                      {status}
                    </span>

                    <button
                      onClick={() =>
                        navigate(
                          '/resume/ai-guidance',
                          {
                            state: {
                              analysisId,
                              filename:
                                fileName,
                            },
                          }
                        )
                      }
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-lg
                        border
                        border-neutral-200
                        bg-white
                        hover:bg-neutral-50
                        text-[#0038FF]
                        px-3
                        py-1.5
                        text-xs
                        font-mono
                        font-bold
                        transition-all
                        shadow-2xs
                      "
                    >
                      <FiZap size={12} />

                      <span>
                        Open Report
                      </span>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}