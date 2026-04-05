import { motion } from 'framer-motion';

export default function ChartCard({ title, subtitle, legend, children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`
        relative rounded-2xl overflow-hidden p-5 flex flex-col
        ${className}
      `}
      style={{
        background: 'var(--bg-card-solid)',
        border: '1px solid var(--border-card)',
        backdropFilter: 'blur(40px) saturate(1.6)',
        boxShadow: 'var(--card-shadow)',
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}
    >
      {/* Card header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-[14px] font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{title}</h3>
          {subtitle && <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
        </div>
        {legend && <div className="flex items-center gap-3">{legend}</div>}
      </div>
      {children}
    </motion.div>
  );
}

export function LegendItem({ color, label }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
