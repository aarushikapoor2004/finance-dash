import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, ArrowUpDown, ArrowDownUp, ChevronsUp,
  X, Pencil, Trash2, ArrowDownLeft, ArrowUpRight,
  ShoppingCart, Utensils, Car, Home, Zap, Film,
  HeartPulse, BookOpen, Plane, Shield, Bell, Briefcase,
  TrendingUp, DollarSign, CircleDot, Lock,
} from 'lucide-react';
import useStore from '../store/store';

// ─── Category icon + color map ────────────────────────────────────────────────
const CATEGORY_META = {
  Salary:          { icon: Briefcase, bg: 'bg-indigo-500/15',  text: 'text-indigo-400'  },
  Freelance:       { icon: DollarSign, bg: 'bg-violet-500/15', text: 'text-violet-400'  },
  Investment:      { icon: TrendingUp, bg: 'bg-emerald-500/15',text: 'text-emerald-400' },
  Shopping:        { icon: ShoppingCart, bg: 'bg-pink-500/15', text: 'text-pink-400'    },
  'Food & Dining': { icon: Utensils,   bg: 'bg-amber-500/15',  text: 'text-amber-400'   },
  Transportation:  { icon: Car,        bg: 'bg-sky-500/15',    text: 'text-sky-400'     },
  Utilities:       { icon: Zap,        bg: 'bg-yellow-500/15', text: 'text-yellow-400'  },
  Entertainment:   { icon: Film,       bg: 'bg-purple-500/15', text: 'text-purple-400'  },
  Healthcare:      { icon: HeartPulse, bg: 'bg-red-500/15',    text: 'text-red-400'     },
  Education:       { icon: BookOpen,   bg: 'bg-cyan-500/15',   text: 'text-cyan-400'    },
  Rent:            { icon: Home,       bg: 'bg-orange-500/15', text: 'text-orange-400'  },
  Insurance:       { icon: Shield,     bg: 'bg-teal-500/15',   text: 'text-teal-400'    },
  Subscriptions:   { icon: Bell,       bg: 'bg-rose-500/15',   text: 'text-rose-400'    },
  Travel:          { icon: Plane,      bg: 'bg-blue-500/15',   text: 'text-blue-400'    },
  Other:           { icon: CircleDot,  bg: 'bg-slate-500/15',  text: 'text-slate-400'   },
};

const getCategoryMeta = (cat) => CATEGORY_META[cat] ?? CATEGORY_META.Other;

// ─── Sort options ────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { id: 'date_desc',   label: 'Newest first',  icon: ArrowDownUp  },
  { id: 'date_asc',    label: 'Oldest first',  icon: ArrowUpDown  },
  { id: 'amount_desc', label: 'Highest amount',icon: ChevronsUp   },
  { id: 'amount_asc',  label: 'Lowest amount', icon: ArrowDownUp  },
];

// ─── Filter tab data ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'all',     label: 'All'     },
  { id: 'income',  label: 'Income'  },
  { id: 'expense', label: 'Expense' },
];

// ─── Format helpers ───────────────────────────────────────────────────────────
const fmtCurrency = (amount) => {
  const abs = Math.abs(amount);
  return `$${abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
const fmtDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// ─── TransactionItem ──────────────────────────────────────────────────────────
function TransactionItem({ t, isAdmin, onEdit, onDelete, index }) {
  const meta = getCategoryMeta(t.category);
  const CategoryIcon = meta.icon;
  const isIncome = t.type === 'income';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.97 }}
      whileHover={{ y: -2, boxShadow: '0 8px 24px -8px rgba(0,0,0,0.15)' }}
      transition={{ duration: 0.3, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex items-center gap-4 px-4 py-3.5 rounded-xl
        transition-all duration-200"
      style={{ background: 'var(--hover-overlay)', border: '1px solid var(--border-subtle)' }}
    >
      {/* Category icon */}
      <div className={`
        w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
        ${meta.bg} transition-transform duration-200 group-hover:scale-105
      `}>
        <CategoryIcon className={`w-[18px] h-[18px] ${meta.text}`} />
      </div>

      {/* Description + category + date */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold truncate leading-tight" style={{ color: 'var(--text-primary)' }}>
          {t.description}
        </p>
        <div className="flex items-center mt-1.5 gap-2">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${meta.bg.replace('/15','/10')} border border-current/[0.15]`} style={{ color: `var(--color-${meta.text.split('-')[1]}-400)` }} >
            <span className={meta.text}>{t.category}</span>
          </span>
          <span className="w-1 h-1 rounded-full" style={{ background: 'var(--border-subtle)' }} />
          <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>{fmtDate(t.date)}</span>
        </div>
      </div>

      {/* Type badge */}
      <div className={`
        hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold flex-shrink-0
        ${isIncome
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
          : 'bg-red-500/10 text-red-400 border border-red-500/15'}
      `}>
        {isIncome
          ? <ArrowDownLeft className="w-2.5 h-2.5" />
          : <ArrowUpRight  className="w-2.5 h-2.5" />}
        {isIncome ? 'Income' : 'Expense'}
      </div>

      {/* Amount */}
      <p className={`
        text-[15px] font-extrabold flex-shrink-0 min-w-[80px] text-right
        ${isIncome ? 'text-emerald-400' : ''}
      `} style={{ letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', color: isIncome ? undefined : 'var(--text-primary)' }}>
        {isIncome ? '+' : '−'}{fmtCurrency(t.amount)}
      </p>

      {/* Actions — visible on hover, guarded by role */}
      <div className="
        flex items-center gap-1 opacity-0 group-hover:opacity-100
        transition-opacity duration-150 flex-shrink-0
      ">
        {isAdmin ? (
          <>
            <motion.button
              whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(t)}
              className="p-1.5 rounded-lg hover:bg-indigo-500/15 transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <Pencil className="w-3.5 h-3.5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(t.id)}
              className="p-1.5 rounded-lg hover:bg-red-500/15 transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </motion.button>
          </>
        ) : (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold"
            style={{ color: 'var(--text-dim)' }}
            title="Switch to Admin to edit"
          >
            <Lock className="w-2.5 h-2.5" />
            Read only
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Date group header ────────────────────────────────────────────────────────
function DateGroup({ label, total, isIncome }) {
  return (
    <div className="flex items-center justify-between px-1 mb-2 mt-5 first:mt-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-dim)' }}>{label}</p>
      <p className={`text-[11px] font-semibold ${isIncome ? 'text-emerald-500' : ''}`} style={!isIncome ? { color: 'var(--text-muted)' } : {}}>
        {total > 0 ? '+' : ''}${Math.abs(total).toLocaleString('en-US', { minimumFractionDigits: 0 })}
      </p>
    </div>
  );
}

// ─── Main Transactions page ───────────────────────────────────────────────────
export default function Transactions() {
  const { transactions, role, deleteTransaction, openTransactionForm, isAdmin, addToast } = useStore();
  const admin = isAdmin();

  const [search,  setSearch]  = useState('');
  const [tab,     setTab]     = useState('all');
  const [sortId,  setSortId]  = useState('date_desc');
  const [showSort, setShowSort] = useState(false);

  // ── Filter + sort ──
  const filtered = useMemo(() => {
    let list = transactions.filter((t) => {
      const q     = search.toLowerCase();
      const matchQ = t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
      const matchT = tab === 'all' || t.type === tab;
      return matchQ && matchT;
    });

    switch (sortId) {
      case 'date_asc':    list = [...list].sort((a, b) => new Date(a.date) - new Date(b.date));  break;
      case 'date_desc':   list = [...list].sort((a, b) => new Date(b.date) - new Date(a.date));  break;
      case 'amount_desc': list = [...list].sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount)); break;
      case 'amount_asc':  list = [...list].sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount)); break;
    }
    return list;
  }, [transactions, search, tab, sortId]);

  // ── Stats ──
  const stats = useMemo(() => {
    const income   = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);
    return { income, expenses, net: income - expenses };
  }, [filtered]);

  // ── Group by date label ──
  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach((t) => {
      const d    = new Date(t.date);
      const now  = new Date();
      const diff = Math.floor((now - d) / 86400000);
      const label = diff === 0 ? 'Today'
                  : diff === 1 ? 'Yesterday'
                  : d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      if (!map.has(label)) map.set(label, []);
      map.get(label).push(t);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const sortLabel = SORT_OPTIONS.find(s => s.id === sortId)?.label ?? 'Sort';
  const SortIcon  = SORT_OPTIONS.find(s => s.id === sortId)?.icon ?? ArrowDownUp;

  return (
    <div className="space-y-4 max-w-4xl mx-auto">

      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h2 className="text-[18px] font-bold tracking-tight" style={{ color: 'var(--text-heading)' }}>Transactions</h2>
          <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: admin ? 1.03 : 1 }}
          whileTap={{ scale: admin ? 0.97 : 1 }}
          onClick={() => {
            if (admin) {
              openTransactionForm();
            } else {
              addToast('\ud83d\udd12 Switch to Admin mode to add transactions', 'error');
            }
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white
            ${!admin ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{
            background: admin
              ? 'linear-gradient(135deg,#6366f1,#4f46e5)'
              : 'linear-gradient(135deg,#334155,#1e293b)',
            boxShadow: admin
              ? '0 2px 14px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.12)'
              : 'none',
          }}
        >
          {admin ? <Plus className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
          {admin ? 'Add Transaction' : 'View Only'}
        </motion.button>
      </motion.div>

      {/* ── Stats bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        {[
          { label: 'Income',   val: stats.income,   color: 'text-emerald-400', sub: 'bg-emerald-500/10 border-emerald-500/15' },
          { label: 'Expenses', val: stats.expenses,  color: 'text-red-400',     sub: 'bg-red-500/10 border-red-500/15'         },
          { label: 'Net',      val: stats.net,       color: stats.net >= 0 ? 'text-indigo-400' : 'text-red-400',
            sub: stats.net >= 0 ? 'bg-indigo-500/10 border-indigo-500/15' : 'bg-red-500/10 border-red-500/15' },
        ].map(({ label, val, color, sub }) => (
          <div key={label} className={`rounded-xl px-4 py-3 border ${sub}`}>
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
            <p className={`text-[16px] font-extrabold ${color}`} style={{ letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
              {val < 0 ? '−' : val > 0 && label === 'Net' ? '+' : ''}${Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
          </div>
        ))}
      </motion.div>

      {/* ── Controls row: search + tabs + sort ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-2.5"
      >
        {/* Search */}
        <div className="
          flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl
          focus-within:border-indigo-500/40 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.10)]
          transition-all duration-200
        " style={{ background: 'var(--btn-surface-bg)', border: '1px solid var(--border-card)' }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or category…"
            className="bg-transparent text-[13px] outline-none w-full"
            style={{ color: 'var(--input-text)' }}
          />
          <AnimatePresence>
            {search && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                onClick={() => setSearch('')}
                className="p-0.5 rounded-md transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center rounded-xl p-1 gap-0.5"
          style={{ background: 'var(--btn-surface-bg)', border: '1px solid var(--border-subtle)' }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`
                relative px-3.5 py-1.5 rounded-lg text-[12px] font-semibold
                transition-colors duration-150
                ${tab === t.id ? '' : ''}
              `}
              style={{ color: tab === t.id ? 'var(--text-heading)' : 'var(--text-muted)' }}
            >
              {tab === t.id && (
                <motion.div
                  layoutId="tab-active"
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: 'linear-gradient(135deg,rgba(99,102,241,0.22),rgba(139,92,246,0.12))',
                    boxShadow: 'inset 0 0 0 1px rgba(99,102,241,0.25)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                />
              )}
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSort((v) => !v)}
            className="
              flex items-center gap-2 px-3.5 py-2.5 rounded-xl
              text-[12px] font-semibold
              transition-all duration-200 whitespace-nowrap
            "
            style={{ background: 'var(--btn-surface-bg)', border: '1px solid var(--border-subtle)', color: 'var(--btn-surface-text)' }}
          >
            <SortIcon className="w-3.5 h-3.5" />
            {sortLabel}
          </button>

          <AnimatePresence>
            {showSort && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1.5 w-44 rounded-xl z-30
                  overflow-hidden shadow-2xl"
                style={{ background: 'var(--bg-modal)', border: '1px solid var(--border-card)', backdropFilter: 'blur(24px)' }}
              >
                {SORT_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => { setSortId(opt.id); setShowSort(false); }}
                      className={`
                        w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-medium
                        transition-colors
                        ${sortId === opt.id
                          ? 'text-indigo-400 bg-indigo-500/[0.08]'
                          : ''}
                      `}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        color: sortId !== opt.id ? 'var(--text-muted)' : undefined,
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {opt.label}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Transaction list ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'var(--bg-card-solid)',
          border: '1px solid var(--border-card)',
          backdropFilter: 'blur(40px) saturate(1.6)',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        {filtered.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 px-6 text-center"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--btn-surface-bg)' }}>
              <Search className="w-6 h-6" style={{ color: 'var(--text-dim)' }} />
            </div>
            <p className="text-[14px] font-semibold mb-1" style={{ color: 'var(--text-heading)' }}>No transactions found</p>
            <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>Try different search terms or filters</p>
          </motion.div>
        ) : (
          <div className="p-4 space-y-1">
            <AnimatePresence mode="popLayout">
              {grouped.map(([date, items]) => {
                const groupNet = items.reduce((s, t) => s + (t.type === 'income' ? t.amount : -Math.abs(t.amount)), 0);
                return (
                  <div key={date}>
                    <DateGroup
                      label={date}
                      total={groupNet}
                      isIncome={groupNet > 0}
                    />
                    {items.map((t, i) => (
                      <TransactionItem
                        key={t.id}
                        t={t}
                        isAdmin={isAdmin}
                        index={i}
                        onEdit={openTransactionForm}
                        onDelete={deleteTransaction}
                      />
                    ))}
                  </div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
