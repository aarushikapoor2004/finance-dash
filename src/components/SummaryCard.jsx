import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useRef } from 'react';

// ─── Per-colour design tokens ────────────────────────────────────────────────
const THEMES = {
  blue: {
    icon:     'bg-indigo-500/[0.12] text-indigo-400',
    glow:     'rgba(99,102,241,0.18)',
    border:   'rgba(99,102,241,0.25)',
    bar:      'from-indigo-500 to-violet-500',
    sparkFill:'#6366f1',
    ring:     'rgba(99,102,241,0.12)',
  },
  green: {
    icon:     'bg-emerald-500/[0.12] text-emerald-400',
    glow:     'rgba(52,211,153,0.15)',
    border:   'rgba(52,211,153,0.22)',
    bar:      'from-emerald-400 to-teal-500',
    sparkFill:'#10b981',
    ring:     'rgba(52,211,153,0.10)',
  },
  red: {
    icon:     'bg-red-500/[0.12] text-red-400',
    glow:     'rgba(239,68,68,0.15)',
    border:   'rgba(239,68,68,0.22)',
    bar:      'from-red-400 to-rose-500',
    sparkFill:'#ef4444',
    ring:     'rgba(239,68,68,0.10)',
  },
  purple: {
    icon:     'bg-violet-500/[0.12] text-violet-400',
    glow:     'rgba(139,92,246,0.18)',
    border:   'rgba(139,92,246,0.25)',
    bar:      'from-violet-400 to-purple-600',
    sparkFill:'#8b5cf6',
    ring:     'rgba(139,92,246,0.12)',
  },
};

// ─── Mini sparkline bars (decorative trend) ──────────────────────────────────
const SPARKLINES = {
  blue:   [40, 55, 45, 65, 58, 70, 80, 75, 90, 85, 92, 100],
  green:  [60, 50, 70, 65, 80, 72, 85, 78, 88, 82, 95, 100],
  red:    [80, 90, 75, 85, 70, 78, 68, 74, 62, 70, 58, 60 ],
  purple: [45, 60, 55, 70, 65, 78, 72, 82, 78, 88, 85, 100],
};

function MiniSparkline({ color, fill }) {
  const points = SPARKLINES[color] || SPARKLINES.blue;
  const max = Math.max(...points);
  const h = 36;
  const w = 100;
  const step = w / (points.length - 1);

  const d = points
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${h - (v / max) * h}`)
    .join(' ');

  const area = `${d} L ${(points.length - 1) * step} ${h} L 0 ${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-9 overflow-visible"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`spark-grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={fill} stopOpacity={0.25} />
          <stop offset="100%" stopColor={fill} stopOpacity={0}    />
        </linearGradient>
      </defs>
      {/* Area fill */}
      <motion.path
        d={area}
        fill={`url(#spark-grad-${color})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      />
      {/* Line */}
      <motion.path
        d={d}
        fill="none"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.9, ease: 'easeOut' }}
      />
      {/* Terminal dot */}
      <motion.circle
        cx={(points.length - 1) * step}
        cy={h - (points[points.length - 1] / max) * h}
        r="2.5"
        fill={fill}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.25, type: 'spring' }}
      />
    </svg>
  );
}

// ─── Change badge ─────────────────────────────────────────────────────────────
function ChangeBadge({ change }) {
  const isPositive = change > 0;
  const isNeutral  = change === 0;

  const cls = isPositive
    ? 'bg-emerald-500/[0.10] text-emerald-400 border border-emerald-500/[0.18]'
    : isNeutral
    ? 'border'
    : 'bg-red-500/[0.10] text-red-400 border border-red-500/[0.18]';

  const neutralStyle = isNeutral ? { background: 'var(--badge-bg)', color: 'var(--badge-text)', borderColor: 'var(--border-card)' } : {};

  const Icon = isPositive ? TrendingUp : isNeutral ? Minus : TrendingDown;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold ${cls}`} style={neutralStyle}>
      <Icon className="w-3 h-3" />
      {Math.abs(change)}%
    </span>
  );
}

// ─── SummaryCard ─────────────────────────────────────────────────────────────
export default function SummaryCard({ title, value, change, icon: Icon, color = 'blue', delay = 0 }) {
  const theme = THEMES[color] ?? THEMES.blue;
  const cardRef = useRef(null);

  // ── Subtle 3-D tilt on hover ──
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [ 4, -4]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4,  4]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width  - 0.5);
    y.set((e.clientY - rect.top)  / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      transition={{
        duration: 0.5,
        delay: delay * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 800,
        background: 'var(--bg-card)',
        border: '1px solid var(--border-card)',
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}
      /* Hover lift via Tailwind group + CSS, glow via inline style on hover  */
      className="group relative rounded-2xl p-5 flex flex-col gap-0 overflow-hidden cursor-default
        backdrop-blur-md
        transition-[border-color,box-shadow,transform] duration-300 ease-out
        hover:-translate-y-1
      "

      whileHover={{
        boxShadow: `0 0 0 1px ${theme.border}, 0 12px 40px -8px ${theme.glow}, 0 4px 16px rgba(0,0,0,0.3)`,
      }}
    >
      {/* ── Ambient glow blob (top-right) ── */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none"
        style={{ background: theme.glow }}
      />

      {/* ── Top row: icon + badge ── */}
      <div className="flex items-start justify-between mb-4">
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: -4 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className={`
            relative p-2.5 rounded-xl flex-shrink-0
            ${theme.icon}
          `}
        >
          {/* Icon inner glow ring */}
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ boxShadow: `0 0 0 1px ${theme.ring} inset` }}
          />
          <Icon className="w-[18px] h-[18px] relative z-10" />
        </motion.div>

        {/* Change badge */}
        <ChangeBadge change={change} />
      </div>

      {/* ── Label ── */}
      <p className="text-[12px] font-semibold uppercase tracking-[0.07em] mb-1.5" style={{ color: 'var(--text-muted)' }}>
        {title}
      </p>

      {/* ── Main value ── */}
      <motion.p
        className="text-[26px] font-extrabold tracking-tight leading-none"
        style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay * 0.08 + 0.18, duration: 0.4, ease: 'easeOut' }}
      >
        {value}
      </motion.p>

      {/* ── vs last month label ── */}
      <p className="text-[11px] mt-1 font-medium" style={{ color: 'var(--text-dim)' }}>
        {change > 0 ? '▲' : change < 0 ? '▼' : '—'}&nbsp;
        <span className={change > 0 ? 'text-emerald-500' : change < 0 ? 'text-red-500' : ''}
          style={change === 0 ? { color: 'var(--text-muted)' } : {}}
        >
          {Math.abs(change)}%
        </span>
        {' '}vs last month
      </p>

      {/* ── Sparkline ── */}
      <div className="mt-4 -mx-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
        <MiniSparkline color={color} fill={theme.sparkFill} />
      </div>

      {/* ── Bottom gradient bar ── */}
      <motion.div
        className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${theme.bar}`}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: delay * 0.08 + 0.4, duration: 0.6, ease: 'easeOut' }}
        style={{ originX: 0 }}
      />
    </motion.div>
  );
}
