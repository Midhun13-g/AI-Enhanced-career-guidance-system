import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiClipboard, FiPlus, FiRefreshCw, FiClock, 
  FiHelpCircle, FiShield, FiAlertCircle, FiCheckSquare, 
  FiLayers, FiArrowRight 
} from 'react-icons/fi';
import { adminService } from '../../services/adminService';

const StatusBadge = ({ status }) => {
  const isPublished = status === 'PUBLISHED' || status === 'ACTIVE';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
      isPublished
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
        : 'bg-neutral-100 text-neutral-600 border-neutral-200'
    }`}>
      <span className={`h-1.5 w-1.5 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
      {status || 'DRAFT'}
    </span>
  );
};

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getAssessments();
      setAssessments(Array.isArray(data) ? data : data?.content || []);
    } catch {
      setError('Unable to load evaluation catalog. Please refresh to try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12 antialiased selection:bg-[#0038FF] selection:text-white">
      
      {/* ── Top Header & Global Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Evaluation Catalog
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
              <FiShield size={9} /> Assessment Core
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950 mt-0.5">
            All Standardized Assessments
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Supervise published test banks, evaluate duration budgets, and manage candidate testing pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-all shadow-2xs font-mono"
            aria-label="Refresh assessment list"
          >
            <FiRefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <Link
            to="/admin/assessments/create"
            className="inline-flex items-center gap-1.5 bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-md shadow-blue-500/20"
          >
            <FiPlus size={14} />
            <span>Create Assessment</span>
          </Link>
        </div>
      </div>

      {/* ── Main Assessment Catalog Section ── */}
      <section className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
        
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <FiRefreshCw size={22} className="mx-auto text-neutral-400 animate-spin" />
            <p className="text-xs text-neutral-500 font-mono">Querying published assessment repository...</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center space-y-2">
            <FiAlertCircle size={24} className="mx-auto text-rose-500" />
            <p className="text-xs text-rose-600 font-mono">{error}</p>
            <button 
              onClick={load} 
              className="text-xs text-[#0038FF] font-mono hover:underline inline-block pt-1"
            >
              Try reloading
            </button>
          </div>
        ) : assessments.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="h-10 w-10 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-400 flex items-center justify-center mx-auto">
              <FiClipboard size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">No Assessments Published</h3>
              <p className="text-xs text-neutral-500 font-mono mt-0.5 max-w-sm mx-auto">
                No evaluation test banks found. Create an assessment manually or synthesize questions via rubric tools.
              </p>
            </div>
            <Link
              to="/admin/assessments/create"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0038FF] hover:underline font-mono pt-1"
            >
              <span>Build first assessment</span>
              <FiArrowRight size={12} />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {assessments.map((assessment) => (
              <article
                key={assessment.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-sm font-bold text-neutral-950 truncate group-hover:text-[#0038FF] transition-colors">
                      {assessment.title}
                    </h2>
                    <StatusBadge status={assessment.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-neutral-500">
                    <span className="flex items-center gap-1 text-neutral-700 font-medium">
                      <FiLayers size={12} className="text-[#0038FF]" />
                      {assessment.category || 'General Track'}
                    </span>
                    <span>·</span>
                    <span className="text-neutral-600">
                      Tier: <strong className="text-neutral-800 uppercase">{assessment.difficulty || 'Intermediate'}</strong>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <FiHelpCircle size={12} className="text-neutral-400" />
                      {assessment.totalQuestions ?? 0} Questions
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <FiClock size={12} className="text-neutral-400" />
                      {assessment.durationMinutes ?? 30} mins
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                  <Link
                    to={`/admin/assessments/questions?assessmentId=${assessment.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 hover:text-neutral-950 text-xs font-semibold font-mono transition-all"
                  >
                    <FiCheckSquare size={13} />
                    <span>Manage Bank</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

      </section>
    </div>
  );
}