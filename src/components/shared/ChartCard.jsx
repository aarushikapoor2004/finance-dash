import { motion } from 'framer-motion';

export default function ChartCard({ title, subtitle, legend, children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`
        relative rounded-2xl overflow-hidden p-5 flex flex-col
        border border-white/[0.06]
        ${className}
      `}
      style={{
        background: 'rgba(15,20,40,0.55)',
        backdropFilter: 'blur(40px) saturate(1.6)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.12)',
      }}
    >
      {/* Card header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-[14px] font-bold text-white tracking-tight">{title}</h3>
          {subtitle && <p className="text-[11px] text-surface-500 mt-0.5">{subtitle}</p>}
        </div>
        {legend && <div className="flex items-center gap-3">{legend}</div>}
      </div>
      {children}
    </motion.div>
  );
}

export function LegendItem({ color, label }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] text-surface-500">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
