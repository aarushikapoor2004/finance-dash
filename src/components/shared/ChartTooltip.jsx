export default function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3.5 py-3 min-w-[140px] shadow-2xl z-50"
      style={{
        background: 'rgba(9,14,26,0.95)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(24px)',
      }}
    >
      {label && (
        <p className="text-[11px] font-semibold text-surface-400 mb-2 uppercase tracking-widest">
          {label}
        </p>
      )}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center justify-between gap-4 mt-1 first:mt-0">
          <span className="flex items-center gap-1.5 text-[12px] text-surface-400">
            <span
              className="inline-block w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color ?? entry.fill }}
            />
            {entry.name}
          </span>
          <span className="text-[12px] font-bold text-white">
            {formatter
              ? formatter(entry.value, entry.name)
              : `$${Number(entry.value).toLocaleString()}`}
          </span>
        </div>
      ))}
    </div>
  );
}
