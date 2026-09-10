import { useEffect, useState } from 'react';
import api from '../services/api';

// Single resolver for the "active resume" used across Resume Intelligence
// pages. sessionStorage only survives the upload tab session, so when it is
// empty we fall back to the newest resume row from the backend instead of
// dead-ending on "No active resume record found".
// Returns { resumeId, fileName, loading, error }.
export default function useActiveResume() {
  const [state, setState] = useState(() => {
    const cached = sessionStorage.getItem('resumeId');
    return cached
      ? { resumeId: cached, fileName: sessionStorage.getItem('resumeFile') || null, loading: false, error: '' }
      : { resumeId: null, fileName: null, loading: true, error: '' };
  });

  useEffect(() => {
    if (state.resumeId || !state.loading) return;
    let cancelled = false;
    api
      .get('/api/resumes')
      .then(({ data }) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [];
        if (list.length === 0) {
          setState({ resumeId: null, fileName: null, loading: false, error: 'empty' });
          return;
        }
        const latest = [...list].sort((a, b) => {
          const ta = a.uploadTime ? new Date(a.uploadTime).getTime() : 0;
          const tb = b.uploadTime ? new Date(b.uploadTime).getTime() : 0;
          if (tb !== ta) return tb - ta;
          return (b.resumeId ?? 0) - (a.resumeId ?? 0);
        })[0];
        const id = String(latest.resumeId ?? latest.id ?? '');
        if (!id) {
          setState({ resumeId: null, fileName: null, loading: false, error: 'empty' });
          return;
        }
        sessionStorage.setItem('resumeId', id);
        if (latest.fileName) sessionStorage.setItem('resumeFile', latest.fileName);
        setState({ resumeId: id, fileName: latest.fileName || null, loading: false, error: '' });
      })
      .catch(() => {
        if (!cancelled) setState({ resumeId: null, fileName: null, loading: false, error: 'fetch-failed' });
      });
    return () => { cancelled = true; };
  }, [state.resumeId, state.loading]);

  return state;
}
