import { Clock } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function Timer({ minutes = 45 }) {
  const [remaining, setRemaining] = useState(minutes * 60);
  useEffect(() => {
    const interval = setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatted = useMemo(() => {
    const mins = Math.floor(remaining / 60).toString().padStart(2, '0');
    const secs = (remaining % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }, [remaining]);

  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm" aria-label={`Time remaining ${formatted}`}>
      <Clock size={16} className={remaining < 300 ? 'text-red-500' : 'text-blue-600'} aria-hidden="true" />
      {formatted}
    </div>
  );
}
