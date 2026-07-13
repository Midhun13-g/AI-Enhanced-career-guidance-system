import { createContext, useCallback, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX, FiAlertTriangle } from 'react-icons/fi';

const ToastContext = createContext(null);

const config = {
  success: { icon: FiCheckCircle,   bg: 'bg-emerald-50 border-emerald-200', icon_cls: 'text-emerald-500', text: 'text-emerald-800' },
  error:   { icon: FiAlertCircle,   bg: 'bg-red-50 border-red-200',         icon_cls: 'text-red-500',     text: 'text-red-800' },
  info:    { icon: FiInfo,          bg: 'bg-blue-50 border-blue-200',        icon_cls: 'text-blue-500',    text: 'text-blue-800' },
  warning: { icon: FiAlertTriangle, bg: 'bg-amber-50 border-amber-200',      icon_cls: 'text-amber-500',   text: 'text-amber-800' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev.slice(-4), { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const remove = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 pointer-events-none" aria-live="polite">
        <AnimatePresence mode="popLayout">
          {toasts.map(t => {
            const c = config[t.type] || config.info;
            const Icon = c.icon;
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 80, scale: 0.88 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 80, scale: 0.88 }}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-xl min-w-[300px] max-w-sm ${c.bg}`}
              >
                <Icon className={`mt-0.5 shrink-0 ${c.icon_cls}`} size={17} />
                <p className={`text-sm font-medium flex-1 leading-snug ${c.text}`}>{t.message}</p>
                <button onClick={() => remove(t.id)} className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors mt-0.5" aria-label="Dismiss">
                  <FiX size={15} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
