import { motion } from 'framer-motion';
import {
  FiAward,
  FiDownload,
  FiShare2,
  FiCheckCircle,
  FiZap,
  FiStar,
  FiShield,
  FiTarget,
  FiLayers,
  FiClock,
  FiLock,
  FiArrowRight,
  FiExternalLink,
} from 'react-icons/fi';
import AppLayout from '../../components/layout/AppLayout';

const certificates = [
  {
    id: 'CRT-8842',
    title: 'Java Architecture & Enterprise Systems',
    score: 90,
    date: '2026-07-20',
    category: 'Technical Systems',
    credentialId: 'CR-JAVA-9021',
    description: 'Demonstrated expert-level proficiency in object-oriented architecture, concurrent threads, and JVM execution patterns.',
  },
  {
    id: 'CRT-7104',
    title: 'Professional & Technical Articulation',
    score: 91,
    date: '2026-07-15',
    category: 'Cognitive & Soft Skills',
    credentialId: 'CR-COMM-8140',
    description: 'Exceptional verbal precision, structured technical documentation, and cross-functional scenario resolution.',
  },
  {
    id: 'CRT-6290',
    title: 'Relational Database Architecture & SQL',
    score: 78,
    date: '2026-07-05',
    category: 'Technical Systems',
    credentialId: 'CR-DB-6209',
    description: 'Demonstrated command of complex relational queries, normalization forms, index planning, and ACID transaction safety.',
  },
];

const badges = [
  {
    id: 1,
    icon: FiAward,
    label: 'High Distinction',
    desc: 'Achieved 90%+ in a standardized evaluation',
    earned: true,
    date: 'July 2026',
  },
  {
    id: 2,
    icon: FiZap,
    label: 'Rapid Solver',
    desc: 'Completed comprehensive assessment in under 15m',
    earned: true,
    date: 'July 2026',
  },
  {
    id: 3,
    icon: FiStar,
    label: 'Consistent Candidate',
    desc: 'Submitted 5 standardized modules within 30 days',
    earned: true,
    date: 'August 2026',
  },
  {
    id: 4,
    icon: FiShield,
    label: 'Perfect Benchmark',
    desc: 'Achieve 100% on any proctored test bank',
    earned: false,
    date: 'Locked',
  },
  {
    id: 5,
    icon: FiTarget,
    label: 'Role Calibrated',
    desc: 'Achieve 80%+ overall career readiness index',
    earned: false,
    date: 'Locked',
  },
  {
    id: 6,
    icon: FiLayers,
    label: 'Curriculum Completer',
    desc: 'Complete assessments across all 4 domain categories',
    earned: false,
    date: 'Locked',
  },
];

const achievements = [
  { label: 'Total Completed', value: 12, sub: 'Standardized modules', icon: FiCheckCircle },
  { label: 'Credentials Issued', value: 3, sub: 'Accredited certificates', icon: FiAward },
  { label: 'Badges Unlocked', value: 3, sub: '3 remaining milestones', icon: FiStar },
  { label: 'Peak Score Index', value: '91%', sub: 'Cohort 98th percentile', icon: FiShield },
];

export default function CertificatesBadges() {
  return (
    <AppLayout>
      <div className="space-y-8 max-w-[1400px] mx-auto pb-12 antialiased selection:bg-[#0038FF] selection:text-white">
        
        {/* ── Top Header Ribbon ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Credential Ledger
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                <FiShield size={9} /> Verified Accreditations
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              Certificates & Achievement Badges
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Official academic credentials, verification IDs, and milestones earned through proctored diagnostic assessments.
            </p>
          </div>

          <div className="text-xs font-mono text-neutral-400 flex items-center gap-1.5 shrink-0 self-start sm:self-end">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Public Ledger Active</span>
          </div>
        </div>

        {/* ── Metric KPI Summary Row ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                    {a.label}
                  </span>
                  <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF]">
                    <Icon size={14} />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-neutral-950 font-mono tracking-tight">
                    {a.value}
                  </p>
                  <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    {a.sub}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Section 1: Official Certificates Grid ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Verified Credentials
              </span>
              <h2 className="text-base font-bold text-neutral-950 mt-0.5">
                Earned Certificates of Competency
              </h2>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded">
              {certificates.length} Issued
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert, i) => (
              <motion.article
                key={cert.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-5 hover:border-neutral-300 hover:shadow-md hover:shadow-neutral-100 transition-all group"
              >
                <div className="space-y-4">
                  {/* Card Header & Verification Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF] group-hover:bg-[#0038FF] group-hover:text-white transition-colors">
                      <FiAward size={18} />
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 rounded bg-blue-50 border border-blue-100 px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-[#0038FF]">
                        <FiCheckCircle size={9} /> Verified
                      </span>
                      <p className="text-[10px] font-mono text-neutral-400 mt-1">
                        {cert.credentialId}
                      </p>
                    </div>
                  </div>

                  {/* Title & Category */}
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                      {cert.category}
                    </span>
                    <h3 className="text-sm font-bold text-neutral-950 mt-0.5 group-hover:text-[#0038FF] transition-colors leading-snug">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-2 leading-relaxed line-clamp-3">
                      {cert.description}
                    </p>
                  </div>
                </div>

                {/* Score & Issue Date Metadata */}
                <div className="space-y-4 pt-4 border-t border-neutral-100">
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-neutral-50/70 border border-neutral-100 rounded-lg p-2.5">
                      <span className="text-[10px] text-neutral-400 uppercase block">Score Achieved</span>
                      <span className="text-sm font-bold text-neutral-900">{cert.score}%</span>
                    </div>
                    <div className="bg-neutral-50/70 border border-neutral-100 rounded-lg p-2.5">
                      <span className="text-[10px] text-neutral-400 uppercase block">Issued On</span>
                      <span className="text-xs font-semibold text-neutral-700">
                        {new Date(cert.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Standardized Button Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {}}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white py-2.5 px-3 font-mono text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20 group"
                    >
                      <FiDownload size={13} />
                      <span>Download PDF</span>
                    </button>
                    <button
                      onClick={() => {}}
                      className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white hover:border-[#0038FF] hover:text-[#0038FF] text-neutral-700 p-2.5 transition-all shadow-2xs"
                      title="Share Credential"
                    >
                      <FiShare2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ── Section 2: Milestone Badges Grid ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Milestone Telemetry
              </span>
              <h2 className="text-base font-bold text-neutral-950 mt-0.5">
                Competency & Progress Badges
              </h2>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded">
              3 of 6 Unlocked
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {badges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`rounded-2xl border p-5 flex flex-col justify-between text-center transition-all ${
                    badge.earned
                      ? 'border-neutral-200 bg-white shadow-xs hover:border-neutral-300'
                      : 'border-dashed border-neutral-200 bg-neutral-50/60 opacity-60'
                  }`}
                >
                  <div className="space-y-3">
                    <div
                      className={`mx-auto h-11 w-11 rounded-xl flex items-center justify-center transition-colors ${
                        badge.earned
                          ? 'bg-blue-50 border border-blue-100 text-[#0038FF]'
                          : 'bg-neutral-100 border border-neutral-200 text-neutral-400'
                      }`}
                    >
                      {badge.earned ? <Icon size={18} /> : <FiLock size={16} />}
                    </div>

                    <div>
                      <p className="text-xs font-bold text-neutral-950">
                        {badge.label}
                      </p>
                      <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed">
                        {badge.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-neutral-100">
                    {badge.earned ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 uppercase">
                        <FiCheckCircle size={10} /> Unlocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-neutral-400 uppercase">
                        <FiLock size={10} /> Incomplete
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

      </div>
    </AppLayout>
  );
}