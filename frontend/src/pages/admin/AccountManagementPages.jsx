import { useEffect, useMemo, useState } from 'react';
import { 
  FiSearch, FiUserCheck, FiUserX, FiShield, 
  FiUsers, FiAlertCircle, FiBriefcase, FiCalendar 
} from 'react-icons/fi';
import { adminService } from '../../services/adminService';

const StatusBadge = ({ children, tone = 'neutral' }) => {
  const tones = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/80',
    red: 'bg-rose-50 text-rose-700 border-rose-200/80',
    blue: 'bg-blue-50 text-[#0038FF] border-blue-100',
    neutral: 'bg-neutral-100 text-neutral-600 border-neutral-200/80',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold uppercase tracking-wider border ${tones[tone] || tones.neutral}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${
        tone === 'green' ? 'bg-emerald-500' :
        tone === 'amber' ? 'bg-amber-500' :
        tone === 'red' ? 'bg-rose-500' :
        tone === 'blue' ? 'bg-[#0038FF]' : 'bg-neutral-400'
      }`} />
      {children}
    </span>
  );
};

const EmptyState = ({ text }) => (
  <div className="py-16 text-center space-y-2">
    <FiAlertCircle size={24} className="mx-auto text-neutral-400" />
    <p className="text-xs text-neutral-500 font-mono">{text}</p>
  </div>
);

function PageHeader({ eyebrow, title, description, count, countLabel }) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
          {eyebrow}
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950 mt-0.5">
          {title}
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          {description}
        </p>
      </div>

      {count !== undefined && (
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200/80 self-start sm:self-auto">
          <FiShield className="text-[#0038FF]" size={13} />
          <span>{count} {countLabel}</span>
        </div>
      )}
    </header>
  );
}

function SearchBox({ value, onChange, placeholder = "Search directory records..." }) {
  return (
    <div className="relative max-w-md">
      <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={14} />
      <input
        className="w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs font-mono"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

// ── 1. User Management Page ──────────────────────────────────────────────────
export function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await adminService.getUsers({ search: query, size: 100 });
      setUsers(result.content || result || []);
    } catch {
      setError('Unable to retrieve user directory from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const toggle = async (user) => {
    try {
      const updated = user.active 
        ? await adminService.deactivateUser(user.id) 
        : await adminService.activateUser(user.id);
      setUsers(rows => rows.map(row => row.id === user.id ? updated : row));
    } catch {
      setError(`Unable to update access state for ${user.email}.`);
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10 antialiased selection:bg-[#0038FF] selection:text-white">
      <PageHeader
        eyebrow="Account Governance"
        title="User Directory & Access"
        description="Supervise registered student and mentor identities, role assignments, and authentication status."
        count={users.length}
        countLabel="Total Accounts"
      />

      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-xs text-rose-700 font-mono">
          {error}
        </div>
      )}

      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
        <SearchBox 
          value={query} 
          onChange={setQuery} 
          placeholder="Filter by candidate name, email, or role..."
        />

        {loading ? (
          <EmptyState text="Querying registered account records..." />
        ) : users.length === 0 ? (
          <EmptyState text="No accounts match your search criteria." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead>
                <tr className="border-y border-neutral-100 bg-[#F8FAFC] text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  <th className="px-4 py-3 font-semibold">User Identity</th>
                  <th className="px-4 py-3 font-semibold">Assigned Roles</th>
                  <th className="px-4 py-3 font-semibold">Lifecycle Status</th>
                  <th className="px-4 py-3 font-semibold">Access State</th>
                  <th className="px-4 py-3 font-semibold text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {users.map(user => {
                  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';
                  return (
                    <tr key={user.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-7 w-7 rounded bg-neutral-950 font-mono text-[10px] font-bold text-white flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-neutral-900 truncate">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-[11px] text-neutral-400 font-mono truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-[11px] text-neutral-700">
                        {user.roles?.map(r => r.replace('ROLE_', '')).join(', ') || 'STUDENT'}
                      </td>

                      <td className="px-4 py-3.5">
                        <StatusBadge tone={
                          user.accountStatus === 'REJECTED' ? 'red' :
                          user.accountStatus?.includes('PENDING') ? 'amber' :
                          user.accountStatus === 'VERIFIED' ? 'green' : 'neutral'
                        }>
                          {user.accountStatus || 'STANDARD'}
                        </StatusBadge>
                      </td>

                      <td className="px-4 py-3.5">
                        <StatusBadge tone={user.active ? 'green' : 'neutral'}>
                          {user.active ? 'Active' : 'Disabled'}
                        </StatusBadge>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => toggle(user)}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                            user.active
                              ? 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {user.active ? <FiUserX size={13} /> : <FiUserCheck size={13} />}
                          <span>{user.active ? 'Disable' : 'Enable'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 2. Mentor Management Page ────────────────────────────────────────────────
export function MentorManagementPage() {
  const [mentors, setMentors] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setMentors(await adminService.getMentors());
    } catch {
      setError('Unable to retrieve mentor directory from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const visible = useMemo(() => 
    mentors.filter(mentor => JSON.stringify(mentor).toLowerCase().includes(query.toLowerCase())),
    [mentors, query]
  );

  const toggle = async (mentor) => {
    const active = mentor.active !== false;
    try {
      await (active ? adminService.deactivateMentor(mentor.id) : adminService.activateMentor(mentor.id));
      await load();
    } catch {
      setError(`Unable to update access state for ${mentor.fullName}.`);
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10 antialiased selection:bg-[#0038FF] selection:text-white">
      <PageHeader
        eyebrow="Advisor Administration"
        title="Manage Mentors"
        description="Inspect verified industry advisors, evaluate tenures, and regulate platform guidance privileges."
        count={mentors.length}
        countLabel="Registered Mentors"
      />

      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-xs text-rose-700 font-mono">
          {error}
        </div>
      )}

      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
        <SearchBox 
          value={query} 
          onChange={setQuery} 
          placeholder="Filter by mentor name, company, domain, or credentials..."
        />

        {loading ? (
          <EmptyState text="Querying mentor records from registry..." />
        ) : visible.length === 0 ? (
          <EmptyState text="No mentors match your search criteria." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] text-left text-xs">
              <thead>
                <tr className="border-y border-neutral-100 bg-[#F8FAFC] text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  <th className="px-4 py-3 font-semibold">Advisor</th>
                  <th className="px-4 py-3 font-semibold">Organization & Role</th>
                  <th className="px-4 py-3 font-semibold">Verification</th>
                  <th className="px-4 py-3 font-semibold">Tenure</th>
                  <th className="px-4 py-3 font-semibold">Access State</th>
                  <th className="px-4 py-3 font-semibold text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {visible.map(mentor => {
                  const initials = mentor.fullName
                    ? mentor.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
                    : 'M';

                  return (
                    <tr key={mentor.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-7 w-7 rounded bg-neutral-950 font-mono text-[10px] font-bold text-white flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-neutral-900 truncate">{mentor.fullName}</p>
                            <p className="text-[11px] text-neutral-400 font-mono truncate">{mentor.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <p className="font-medium text-neutral-800 truncate">{mentor.company || 'Independent'}</p>
                        <p className="text-[11px] text-neutral-400 font-mono truncate">{mentor.jobTitle || 'Advisor'}</p>
                      </td>

                      <td className="px-4 py-3.5">
                        <StatusBadge tone={
                          mentor.status === 'VERIFIED' ? 'green' :
                          mentor.status === 'REJECTED' ? 'red' : 'amber'
                        }>
                          {mentor.status || 'PENDING'}
                        </StatusBadge>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-[11px] text-neutral-600">
                        {mentor.experienceYears !== undefined ? `${mentor.experienceYears} yrs` : '—'}
                      </td>

                      <td className="px-4 py-3.5">
                        <StatusBadge tone={mentor.active ? 'green' : 'neutral'}>
                          {mentor.active ? 'Active' : 'Disabled'}
                        </StatusBadge>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => toggle(mentor)}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                            mentor.active
                              ? 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {mentor.active ? <FiUserX size={13} /> : <FiUserCheck size={13} />}
                          <span>{mentor.active ? 'Disable' : 'Enable'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}