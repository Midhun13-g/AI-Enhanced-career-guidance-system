import { useEffect, useMemo, useState } from 'react';
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { mentorVerificationService as service } from '../../services/mentorVerificationService';

const statuses = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED'];
const badge = { PENDING: 'warning', UNDER_REVIEW: 'info', APPROVED: 'success', REJECTED: 'error', SUSPENDED: 'default' };

const ic = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100';

export default function MentorVerificationPage() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    service.list({ status: status || undefined })
      .then(x => setRows(x.content || x || []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, [status]);

  const filtered = useMemo(
    () => rows.filter(x => JSON.stringify(x).toLowerCase().includes(query.toLowerCase())),
    [rows, query],
  );

  const act = async () => {
    if ((dialog === 'reject' || dialog === 'request-info' || dialog === 'suspend') && !reason.trim()) return;
    try {
      if (dialog === 'approve')      await service.approve(selected.id);
      if (dialog === 'reject')       await service.reject(selected.id, reason);
      if (dialog === 'request-info') await service.requestInfo(selected.id, reason);
      if (dialog === 'suspend')      await service.suspend(selected.id, reason);
      load();
    } finally {
      setDialog(null);
      setReason('');
    }
  };

  return (
    <div>
      <header className="mb-7">
        <p className="text-sm font-semibold text-indigo-600">MENTOR VERIFICATION</p>
        <h1 className="mt-1 text-3xl font-bold">Review mentor applications</h1>
        <p className="mt-2 text-slate-500">Verify professional credentials and keep the mentor network trusted.</p>
      </header>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        {/* Filter bar — native inputs, no MUI style conflicts */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <input
            className={ic}
            placeholder="Search mentors…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <select
            className={`${ic} sm:w-48 shrink-0`}
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            {statuses.map(s => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
            No mentor applications found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-y bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  {['Profile', 'Company', 'Experience', 'Documents', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(x => (
                  <tr key={x.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                    <td className="px-4 py-4">
                      <p className="font-semibold">{x.fullName || x.name}</p>
                      <p className="text-xs text-slate-500">{x.email}</p>
                    </td>
                    <td className="px-4 py-4">{x.company || x.currentCompany || '—'}</td>
                    <td className="px-4 py-4">{x.experience ?? x.yearsOfExperience ?? '—'} yrs</td>
                    <td className="px-4 py-4">{x.documents?.length ?? '—'}</td>
                    <td className="px-4 py-4">
                      <Chip size="small" color={badge[x.status] || 'default'} label={(x.status || 'PENDING').replace('_', ' ')} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button size="small" onClick={() => service.detail(x.id).then(setSelected)}>View</Button>
                        {x.status !== 'APPROVED'   && <Button size="small" color="success" onClick={() => { setSelected(x); setDialog('approve'); }}>Approve</Button>}
                        {x.status !== 'REJECTED'   && <Button size="small" color="error"   onClick={() => { setSelected(x); setDialog('reject'); }}>Reject</Button>}
                        <Button size="small" onClick={() => { setSelected(x); setDialog('request-info'); }}>Request info</Button>
                        {x.status !== 'SUSPENDED'  && <Button size="small" color="warning" onClick={() => { setSelected(x); setDialog('suspend'); }}>Suspend</Button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Profile detail dialog */}
      <Dialog open={!!selected && !dialog} onClose={() => setSelected(null)} fullWidth maxWidth="md">
        <DialogTitle>Mentor profile</DialogTitle>
        <DialogContent dividers>
          {selected && (
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(selected)
                .filter(([k]) => k !== 'documents')
                .map(([k, v]) => (
                  <div key={k}>
                    <p className="text-xs uppercase text-slate-500">{k}</p>
                    <p className="text-sm text-slate-800">{typeof v === 'object' ? JSON.stringify(v) : String(v ?? '—')}</p>
                  </div>
                ))}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Action dialog */}
      <Dialog open={!!dialog} onClose={() => setDialog(null)}>
        <DialogTitle>
          {dialog === 'approve' ? 'Approve mentor' : dialog === 'reject' ? 'Reject mentor' : dialog === 'suspend' ? 'Suspend mentor' : 'Request more information'}
        </DialogTitle>
        <DialogContent>
          {dialog !== 'approve' && (
            <textarea
              autoFocus
              required
              rows={3}
              className={`${ic} mt-2 resize-none`}
              placeholder="Reason…"
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(null)}>Cancel</Button>
          <Button variant="contained" onClick={act}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
