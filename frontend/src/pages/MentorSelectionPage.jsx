import { useEffect, useState } from 'react';
import { 
  FiSearch, FiCheck, FiBriefcase, FiMail, 
  FiLinkedin, FiUserCheck, FiShield, FiAlertCircle 
} from 'react-icons/fi';
import AppLayout from '../components/layout/AppLayout';
import api from '../services/api';
import { Alert } from '../components/ui';

export default function MentorSelectionPage() {
  const [mentors, setMentors] = useState([]);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/api/student/mentor')
      .then(r => setMentors(r.data))
      .catch(() => setMessage('Unable to retrieve verified advisors.'));
  }, []);

  const shown = mentors.filter(m =>
    JSON.stringify(m).toLowerCase().includes(query.toLowerCase())
  );

  const select = async (email) => {
    setLoading(true);
    try {
      await api.post('/api/student/mentor', { mentorEmail: email });
      setSelectedEmail(email);
      setMessage(`Successfully linked ${email} as your primary mentor.`);
    } catch (e) {
      setMessage(e.response?.data?.message || 'Unable to link requested advisor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
        
        {/* ── Header Ribbon ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Advisor Directory
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950 mt-0.5">
              Verified Mentor Network
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Connect with audited industry advisors to guide your trajectory and skill roadmap.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-lg">
            <FiShield className="text-[#0038FF]" size={13} />
            <span>{mentors.length} Verified Mentors Available</span>
          </div>
        </div>

        {/* ── Search Toolbar ── */}
        <div className="relative max-w-xl">
          <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by advisor name, domain, institution, or company..."
            className="w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs"
          />
        </div>

        {/* Feedback Alert */}
        {message && (
          <Alert variant={message.includes('Successfully') ? 'success' : 'info'} className="text-xs">
            {message}
          </Alert>
        )}

        {/* ── Mentor Grid ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((m) => {
            const isSelected = selectedEmail === m.email;
            return (
              <article 
                key={m.id || m.email} 
                className={`bg-white border rounded-2xl p-6 flex flex-col justify-between transition-all ${
                  isSelected 
                    ? 'border-[#0038FF] ring-2 ring-[#0038FF]/10 shadow-md' 
                    : 'border-neutral-200/90 hover:border-neutral-300 hover:shadow-xs shadow-2xs'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Row: Name + Verified Tag */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-base font-bold tracking-tight text-neutral-950">
                        {m.fullName}
                      </h2>
                      <p className="text-xs font-mono text-neutral-400 flex items-center gap-1.5 mt-0.5">
                        <FiMail size={12} />
                        <span>{m.email}</span>
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[10px] font-bold font-mono uppercase tracking-wider shrink-0">
                      <FiCheck size={10} strokeWidth={3} />
                      Verified
                    </span>
                  </div>

                  {/* Company & Role */}
                  <div className="flex items-center gap-2 text-xs font-medium text-neutral-700 bg-[#F8FAFC] border border-neutral-200/60 rounded-lg px-3 py-2">
                    <FiBriefcase size={13} className="text-[#0038FF] shrink-0" />
                    <span className="truncate">
                      {m.jobTitle || 'Industry Mentor'} · <strong className="text-neutral-900">{m.company || 'Enterprise'}</strong>
                    </span>
                  </div>

                  {/* Competency / Domain Tags */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                      Domain Competencies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(m.expertise ? m.expertise.split(',') : ['Career Guidance', 'Systems']).map((skill, idx) => (
                        <span 
                          key={idx}
                          className="inline-flex items-center px-2.5 py-0.5 rounded bg-neutral-100 border border-neutral-200/80 text-[11px] font-medium text-neutral-700 font-mono"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* LinkedIn / Public URL link if present */}
                  {m.linkedinUrl && (
                    <a
                      href={m.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#0038FF] hover:underline pt-1 font-mono text-[11px]"
                    >
                      <FiLinkedin size={12} />
                      <span>Verified Profile Link</span>
                    </a>
                  )}
                </div>

                {/* Card Action CTA */}
                <div className="border-t border-neutral-100 pt-4 mt-5">
                  <button
                    onClick={() => select(m.email)}
                    disabled={loading || isSelected}
                    className={`w-full rounded-lg text-xs font-semibold py-2.5 transition-all flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
                        : 'bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white shadow-sm shadow-blue-500/20'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <FiCheck size={14} strokeWidth={2.5} />
                        <span>Assigned Advisor</span>
                      </>
                    ) : (
                      <>
                        <FiUserCheck size={14} />
                        <span>Select Mentor</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty State */}
        {!shown.length && !message && (
          <div className="rounded-2xl border border-dashed border-neutral-300 p-12 text-center bg-white">
            <FiAlertCircle size={28} className="mx-auto text-neutral-400 mb-3" />
            <h3 className="text-sm font-bold text-neutral-900">No mentors match your search</h3>
            <p className="text-xs text-neutral-500 mt-1">Try querying a different technical skill, company name, or domain.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}