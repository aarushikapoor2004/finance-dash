import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Target, TrendingUp, TrendingDown, Wallet,
  ArrowRight, Lightbulb, Sparkles, ShieldCheck,
  AlertTriangle, BarChart3, ArrowUpRight, ArrowDownRight,
  Zap, CircleDollarSign, PiggyBank
} from 'lucide-react';
import { useRef } from 'react';
import useStore from '../store/store';
import { monthlyTrend, revenueData, expenseBreakdown } from '../data/mockData';

/* ═══════════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════════════════════════════════════════ */
const CARD_THEMES = {
  accent: {
    icon: 'bg-violet-500/[0.12] text-violet-400',
    glow: 'rgba(139,92,246,0.18)',
    border: 'rgba(139,92,246,0.25)',
    ring: 'rgba(139,92,246,0.12)',
    sparkFill: '#8b5cf6',
    gradient: 'from-violet-500/20 via-purple-500/10 to-transparent',
    barGradient: 'from-violet-500 to-purple-600',
    badgeBg: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
  },
  danger: {
    icon: 'bg-red-500/[0.12] text-red-400',
    glow: 'rgba(239,68,68,0.15)',
    border: 'rgba(239,68,68,0.22)',
    ring: 'rgba(239,68,68,0.10)',
    sparkFill: '#ef4444',
    gradient: 'from-red-500/20 via-rose-500/10 to-transparent',
    barGradient: 'from-red-400 to-rose-500',
    badgeBg: 'bg-red-500/10 text-red-300 border-red-500/20',
  },
  success: {
    icon: 'bg-emerald-500/[0.12] text-emerald-400',
    glow: 'rgba(52,211,153,0.15)',
    border: 'rgba(52,211,153,0.22)',
    ring: 'rgba(52,211,153,0.10)',
    sparkFill: '#10b981',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    barGradient: 'from-emerald-400 to-teal-500',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  },
  primary: {
    icon: 'bg-indigo-500/[0.12] text-indigo-400',
    glow: 'rgba(99,102,241,0.18)',
    border: 'rgba(99,102,241,0.25)',
    ring: 'rgba(99,102,241,0.12)',
    sparkFill: '#6366f1',
    gradient: 'from-indigo-500/20 via-blue-500/10 to-transparent',
    barGradient: 'from-indigo-500 to-violet-500',
    badgeBg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
  },
};

const SMART_TYPE_CONFIG = {
  success: {
    icon: ShieldCheck,
    gradient: 'from-emerald-500/20 via-teal-500/5 to-transparent',
    border: 'border-emerald-500/20',
    iconBg: 'bg-emerald-500/15 text-emerald-400',
    glow: 'rgba(52,211,153,0.12)',
    label: 'Positive Trend',
    labelColor: 'text-emerald-400',
  },
  warning: {
    icon: AlertTriangle,
    gradient: 'from-amber-500/20 via-orange-500/5 to-transparent',
    border: 'border-amber-500/20',
    iconBg: 'bg-amber-500/15 text-amber-400',
    glow: 'rgba(245,158,11,0.12)',
    label: 'Needs Attention',
    labelColor: 'text-amber-400',
  },
  neutral: {
    icon: Zap,
    gradient: 'from-indigo-500/20 via-violet-500/5 to-transparent',
    border: 'border-indigo-500/20',
    iconBg: 'bg-indigo-500/15 text-indigo-400',
    glow: 'rgba(99,102,241,0.12)',
    label: 'Steady Progress',
    labelColor: 'text-indigo-400',
  },
};

/* ═══════════════════════════════════════════════════════════════════════════════
   DECORATIVE SPARKLINE
   ═══════════════════════════════════════════════════════════════════════════════ */
const SPARK_DATA = {
  accent:  [45, 60, 55, 70, 65, 78, 72, 82, 78, 88, 85, 100],
  danger:  [80, 90, 75, 85, 70, 78, 68, 74, 62, 70, 58, 60],
  success: [60, 50, 70, 65, 80, 72, 85, 78, 88, 82, 95, 100],
  primary: [40, 55, 45, 65, 58, 70, 80, 75, 90, 85, 92, 100],
};

function MiniSparkline({ color, fill }) {
  const points = SPARK_DATA[color] || SPARK_DATA.primary;
  const max = Math.max(...points);
  const h = 34;
  const w = 100;
  const step = w / (points.length - 1);

  const d = points
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${h - (v / max) * h}`)
    .join(' ');
  const area = `${d} L ${(points.length - 1) * step} ${h} L 0 ${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-9 overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`insight-spark-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity={0.3} />
          <stop offset="100%" stopColor={fill} stopOpacity={0} />
        </linearGradient>
      </defs>
      <motion.path d={area} fill={`url(#insight-spark-${color})`}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }} />
      <motion.path d={d} fill="none" stroke={fill} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.9, ease: 'easeOut' }} />
      <motion.circle cx={(points.length - 1) * step} cy={h - (points[points.length - 1] / max) * h}
        r="2.5" fill={fill}
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.25, type: 'spring' }} />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   METRIC CARD (with 3D tilt hover)
   ═══════════════════════════════════════════════════════════════════════════════ */
function InsightMetricCard({ title, value, subtitle, badge, icon: Icon, colorKey = 'primary', delay = 0 }) {
  const theme = CARD_THEMES[colorKey] ?? CARD_THEMES.primary;
  const cardRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: delay * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
      className="group relative rounded-2xl p-5 flex flex-col overflow-hidden cursor-default
        backdrop-blur-md
        transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-1"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
      whileHover={{
        boxShadow: `0 0 0 1px ${theme.border}, 0 12px 40px -8px ${theme.glow}, 0 4px 16px rgba(0,0,0,0.3)`,
      }}
    >
      {/* Ambient glow blob */}
      <div
        className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none"
        style={{ background: theme.glow }}
      />

      {/* Corner gradient */}
      <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${theme.gradient} opacity-60 blur-xl pointer-events-none`} />

      {/* Top row: icon + badge */}
      <div className="relative z-10 flex items-start justify-between mb-4">
        <motion.div
          whileHover={{ scale: 1.1, rotate: -4 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className={`relative p-2.5 rounded-xl flex-shrink-0 ${theme.icon}`}
        >
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ boxShadow: `0 0 0 1px ${theme.ring} inset` }}
          />
          <Icon className="w-[18px] h-[18px] relative z-10" />
        </motion.div>

        {badge && (
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${theme.badgeBg}`}>
            {badge}
          </span>
        )}
      </div>

      {/* Label */}
      <p className="relative z-10 text-[12px] font-semibold uppercase tracking-[0.07em] mb-1.5" style={{ color: 'var(--text-muted)' }}>
        {title}
      </p>

      {/* Main value */}
      <motion.p
        className="relative z-10 text-[26px] font-extrabold tracking-tight leading-none"
        style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay * 0.1 + 0.18, duration: 0.4, ease: 'easeOut' }}
      >
        {value}
      </motion.p>

      {/* Subtitle */}
      {subtitle && (
        <p className="relative z-10 text-[11px] mt-1.5 font-medium" style={{ color: 'var(--text-muted)' }}>
          {subtitle}
        </p>
      )}

      {/* Sparkline */}
      <div className="relative z-10 mt-4 -mx-1 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
        <MiniSparkline color={colorKey} fill={theme.sparkFill} />
      </div>

      {/* Bottom accent bar */}
      <motion.div
        className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${theme.barGradient}`}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: delay * 0.1 + 0.4, duration: 0.6, ease: 'easeOut' }}
        style={{ originX: 0 }}
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   CHART TOOLTIP
   ═══════════════════════════════════════════════════════════════════════════════ */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl backdrop-blur-xl px-4 py-3 shadow-2xl"
        style={{ background: 'var(--bg-tooltip)', border: '1px solid var(--border-card)' }}
      >
        <p className="text-xs font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-[11px] flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
            <span style={{ color: 'var(--text-muted)' }}>{entry.name}:</span>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {typeof entry.value === 'number' && entry.value > 100
                ? `$${entry.value.toLocaleString()}`
                : `${entry.value}%`}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN INSIGHTS COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */
export default function Insights() {
  const { getSummary, getInsights } = useStore();
  const summary = getSummary();
  const insights = getInsights();

  const highestCategory = expenseBreakdown.reduce((prev, current) =>
    (prev.value > current.value) ? prev : current
  );

  const currentMonthData = revenueData[revenueData.length - 1];
  const previousMonthData = revenueData[revenueData.length - 2];

  const expenseChange = ((currentMonthData.expenses - previousMonthData.expenses) / previousMonthData.expenses) * 100;
  const isExpenseUp = expenseChange > 0;

  const smartConfig = SMART_TYPE_CONFIG[insights.smartType] || SMART_TYPE_CONFIG.neutral;
  const SmartIcon = smartConfig.icon;

  return (
    <div className="space-y-6">

      {/* ─────────────────────────── AI SMART INSIGHTS HERO ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl backdrop-blur-xl"
        style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border-card)' }}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/[0.15] via-violet-600/[0.08] to-purple-800/[0.12]" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-violet-500/[0.08] to-transparent rounded-full blur-3xl -translate-y-20 translate-x-20" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-indigo-500/[0.06] to-transparent rounded-full blur-3xl translate-y-16 -translate-x-16" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex-1 max-w-2xl">
              {/* Title badge */}
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/[0.15] border border-indigo-500/[0.2]">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <h3 className="text-[11px] font-bold text-indigo-300/80 tracking-[0.15em] uppercase">
                  AI-Powered Insight
                </h3>
              </div>

              {/* Insight text */}
              <p className="text-lg md:text-xl font-normal leading-relaxed" style={{ color: 'var(--text-primary)', opacity: 0.9 }}>
                Your{' '}
                <span className="text-violet-300 font-bold">{highestCategory.name}</span>{' '}
                spending accounts for{' '}
                <span className="text-indigo-300 font-bold">
                  {Math.round((highestCategory.value / currentMonthData.expenses) * 100)}%
                </span>{' '}
                of total expenses. Optimizing this could elevate your{' '}
                <span className="text-emerald-300 font-bold">{summary.savingsRate}%</span>{' '}
                savings rate significantly.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex-shrink-0 group/btn flex items-center gap-2 px-5 py-3 rounded-xl
                font-semibold text-sm backdrop-blur-md transition-all duration-200 shadow-lg"
              style={{
                background: 'var(--btn-surface-bg)',
                border: '1px solid var(--btn-surface-border)',
                color: 'var(--btn-surface-text)'
              }}
            >
              Review Budget
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </motion.button>
          </div>
        </div>

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
        />
      </motion.div>

      {/* ─────────────────────────── KEY METRICS (3 CARDS) ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1 — Highest Spending Category */}
        <InsightMetricCard
          title="Top Category"
          value={highestCategory.name}
          subtitle={`$${highestCategory.value.toLocaleString()} spent this month`}
          badge="Highest Expense"
          icon={Target}
          colorKey="accent"
          delay={1}
        />

        {/* Card 2 — Monthly Change */}
        <InsightMetricCard
          title="Monthly Spend"
          value={`$${currentMonthData.expenses.toLocaleString()}`}
          subtitle={`vs $${previousMonthData.expenses.toLocaleString()} last month`}
          badge={
            <span className="flex items-center gap-1">
              {isExpenseUp
                ? <ArrowUpRight className="w-3 h-3" />
                : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(expenseChange).toFixed(1)}%
            </span>
          }
          icon={isExpenseUp ? TrendingUp : TrendingDown}
          colorKey={isExpenseUp ? 'danger' : 'success'}
          delay={2}
        />

        {/* Card 3 — Savings Snapshot */}
        <InsightMetricCard
          title="Total Saved"
          value={`$${Math.round(summary.balance).toLocaleString()}`}
          subtitle={
            <span className="flex items-center gap-1.5 text-emerald-400">
              <PiggyBank className="w-3 h-3" /> On track for goals
            </span>
          }
          badge={`${summary.savingsRate}% rate`}
          icon={Wallet}
          colorKey="primary"
          delay={3}
        />
      </div>

      {/* ─────────────────────────── SMART INSIGHT MESSAGE ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`relative overflow-hidden rounded-2xl border ${smartConfig.border} backdrop-blur-xl p-5`}
        style={{ background: 'var(--bg-card)' }}
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-r ${smartConfig.gradient}`} />

        <div className="relative z-10 flex items-start gap-4">
          {/* Icon */}
          <div className={`flex-shrink-0 p-3 rounded-xl ${smartConfig.iconBg}`}>
            <SmartIcon className="w-5 h-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h4 className="text-sm font-bold" style={{ color: 'var(--text-heading)' }}>Smart Analysis</h4>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${smartConfig.labelColor}`}>
                • {smartConfig.label}
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {insights.smartMessage}
            </p>
          </div>

          {/* Decorative stat pills */}
          <div className="hidden lg:flex flex-shrink-0 items-center gap-2">
            <div className="flex flex-col items-center px-4 py-2 rounded-xl" style={{ background: 'var(--btn-surface-bg)', border: '1px solid var(--border-card)' }}>
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Expenses</span>
              <span className="text-sm font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
                {insights.expenseChange > 0 ? '+' : ''}{insights.expenseChange}%
              </span>
            </div>
            <div className="flex flex-col items-center px-4 py-2 rounded-xl" style={{ background: 'var(--btn-surface-bg)', border: '1px solid var(--border-card)' }}>
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Income</span>
              <span className="text-sm font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
                {insights.incomeChange > 0 ? '+' : ''}{insights.incomeChange}%
              </span>
            </div>
            <div className="flex flex-col items-center px-4 py-2 rounded-xl" style={{ background: 'var(--btn-surface-bg)', border: '1px solid var(--border-card)' }}>
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Txns</span>
              <span className="text-sm font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>{insights.transactionCount}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─────────────────────────── CHARTS ROW ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* Income vs Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl backdrop-blur-md p-6"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
        >
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-bl from-indigo-500/[0.06] to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/[0.1] text-indigo-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-heading)' }}>Income vs Expenses</h3>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>6-month comparison</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Income
              </span>
              <span className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                <span className="w-2 h-2 rounded-full bg-violet-400" /> Expenses
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueData.slice(-6)}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 11 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} dx={-10} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.04)' }} />
              <Bar dataKey="income" name="Income" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={28} />
              <Bar dataKey="expenses" name="Expenses" fill="#a78bfa" radius={[6, 6, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Savings Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl backdrop-blur-md p-6"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
        >
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-gradient-to-br from-emerald-500/[0.06] to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/[0.1] text-emerald-400">
                <CircleDollarSign className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-heading)' }}>Savings Trend</h3>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Monthly growth</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Savings
            </span>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="insightSavingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 11 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} dx={-10} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="savings"
                name="Savings"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#insightSavingsGrad)"
                activeDot={{ r: 5, fill: '#10b981', stroke: '#0f172a', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
