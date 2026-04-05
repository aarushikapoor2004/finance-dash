import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.12 + i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Field({ label, icon: Icon, error, index, children }) {
  return (
    <motion.div custom={index} variants={fieldVariants} initial="hidden" animate="visible" className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-surface-500">
        <Icon className="w-3 h-3" />
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1 text-[11px] text-red-400 font-medium ml-0.5"
          >
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export { fieldVariants };
