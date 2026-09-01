import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiClock,
  FiAward,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiShield,
  FiLayers,
  FiActivity,
  FiFileText,
} from 'react-icons/fi';
import AppLayout from '../../components/layout/AppLayout';
import DataTable from '../../components/ui/DataTable';
import api from '../../services/api';

export default function AssessmentHistory() {
  const [attempts, setAttempts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api
      .get('/api/assessment/published/history')
      .then((response) => setAttempts(response.data || []))
      .catch((requestError) =>
        setError(
          requestError.response?.data?.message ||
            'Unable to load standardized assessment history.'
        )
      )
      .finally(() => setLoading(false));
  }, []);

  const rows = useMemo(
    () =>
      attempts.map((item) => ({
        ...item,
        name: item.assessmentTitle || 'General Competency Module',
        score: Math.round(item.percentage ?? 0),
        date: item.submittedAt,
        status: item.passed ? 'Passed' : 'Needs Review',
        duration: item.durationMinutes ? `${item.durationMinutes}m` : '—',
      })),
    [attempts]
  );

  const passedCount = useMemo(
    () => rows.filter((row) => row.passed).length,
    [rows]
  );

  const average = useMemo(
    () =>
      rows.length
        ? Math.round(rows.reduce((sum, row) => sum + row.score, 0) / rows.length)
        : 0,
    [rows]
  );

  const columns = [
    {
      key: 'name',
      label: 'Evaluation Module',
      render: (value, row) => (
        <div className="space-y-0.5">
          <p className="font-semibold text-neutral-950 text-xs sm:text-sm leading-snug">
            {value}
          </p>
          <p className="text-[10px] font-mono text-neutral-400">
            ID: #{row.assessmentId || '00'} · Attempt #{row.attemptId || '1'}
          </p>
        </div>
      ),
    },
    {
      key: 'score',
      label: 'Score Index',
      render: (value) => (
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-xs text-neutral-900">
            {value}%
          </span>
          <div className="w-16 h-1.5 rounded-full bg-neutral-100 overflow-hidden hidden sm:block">
            <div
              className={`h-full rounded-full ${
                value >= 70
                  ? 'bg-[#0038FF]'
                  : value >= 50
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Timestamp',
      render: (value) => (
        <span className="font-mono text-xs text-neutral-500">
          {value
            ? new Date(value).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : '—'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Audit Status',
      render: (value, row) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
            row.passed
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
              : 'bg-rose-50 text-rose-700 border-rose-200/80'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              row.passed ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          />
          {value}
        </span>
      ),
    },
    {
      key: 'attemptId',
      label: 'Action',
      sortable: false,
      render: (_, row) => (
        <button
          onClick={() =>
            navigate(
              `/assessments/quiz/${row.assessmentId}/result/${row.attemptId}`
            )
          }
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white hover:border-[#0038FF] hover:text-[#0038FF] hover:bg-blue-50/40 text-neutral-700 px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wide transition-all shadow-2xs group"
        >
          <span>Audit Result</span>
          <FiArrowRight
            size={11}
            className="text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#0038FF]"
          />
        </button>
      ),
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-8 max-w-[1400px] mx-auto pb-12 antialiased selection:bg-[#0038FF] selection:text-white">
        
        {/* ── Top Header Ribbon ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Candidate Portfolio
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                <FiShield size={9} /> Verified Submissions
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              Assessment Attempt History
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Historical record of your completed standardized tests, percentile distributions, and competency diagnostics.
            </p>
          </div>

          <div className="text-xs font-mono text-neutral-400 flex items-center gap-1.5 shrink-0 self-start sm:self-end">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Audit Ledger Online</span>
          </div>
        </div>

        {/* ── Global Error Prompt ── */}
        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/50 p-5 text-xs text-rose-700 font-mono">
            <FiAlertCircle size={16} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* ── Metric Stat Tiles ── */}
        <div className="grid gap-4 sm:grid-cols-3">
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                Total Attempts
              </span>
              <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF]">
                <FiLayers size={14} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-neutral-950 font-mono tracking-tight">
                {rows.length}
              </p>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                Submitted examination modules
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                Passed Modules
              </span>
              <div className="h-7 w-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <FiCheckCircle size={14} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-neutral-950 font-mono tracking-tight">
                {passedCount}
              </p>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                Met or exceeded benchmark threshold
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                Cohort Mean Score
              </span>
              <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF]">
                <FiActivity size={14} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-neutral-950 font-mono tracking-tight">
                {average}%
              </p>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                Aggregate proficiency index
              </p>
            </div>
          </motion.div>

        </div>

        {/* ── Assessment Data Table Container ── */}
        <section className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Audited Log
              </span>
              <h2 className="text-sm font-bold text-neutral-950 mt-0.5">
                Standardized Evaluation Records
              </h2>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded">
              {rows.length} Record{rows.length === 1 ? '' : 's'} Total
            </span>
          </div>

          <DataTable
            columns={columns}
            data={rows}
            pageSize={8}
            searchPlaceholder="Filter by evaluation module or date..."
          />
        </section>

      </div>
    </AppLayout>
  );
}