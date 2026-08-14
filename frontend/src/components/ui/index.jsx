import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle, ChevronRight } from 'lucide-react';

// ── Button ────────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', loading = false, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 select-none';
  const variants = {
    primary:   'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 focus:ring-slate-300',
    outline:   'border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 focus:ring-blue-300',
    ghost:     'hover:bg-slate-100 text-slate-600 focus:ring-slate-200',
    danger:    'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm',
    success:   'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500',
    gradient:  'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white focus:ring-blue-500 shadow-md shadow-blue-200/60',
  };
  const sizes = { xs: 'px-2.5 py-1.5 text-xs', sm: 'px-3.5 py-2 text-xs', md: 'px-5 py-2.5 text-sm', lg: 'px-6 py-3 text-base', xl: 'px-8 py-4 text-base' };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && (
        <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────
export function Input({ label, error, hint, icon, rightIcon, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">{icon}</span>}
        <input
          className={`w-full border rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200
            ${icon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-red-300 focus:ring-red-400 bg-red-50/30' : 'border-slate-200 focus:ring-blue-500'}
            ${className}`}
          {...props}
        />
        {rightIcon && <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">{rightIcon}</span>}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle size={11} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
      {hint && !error && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

// ── Select ────────────────────────────────────────────────────────────────────
export function Select({ label, error, className = '', children, ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
      <select
        className={`w-full border rounded-xl px-4 py-3 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${error ? 'border-red-300' : 'border-slate-200'} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Textarea ──────────────────────────────────────────────────────────────────
export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
      <textarea
        className={`w-full border rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${error ? 'border-red-300' : 'border-slate-200'} ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', hover = false, onClick, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.09)' } : {}}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-slate-100 text-slate-600',
    primary: 'bg-blue-100 text-blue-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger:  'bg-red-100 text-red-700',
    purple:  'bg-purple-100 text-purple-700',
    teal:    'bg-teal-100 text-teal-700',
    ai:      'bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-700 border border-indigo-200',
    outline: 'border border-slate-200 text-slate-600 bg-white',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-4/6" />
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────────────────────────
export function StatCard({ icon, label, value, change, color = 'blue', className = '' }) {
  const palette = {
    blue:   { bg: 'bg-blue-50',    icon: 'text-blue-600',    border: 'border-blue-100' },
    green:  { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
    purple: { bg: 'bg-purple-50',  icon: 'text-purple-600',  border: 'border-purple-100' },
    amber:  { bg: 'bg-amber-50',   icon: 'text-amber-600',   border: 'border-amber-100' },
    teal:   { bg: 'bg-teal-50',    icon: 'text-teal-600',    border: 'border-teal-100' },
  };
  const c = palette[color] || palette.blue;
  return (
    <Card hover className={`p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${c.bg} border ${c.border}`}>
          <span className={`text-lg ${c.icon}`}>{icon}</span>
        </div>
        {change !== undefined && (
          <Badge variant={change >= 0 ? 'success' : 'danger'}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </Badge>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">{label}</p>
      </div>
    </Card>
  );
}

// ── ProgressBar ───────────────────────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = 'blue', showLabel = false, size = 'md', label }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const colors = {
    blue:     'bg-blue-600',
    green:    'bg-emerald-500',
    purple:   'bg-purple-500',
    amber:    'bg-amber-500',
    teal:     'bg-teal-500',
    red:      'bg-red-500',
    gradient: 'bg-gradient-to-r from-blue-500 to-indigo-500',
  };
  const sizes = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
  return (
    <div className="w-full">
      {(label || showLabel) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs font-medium text-slate-600">{label}</span>}
          {showLabel && <span className="text-xs font-semibold text-slate-700">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className={`h-full rounded-full ${colors[color]}`}
        />
      </div>
    </div>
  );
}

// ── Alert ─────────────────────────────────────────────────────────────────────
export function Alert({ children, variant = 'info', className = '', onClose }) {
  const config = {
    info:    { cls: 'bg-blue-50 border-blue-200 text-blue-800',     Icon: Info },
    success: { cls: 'bg-emerald-50 border-emerald-200 text-emerald-800', Icon: CheckCircle },
    warning: { cls: 'bg-amber-50 border-amber-200 text-amber-800',  Icon: AlertTriangle },
    error:   { cls: 'bg-red-50 border-red-200 text-red-800',        Icon: AlertCircle },
  };
  const { cls, Icon } = config[variant] || config.info;
  return (
    <div role="alert" className={`rounded-xl border px-4 py-3 text-sm font-medium flex items-start gap-2.5 ${cls} ${className}`}>
      <Icon size={15} className="shrink-0 mt-0.5" />
      <span className="flex-1">{children}</span>
      {onClose && (
        <button onClick={onClose} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
          <X size={14} />
        </button>
      )}
    </div>
  );
}

// ── SectionHeader ─────────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size = 'md', footer }) {
  const overlayRef = useRef(null);
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-6xl' };

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`relative w-full ${sizes[size]} bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" aria-label="Close">
                <X size={16} />
              </button>
            </div>
            {/* Body */}
            <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">{children}</div>
            {/* Footer */}
            {footer && <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ── Table ─────────────────────────────────────────────────────────────────────
export function Table({ columns, data, loading, emptyMessage = 'No data found' }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <motion.tr
                key={row.id || i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-slate-50/80 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5 text-slate-700">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
export function Pagination({ page, totalPages, onChange, total, pageSize }) {
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-between pt-4 text-sm text-slate-500">
      <span>{total !== undefined ? `${total} total records` : `Page ${page} of ${totalPages}`}</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={14} className="rotate-180" />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors ${p === page ? 'bg-blue-600 text-white' : 'border border-slate-200 hover:bg-slate-50 text-slate-600'}`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && (
        <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <Icon size={28} className="text-slate-400" />
        </div>
      )}
      <h3 className="text-base font-bold text-slate-700">{title}</h3>
      {description && <p className="text-sm text-slate-400 mt-1.5 max-w-xs leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
export function Tooltip({ children, content, position = 'top' }) {
  const positions = {
    top:    '-top-9 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left:   'right-full mr-2 top-1/2 -translate-y-1/2',
    right:  'left-full ml-2 top-1/2 -translate-y-1/2',
  };
  return (
    <div className="relative group inline-flex">
      {children}
      <div className={`absolute z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${positions[position]}`}>
        <div className="bg-slate-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
          {content}
        </div>
      </div>
    </div>
  );
}

// ── Timeline ──────────────────────────────────────────────────────────────────
export function Timeline({ items }) {
  return (
    <div className="space-y-0">
      {items.map((item, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border-2 ${item.done ? 'bg-blue-600 border-blue-600' : item.active ? 'bg-white border-blue-600' : 'bg-white border-slate-200'}`}>
              {item.done
                ? <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                : <div className={`h-2.5 w-2.5 rounded-full ${item.active ? 'bg-blue-600' : 'bg-slate-300'}`} />
              }
            </div>
            {i < items.length - 1 && (
              <div className={`w-0.5 flex-1 my-1 ${item.done ? 'bg-blue-200' : 'bg-slate-100'}`} style={{ minHeight: 24 }} />
            )}
          </div>
          <div className="pb-6 min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <p className={`text-sm font-semibold ${item.done ? 'text-slate-500 line-through' : item.active ? 'text-slate-900' : 'text-slate-500'}`}>
                {item.title}
              </p>
              {item.badge && <Badge variant={item.done ? 'success' : item.active ? 'primary' : 'default'}>{item.badge}</Badge>}
            </div>
            {item.description && <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>}
            {item.time && <p className="text-[10px] text-slate-400 mt-1">{item.time}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────
export function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={13} className="text-slate-300" />}
          {item.href && i < items.length - 1 ? (
            <a href={item.href} className="text-slate-500 hover:text-blue-600 transition-colors font-medium">{item.label}</a>
          ) : (
            <span className={i === items.length - 1 ? 'text-slate-900 font-semibold' : 'text-slate-500 font-medium'}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────
export function Divider({ label, className = '' }) {
  if (!label) return <hr className={`border-slate-100 ${className}`} />;
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-px bg-slate-100" />
      <span className="text-xs font-medium text-slate-400">{label}</span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

// ── AIBanner ──────────────────────────────────────────────────────────────────
export function AIBanner({ title, description, action, completion }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-5 text-white shadow-lg shadow-blue-200/40">
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-teal-400/20 blur-2xl pointer-events-none" />
      <div className="relative flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold">{title}</p>
          <p className="text-xs text-blue-100 mt-0.5 leading-relaxed">{description}</p>
        </div>
        {completion !== undefined && (
          <Badge className="bg-white/20 text-white border border-white/30 shrink-0">{completion}%</Badge>
        )}
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
