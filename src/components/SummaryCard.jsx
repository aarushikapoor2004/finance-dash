import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function SummaryCard({ title, value, change, icon: Icon, color, delay = 0 }) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  const colorClasses = {
    blue: 'from-primary-500 to-primary-600',
    green: 'from-success-400 to-success-600',
    red: 'from-danger-400 to-danger-600',
    purple: 'from-accent-400 to-accent-600',
  };

  const iconBgClasses = {
    blue: 'bg-primary-500/10 text-primary-500',
    green: 'bg-success-500/10 text-success-500',
    red: 'bg-danger-500/10 text-danger-500',
    purple: 'bg-accent-500/10 text-accent-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1, ease: [0.4, 0, 0.2, 1] }}
      className="stat-card group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${iconBgClasses[color] || iconBgClasses.blue}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
          isPositive ? 'bg-success-50 dark:bg-success-500/10 text-success-600 dark:text-success-400' :
          isNeutral ? 'bg-slate-100 dark:bg-white/5 text-slate-500' :
          'bg-danger-50 dark:bg-danger-500/10 text-danger-600 dark:text-danger-400'
        }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : isNeutral ? <Minus className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">{title}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
      
      {/* Bottom gradient accent */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${colorClasses[color] || colorClasses.blue} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </motion.div>
  );
}
