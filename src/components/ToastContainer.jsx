import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import useStore from '../store/store';

const TOAST_CONFIG = {
  success: {
    icon: CheckCircle2,
    bar:  'bg-emerald-500',
    icon_cls: 'text-emerald-400',
    border: 'rgba(16,185,129,0.18)',
  },
  error: {
    icon: AlertCircle,
    bar:  'bg-red-500',
    icon_cls: 'text-red-400',
    border: 'rgba(239,68,68,0.18)',
  },
  info: {
    icon: Info,
    bar:  'bg-indigo-500',
    icon_cls: 'text-indigo-400',
    border: 'rgba(99,102,241,0.18)',
  },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed bottom-5 right-5 z-[200] flex flex-col-reverse gap-2.5 pointer-events-none">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const cfg  = TOAST_CONFIG[toast.type] ?? TOAST_CONFIG.info;
          const Icon = cfg.icon;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.94 }}
              animate={{ opacity: 1, x: 0,  scale: 1    }}
              exit={{ opacity: 0,  x: 40,  scale: 0.94, transition: { duration: 0.18 } }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto relative flex items-center gap-3 pr-10 pl-4 py-3.5
                rounded-2xl overflow-hidden min-w-[280px] max-w-[340px]"
              style={{
                background: 'var(--toast-bg)',
                border: `1px solid ${cfg.border}`,
                boxShadow: 'var(--toast-shadow)',
                backdropFilter: 'blur(24px)',
              }}
            >
              {/* Left colour bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${cfg.bar} rounded-l-2xl`} />

              {/* Icon */}
              <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${cfg.icon_cls}`} />

              {/* Message */}
              <span className="text-[13px] font-medium leading-snug flex-1" style={{ color: 'var(--text-primary)' }}>
                {toast.message}
              </span>

              {/* Dismiss */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeToast(toast.id)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors duration-150"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>

              {/* Auto-dismiss progress bar */}
              <motion.div
                className={`absolute bottom-0 left-0 h-[2px] ${cfg.bar} opacity-40`}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 3.4, ease: 'linear' }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
