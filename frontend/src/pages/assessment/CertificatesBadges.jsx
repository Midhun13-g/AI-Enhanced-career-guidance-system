import { motion } from 'framer-motion';
import { Download, Share2, Trophy, Star, Award, Zap, Shield, Target, CheckCircle2 } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import Badge from '../../components/ui/Badge';

const certificates = [
  {
    id: 1, title: 'Java Assessment Expert', score: 90, date: '2025-07-20',
    category: 'Technical', icon: '☕', color: 'from-blue-600 to-indigo-700',
    description: 'Demonstrated expert-level proficiency in Java programming and OOP concepts.',
  },
  {
    id: 2, title: 'Communication Champion', score: 91, date: '2025-07-15',
    category: 'Soft Skills', icon: '💬', color: 'from-teal-500 to-cyan-600',
    description: 'Exceptional verbal and written communication skills assessment.',
  },
  {
    id: 3, title: 'SQL Database Master', score: 78, date: '2025-07-05',
    category: 'Technical', icon: '🗄️', color: 'from-purple-600 to-violet-700',
    description: 'Strong command of SQL queries, normalization, and database design.',
  },
];

const badges = [
  { id: 1, icon: Trophy, label: 'Top Performer', desc: 'Scored 90%+ in an assessment', color: 'bg-amber-500', earned: true },
  { id: 2, icon: Zap, label: 'Speed Demon', desc: 'Completed assessment in under 15 min', color: 'bg-blue-600', earned: true },
  { id: 3, icon: Star, label: 'Consistent Learner', desc: '5 assessments in a month', color: 'bg-indigo-600', earned: true },
  { id: 4, icon: Shield, label: 'Perfect Score', desc: 'Score 100% on any assessment', color: 'bg-green-600', earned: false },
  { id: 5, icon: Target, label: 'Career Ready', desc: 'Achieve 80%+ career readiness', color: 'bg-teal-600', earned: false },
  { id: 6, icon: Award, label: 'All-Rounder', desc: 'Complete all 4 assessment categories', color: 'bg-rose-600', earned: false },
];

const achievements = [
  { label: 'Assessments Completed', value: 12, icon: CheckCircle2, color: 'text-green-600' },
  { label: 'Certificates Earned', value: 3, icon: Award, color: 'text-blue-600' },
  { label: 'Badges Unlocked', value: 3, icon: Trophy, color: 'text-amber-500' },
  { label: 'Best Score', value: '91%', icon: Star, color: 'text-indigo-600' },
];

export default function CertificatesBadges() {
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Achievements</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">Certificates & Badges</h1>
          <p className="mt-1 text-sm text-slate-500">Your earned credentials and achievement milestones.</p>
        </motion.div>

        {/* Achievement Summary */}
        <div className="grid gap-4 sm:grid-cols-4">
          {achievements.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div key={a.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card text-center">
                <Icon size={24} className={`mx-auto mb-2 ${a.color}`} />
                <p className="text-2xl font-black text-slate-900">{a.value}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">{a.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Certificates */}
        <section>
          <h2 className="mb-5 text-lg font-extrabold text-slate-900">Earned Certificates</h2>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {certificates.map((cert, i) => (
              <motion.div
                key={cert.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card hover:shadow-card-md transition-shadow"
              >
                {/* Certificate Header */}
                <div className={`bg-gradient-to-br ${cert.color} p-6 text-white relative overflow-hidden`}>
                  <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
                  <div className="pointer-events-none absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/10" />
                  <div className="relative">
                    <span className="text-4xl">{cert.icon}</span>
                    <div className="mt-3 flex items-center gap-2">
                      <Award size={14} className="text-white/70" />
                      <span className="text-xs font-bold uppercase tracking-widest text-white/70">Certificate of Achievement</span>
                    </div>
                    <h3 className="mt-1 text-xl font-extrabold leading-snug">{cert.title}</h3>
                  </div>
                </div>

                {/* Certificate Body */}
                <div className="p-5">
                  <p className="text-sm text-slate-500 leading-relaxed">{cert.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Score Achieved</p>
                      <p className="text-2xl font-black text-slate-900">{cert.score}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Issued On</p>
                      <p className="text-sm font-bold text-slate-700">
                        {new Date(cert.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2 text-sm font-bold text-white hover:bg-blue-700 transition-colors">
                      <Download size={14} /> Download
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 className="mb-5 text-lg font-extrabold text-slate-900">Achievement Badges</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {badges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={badge.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.07 * i }}
                  className={`rounded-2xl border p-5 text-center transition-all ${badge.earned ? 'border-slate-100 bg-white shadow-card hover:shadow-card-md' : 'border-dashed border-slate-200 bg-slate-50 opacity-50'}`}
                >
                  <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl ${badge.earned ? badge.color : 'bg-slate-300'} text-white shadow-sm`}>
                    <Icon size={24} />
                  </div>
                  <p className="text-sm font-extrabold text-slate-800">{badge.label}</p>
                  <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">{badge.desc}</p>
                  {badge.earned && (
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                      <CheckCircle2 size={9} /> Earned
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
