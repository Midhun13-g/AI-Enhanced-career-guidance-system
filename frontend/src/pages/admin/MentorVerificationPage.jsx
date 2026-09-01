import { useEffect, useMemo, useState } from 'react';
import { 
  FiCheck, FiExternalLink, FiFileText, FiSearch, 
  FiX, FiShield, FiAlertCircle, FiClock, FiUser, 
  FiBriefcase, FiPhone, FiCalendar, FiArrowRight 
} from 'react-icons/fi';
import { mentorVerificationService as service } from '../../services/mentorVerificationService';

function DetailItem({ label, value }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
        {label}
      </p>
      <p className="text-xs font-semibold text-neutral-900 truncate">
        {value || '—'}
      </p>
    </div>
  );
}

export default function MentorVerificationPage() {
  const [applications, setApplications] = useState([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [rejecting, setRejecting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    service.list()
      .then(data => setApplications(data || []))
      .catch(() => setError('Unable to load pending mentor applications.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const visible = useMemo(() =>
    applications.filter(item => JSON.stringify(item).toLowerCase().includes(query.toLowerCase())),
    [applications, query]
  );

  const decide = async (approved) => {
    if (!approved && !remarks.trim()) return;
    setSaving(true);
    try {
      if (approved) await service.approve(selected.id);
      else await service.reject(selected.id, remarks.trim());
      setSelected(null);
      setRejecting(false);
      setRemarks('');
      load();
    } catch {
      setError(`Unable to ${approved ? 'approve' : 'reject'} this application.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12 antialiased selection:bg-[#0038FF] selection:text-white">
      
      {/* ── Top Header Ribbon ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Governance & Accreditation
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200/80 text-amber-700 text-[9px] font-bold font-mono uppercase">
              <FiClock size={9} /> Verification Queue
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950 mt-0.5">
            Mentor Credential Audits
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Review submitted identity and employment credentials before granting advisor permissions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200/80">
          <FiShield className="text-[#0038FF]" size={13} />
          <span>{applications.length} Pending Approval</span>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-xs text-rose-700 font-mono">
          {error}
        </div>
      )}

      {/* ── Applications Directory Card ── */}
      <section className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
        
        {/* Search Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
          <div className="relative max-w-md flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={14} />
            <input
              className="w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs font-mono"
              placeholder="Filter by applicant name, company, or domain..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            Displaying {visible.length} applications
          </span>
        </div>

        {/* Content Stream */}
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <FiClock size={22} className="mx-auto text-neutral-400 animate-spin" />
            <p className="text-xs text-neutral-500 font-mono">Loading pending applications from registry...</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <FiShield size={24} className="mx-auto text-neutral-300" />
            <h3 className="text-sm font-bold text-neutral-900">Verification Queue Empty</h3>
            <p className="text-xs text-neutral-500 font-mono">No advisor applications currently pending review.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {visible.map((application) => (
              <article
                key={application.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-bold text-neutral-950 truncate">
                      {application.fullName}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Pending Audit
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 truncate">
                    {application.email} · <strong className="text-neutral-800">{application.company}</strong> ({application.jobTitle})
                  </p>

                  <p className="text-[11px] font-mono text-neutral-400">
                    Tenure: {application.experienceYears ?? '—'} yrs · {application.documents?.length || 0} Credential Link(s) Attached
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelected(application)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 px-3.5 py-2 text-xs font-semibold font-mono transition-all shadow-2xs hover:border-[#0038FF] hover:text-[#0038FF]"
                  >
                    <span>Audit Credentials</span>
                    <FiArrowRight size={13} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ── Review Application Modal ── */}
      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/40 backdrop-blur-xs p-4" role="dialog" aria-modal="true">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-2xl border border-neutral-200 bg-white shadow-2xl p-6 sm:p-7 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0038FF] font-mono">
                  Credential Audit Spec
                </span>
                <h2 className="text-xl font-extrabold tracking-tight text-neutral-950 mt-0.5">
                  {selected.fullName}
                </h2>
                <p className="text-xs text-neutral-500 font-mono mt-0.5">{selected.email}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Profile Grid */}
            <div className="grid gap-3.5 rounded-xl border border-neutral-100 bg-[#F8FAFC] p-4 sm:grid-cols-3">
              <DetailItem label="Organization" value={selected.company} />
              <DetailItem label="Job Title" value={selected.jobTitle} />
              <DetailItem label="Industry Tenure" value={`${selected.experienceYears || '0'} Years`} />
              <DetailItem label="Phone Record" value={selected.phone} />
              <DetailItem label="Core Domain" value={selected.expertise} />
              <DetailItem label="Submission Date" value={selected.submittedAt ? new Date(selected.submittedAt).toLocaleDateString() : '—'} />
            </div>

            {/* Document Links Section */}
            <div className="space-y-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 font-mono">
                  Submitted Verification Assets
                </h3>
                <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                  Inspect external identity and employment files prior to approval.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {selected.documents?.map((document) => (
                  <a
                    key={document.id || document.type}
                    href={document.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-3.5 hover:border-[#0038FF] transition-all group shadow-2xs"
                  >
                    <div>
                      <FiFileText size={16} className="text-[#0038FF]" />
                      <p className="text-xs font-bold text-neutral-900 mt-2 truncate font-mono">
                        {document.type || 'Identity Asset'}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-neutral-500 group-hover:text-[#0038FF] mt-3">
                      <span>Open Document</span>
                      <FiExternalLink size={10} />
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Biography */}
            {selected.bio && (
              <div className="space-y-1.5 border-t border-neutral-100 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 font-mono">
                  Candidate Biography
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed bg-[#F8FAFC] border border-neutral-100 p-3.5 rounded-xl">
                  {selected.bio}
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2.5 border-t border-neutral-100 pt-4">
              <button
                type="button"
                onClick={() => setRejecting(true)}
                disabled={saving}
                className="rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 px-4 py-2 text-xs font-semibold font-mono transition-all disabled:opacity-50"
              >
                Reject Application
              </button>
              <button
                type="button"
                onClick={() => decide(true)}
                disabled={saving}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#0038FF] hover:bg-blue-700 text-white px-5 py-2 text-xs font-semibold font-mono shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                <FiCheck size={13} />
                <span>{saving ? 'Committing...' : 'Approve & Activate Mentor'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── Rejection Reason Modal ── */}
      {rejecting && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-neutral-950/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-950">Specify Rejection Reason</h3>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">
                This rationale will be transmitted to the applicant.
              </p>
            </div>

            <textarea
              className="w-full rounded-lg border border-neutral-200 bg-white p-3 text-xs text-neutral-900 outline-none focus:ring-2 focus:ring-[#0038FF] transition-all font-mono resize-none"
              rows={4}
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="e.g. Unverifiable document link, permission denied on Drive asset..."
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setRejecting(false)}
                className="rounded-lg border border-neutral-200 px-3.5 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 font-mono"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => decide(false)}
                disabled={saving || !remarks.trim()}
                className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-4 py-1.5 text-xs font-semibold font-mono shadow-xs disabled:opacity-50"
              >
                {saving ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}