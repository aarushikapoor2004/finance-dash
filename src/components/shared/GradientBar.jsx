// ─── Generic gradient bar for bar charts ─────────────────────────────────────
export function GradientBar({ x, y, width, height, topColor = '#6366f1', bottomColor = '#4f46e5' }) {
  if (!height || height < 0) return null;
  const id = `bar-grad-${x}-${y}`;
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={topColor} stopOpacity={0.95} />
          <stop offset="100%" stopColor={bottomColor} stopOpacity={0.55} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={width} height={height} fill={`url(#${id})`} rx={6} ry={6} />
    </g>
  );
}

// ─── Income bar (indigo) ──────────────────────────────────────────────────────
export function IncomeBar(props) {
  return <GradientBar {...props} topColor="#6366f1" bottomColor="#4f46e5" />;
}

// ─── Expense bar (violet) ─────────────────────────────────────────────────────
export function ExpenseBar(props) {
  return <GradientBar {...props} topColor="#8b5cf6" bottomColor="#6d28d9" />;
}
