import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CircleDot } from 'lucide-react';
import { CATEGORY_ICONS } from '../shared/CategoryMeta';
import { categories } from '../../data/mockData';

export default function CategoryPicker({ value, onChange, accentColor }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const CatIcon = CATEGORY_ICONS[value] ?? CircleDot;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`
          w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] text-white
          border border-white/[0.07] bg-white/[0.03]
          hover:border-white/[0.12] hover:bg-white/[0.05]
          focus:border-indigo-500/50 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.10)]
          transition-all duration-200 text-left
        `}
      >
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${accentColor}18` }}
        >
          <CatIcon className="w-3.5 h-3.5" style={{ color: accentColor }} />
        </div>
        <span className="flex-1 truncate">{value}</span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-3 h-3 text-surface-500 flex-shrink-0"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 4.5L6 7.5L9 4.5" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl
              border border-white/[0.07] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]
              max-h-[240px] overflow-y-auto scrollbar-none"
            style={{ background: 'rgba(9,14,26,0.97)', backdropFilter: 'blur(40px)' }}
          >
            {categories.map((cat) => {
              const CI = CATEGORY_ICONS[cat] ?? CircleDot;
              const isSelected = value === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { onChange(cat); setOpen(false); }}
                  className={`
                    w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px]
                    border-b border-white/[0.03] last:border-0
                    transition-all duration-150
                    ${isSelected
                      ? 'bg-indigo-500/[0.10] text-white font-semibold'
                      : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04]'
                    }
                  `}
                >
                  <CI className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-indigo-400' : 'text-surface-500'}`} />
                  <span className="flex-1 text-left">{cat}</span>
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check className="w-3.5 h-3.5 text-indigo-400" />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
