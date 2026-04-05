import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  title       = 'No data found',
  description = 'There are no items to display.',
  icon: Icon  = Inbox,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      {/* Icon container */}
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-2xl bg-indigo-500/10 blur-xl" />
        <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center border border-white/[0.06]"
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          <Icon className="w-6 h-6 text-surface-500" />
        </div>
      </div>

      <h3 className="text-[15px] font-semibold text-white mb-1.5">{title}</h3>
      <p className="text-[12px] text-surface-500 max-w-[240px] leading-relaxed">{description}</p>
    </motion.div>
  );
}
