import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ArrowDownLeft, ArrowUpRight, DollarSign, Tag,
  Calendar, FileText, Sparkles, AlertCircle, Check,
  Briefcase, TrendingUp, ShoppingCart, Utensils, Car,
  Home, Zap, Film, HeartPulse, BookOpen, Plane,
  Shield, Bell, CircleDot,
} from 'lucide-react';
import useStore from '../store/store';
import { categories } from '../data/mockData';

/* ═══════════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════════════════════════════════════════ */
const TYPE_THEMES = {
  income: {
    accent: '#10b981',
    accentLight: 'rgba(16,185,129,0.12)',
    accentBorder: 'rgba(16,185,129,0.25)',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    glow: '0 2px 20px rgba(16,185,129,0.30), inset 0 1px 0 rgba(255,255,255,0.15)',
    bar: 'from-emerald-500 to-teal-400',
    ring: 'rgba(16,185,129,0.10)',
  },
  expense: {
    accent: '#6366f1',
    accentLight: 'rgba(99,102,241,0.12)',
    accentBorder: 'rgba(99,102,241,0.25)',
    gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    glow: '0 2px 20px rgba(99,102,241,0.30), inset 0 1px 0 rgba(255,255,255,0.15)',
    bar: 'from-indigo-500 to-violet-500',
    ring: 'rgba(99,102,241,0.10)',
  },
};

/* ═══════════════════════════════════════════════════════════════════════════════
   CATEGORY ICONS — rich icon per category
   ═══════════════════════════════════════════════════════════════════════════════ */
const CATEGORY_ICONS = {
  Salary: Briefcase, Freelance: DollarSign, Investment: TrendingUp,
  Shopping: ShoppingCart, 'Food & Dining': Utensils, Transportation: Car,
  Utilities: Zap, Entertainment: Film, Healthcare: HeartPulse,
  Education: BookOpen, Rent: Home, Insurance: Shield,
  Subscriptions: Bell, Travel: Plane, Other: CircleDot,
};

/* ═══════════════════════════════════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════════════════════════════════ */
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 32, filter: 'blur(8px)' },
  visible: {
    opacity: 1, scale: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0, scale: 0.94, y: 24, filter: 'blur(6px)',
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.12 + i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ═══════════════════════════════════════════════════════════════════════════════
   FIELD WRAPPER — label with icon
   ═══════════════════════════════════════════════════════════════════════════════ */
function Field({ label, icon: Icon, error, index, children }) {
  return (
    <motion.div custom={index} variants={fieldVariants} initial="hidden" animate="visible" className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-surface-500">
        <Icon className="w-3 h-3" />
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1 text-[11px] text-red-400 font-medium ml-0.5"
          >
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   INPUT STYLES
   ═══════════════════════════════════════════════════════════════════════════════ */
const inputBase = `
  w-full px-3.5 py-2.5 rounded-xl text-[13px] text-white outline-none
  border bg-white/[0.03]
  placeholder:text-surface-600
  focus:bg-white/[0.06]
  transition-all duration-200
`;

const inputNormal = `${inputBase} border-white/[0.07] focus:border-indigo-500/50 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.10)]`;
const inputError = `${inputBase} border-red-500/50 shadow-[0_0_0_3px_rgba(239,68,68,0.08)] focus:border-red-500/60 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]`;

/* ═══════════════════════════════════════════════════════════════════════════════
   TYPE TOGGLE BUTTON
   ═══════════════════════════════════════════════════════════════════════════════ */
function TypeButton({ id, label, Icon, isActive, theme, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative flex-1 flex items-center justify-center gap-2
        py-2.5 rounded-xl text-[13px] font-semibold
        transition-all duration-250 overflow-hidden
        ${isActive ? 'text-white' : 'text-surface-500 hover:text-surface-300'}
      `}
    >
      {isActive && (
        <motion.div
          layoutId="type-active-bg"
          className="absolute inset-0 rounded-xl"
          style={{
            background: theme.accentLight,
            border: `1px solid ${theme.accentBorder}`,
            boxShadow: `0 0 24px ${theme.ring}`,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <Icon className="w-4 h-4 relative z-10" />
      <span className="relative z-10">{label}</span>
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative z-10 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: theme.accent }}
        >
          <Check className="w-2.5 h-2.5 text-white" />
        </motion.div>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   CATEGORY PICKER — visual grid
   ═══════════════════════════════════════════════════════════════════════════════ */
function CategoryPicker({ value, onChange, accentColor }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const CatIcon = CATEGORY_ICONS[value] ?? CircleDot;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
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

/* ═══════════════════════════════════════════════════════════════════════════════
   AMOUNT INPUT — with live formatting preview
   ═══════════════════════════════════════════════════════════════════════════════ */
function AmountInput({ value, onChange, error, type }) {
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

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT — TransactionForm modal
   ═══════════════════════════════════════════════════════════════════════════════ */
export default function TransactionForm() {
  const {
    showTransactionForm, editingTransaction,
    closeTransactionForm, addTransaction, updateTransaction,
  } = useStore();

  const isEditing = !!editingTransaction;
  const descRef = useRef(null);

  const blank = {
    description: '',
    amount: '',
    category: 'Salary',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
  };

  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Reset form on open/close
  useEffect(() => {
    if (showTransactionForm) {
      if (editingTransaction) {
        setForm({
          description: editingTransaction.description,
          amount: Math.abs(editingTransaction.amount).toString(),
          category: editingTransaction.category,
          type: editingTransaction.type,
          date: editingTransaction.date,
        });
      } else {
        setForm(blank);
      }
      setErrors({});
      setSubmitting(false);

      // Auto-focus description after animation
      setTimeout(() => descRef.current?.focus(), 400);
    }
  }, [editingTransaction, showTransactionForm]);

  // ESC to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && showTransactionForm) closeTransactionForm(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showTransactionForm, closeTransactionForm]);

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
  };

  // ── Validation ──
  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = 'Description is required';
    else if (form.description.trim().length < 2) e.description = 'At least 2 characters';

    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Enter a valid positive amount';
    else if (Number(form.amount) > 999999999) e.amount = 'Amount is too large';

    if (!form.date) e.date = 'Date is required';

    return e;
  };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    // Tiny delay for button animation feedback
    await new Promise((r) => setTimeout(r, 300));

    const amount = parseFloat(form.amount);
    const payload = {
      description: form.description.trim(),
      amount: form.type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
      category: form.category,
      type: form.type,
      date: form.date,
    };

    if (isEditing) {
      updateTransaction(editingTransaction.id, payload);
    } else {
      addTransaction(payload);
    }

    closeTransactionForm();
  };

  const theme = TYPE_THEMES[form.type];

  return (
    <AnimatePresence>
      {showTransactionForm && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25 }}
            onClick={closeTransactionForm}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(12px)' }}
          />

          {/* ── Modal ── */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[440px] rounded-3xl overflow-hidden"
              style={{
                background: 'rgba(9,14,26,0.97)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: `
                  0 40px 100px rgba(0,0,0,0.65),
                  0 0 0 1px rgba(255,255,255,0.04) inset,
                  0 -1px 0 rgba(255,255,255,0.03) inset,
                  0 0 80px ${theme.ring}
                `,
              }}
            >
              {/* ── Top accent bar — animated color ── */}
              <motion.div
                className="h-[3px] w-full"
                animate={{
                  background: form.type === 'income'
                    ? 'linear-gradient(90deg, #10b981, #34d399, #06b6d4)'
                    : 'linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)',
                }}
                transition={{ duration: 0.5 }}
              />

              <div className="p-6">
                {/* ── Header ── */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.3 }}
                  className="flex items-start justify-between mb-6"
                >
                  <div className="flex items-center gap-3">
                    {/* Header icon with glow */}
                    <div className="relative">
                      <motion.div
                        className="absolute inset-0 rounded-xl blur-lg"
                        animate={{ background: theme.accentLight, opacity: 0.6 }}
                        transition={{ duration: 0.4 }}
                      />
                      <motion.div
                        className="relative w-10 h-10 rounded-xl flex items-center justify-center"
                        animate={{
                          background: theme.accentLight,
                          boxShadow: `inset 0 0 0 1px ${theme.accentBorder}`,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Sparkles className="w-[18px] h-[18px]" style={{ color: theme.accent }} />
                      </motion.div>
                    </div>

                    <div>
                      <h3 className="text-[16px] font-bold text-white tracking-tight">
                        {isEditing ? 'Edit Transaction' : 'New Transaction'}
                      </h3>
                      <p className="text-[11px] text-surface-500 mt-0.5">
                        {isEditing ? 'Update the details below' : 'Add a new income or expense record'}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90, background: 'rgba(255,255,255,0.08)' }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    onClick={closeTransactionForm}
                    className="p-2 rounded-xl bg-white/[0.04] text-surface-400 hover:text-white border border-white/[0.05] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* ── Type Toggle ── */}
                  <motion.div
                    custom={0}
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex rounded-2xl p-1.5 gap-1 border border-white/[0.06]"
                    style={{ background: 'rgba(255,255,255,0.025)' }}
                  >
                    <TypeButton
                      id="income"
                      label="Income"
                      Icon={ArrowDownLeft}
                      isActive={form.type === 'income'}
                      theme={TYPE_THEMES.income}
                      onClick={() => set('type', 'income')}
                    />
                    <TypeButton
                      id="expense"
                      label="Expense"
                      Icon={ArrowUpRight}
                      isActive={form.type === 'expense'}
                      theme={TYPE_THEMES.expense}
                      onClick={() => set('type', 'expense')}
                    />
                  </motion.div>

                  {/* ── Description ── */}
                  <Field label="Description" icon={FileText} error={errors.description} index={1}>
                    <input
                      ref={descRef}
                      type="text"
                      value={form.description}
                      onChange={(e) => set('description', e.target.value)}
                      placeholder="e.g. Monthly salary, Grocery run…"
                      maxLength={100}
                      className={errors.description ? inputError : inputNormal}
                    />
                  </Field>

                  {/* ── Amount ── */}
                  <Field label="Amount" icon={DollarSign} error={errors.amount} index={2}>
                    <AmountInput
                      value={form.amount}
                      onChange={(v) => set('amount', v)}
                      error={errors.amount}
                      type={form.type}
                    />
                  </Field>

                  {/* ── Category + Date row ── */}
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Category" icon={Tag} error={null} index={3}>
                      <CategoryPicker
                        value={form.category}
                        onChange={(v) => set('category', v)}
                        accentColor={theme.accent}
                      />
                    </Field>

                    <Field label="Date" icon={Calendar} error={errors.date} index={4}>
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) => set('date', e.target.value)}
                        className={errors.date ? inputError : inputNormal}
                      />
                    </Field>
                  </div>

                  {/* ── Divider ── */}
                  <motion.div
                    custom={5}
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                    className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
                  />

                  {/* ── Actions ── */}
                  <motion.div custom={6} variants={fieldVariants} initial="hidden" animate="visible" className="flex gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={closeTransactionForm}
                      className="
                        flex-1 py-2.5 rounded-xl text-[13px] font-semibold
                        text-surface-400 hover:text-surface-200
                        border border-white/[0.07] hover:border-white/[0.14]
                        bg-white/[0.03] hover:bg-white/[0.06]
                        active:scale-[0.98]
                        transition-all duration-200
                      "
                    >
                      Cancel
                    </button>

                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={!submitting ? { scale: 1.02, boxShadow: theme.glow } : {}}
                      whileTap={!submitting ? { scale: 0.98 } : {}}
                      className={`
                        relative flex-1 flex items-center justify-center gap-2
                        py-2.5 rounded-xl text-[13px] font-semibold text-white
                        overflow-hidden
                        transition-all duration-200
                        ${submitting ? 'opacity-80 cursor-not-allowed' : ''}
                      `}
                      style={{
                        background: theme.gradient,
                        boxShadow: theme.glow,
                      }}
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 opacity-30"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                        }}
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
                      />

                      <AnimatePresence mode="wait">
                        {submitting ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full relative z-10"
                            style={{ animation: 'spin 0.6s linear infinite' }}
                          />
                        ) : (
                          <motion.span
                            key="label"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="relative z-10"
                          >
                            {isEditing
                              ? 'Save Changes'
                              : `Add ${form.type === 'income' ? 'Income' : 'Expense'}`
                            }
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </motion.div>

                  {/* ── ESC hint ── */}
                  <motion.p
                    custom={7}
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center text-[10px] text-surface-600 pt-1"
                  >
                    Press <kbd className="px-1.5 py-0.5 rounded-md bg-white/[0.05] text-surface-500 font-semibold border border-white/[0.06] text-[10px]">ESC</kbd> to close
                  </motion.p>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
