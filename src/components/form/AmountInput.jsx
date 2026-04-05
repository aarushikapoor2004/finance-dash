import { motion, AnimatePresence } from 'framer-motion';
import { TYPE_THEMES } from './TypeToggle';

const inputBase = `
  w-full px-3.5 py-2.5 rounded-xl text-[13px] text-white outline-none
  border bg-white/[0.03]
  placeholder:text-surface-600
  focus:bg-white/[0.06]
  transition-all duration-200
`;

export const inputNormal = `${inputBase} border-white/[0.07] focus:border-indigo-500/50 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.10)]`;
export const inputError  = `${inputBase} border-red-500/50 shadow-[0_0_0_3px_rgba(239,68,68,0.08)] focus:border-red-500/60 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]`;

export default function AmountInput({ value, onChange, error, type }) {
  const theme = TYPE_THEMES[type];
  const numVal = parseFloat(value);
  const hasVal = !isNaN(numVal) && numVal > 0;

  return (
    <div className="relative">
      {/* Currency symbol */}
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] font-bold text-surface-500 pointer-events-none">$</span>

      <input
        type="number"
        step="0.01"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0.00"
        className={`${error ? inputError : inputNormal} pl-8 pr-24 text-[15px] font-bold tracking-tight`}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      />

      {/* Live preview badge */}
      <AnimatePresence>
        {hasVal && (
          <motion.div
            initial={{ opacity: 0, x: 8, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.9 }}
            className="absolute right-3 top-1/2 -translate-y-1/2
              flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold"
            style={{
              background: theme.accentLight,
              color: theme.accent,
              border: `1px solid ${theme.accentBorder}`,
            }}
          >
            {type === 'income' ? '+' : '−'}${numVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
