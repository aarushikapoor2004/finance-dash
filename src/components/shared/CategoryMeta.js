import {
  Briefcase, DollarSign, TrendingUp, ShoppingCart, Utensils, Car,
  Zap, Film, HeartPulse, BookOpen, Plane, Shield, Bell, Home, CircleDot,
} from 'lucide-react';

// ─── Category → icon + styles ────────────────────────────────────────────────
export const CATEGORY_META = {
  Salary:         { icon: Briefcase,    bg: 'bg-indigo-500/15',  text: 'text-indigo-400'  },
  Freelance:      { icon: DollarSign,   bg: 'bg-violet-500/15',  text: 'text-violet-400'  },
  Investment:     { icon: TrendingUp,   bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  Shopping:       { icon: ShoppingCart,  bg: 'bg-pink-500/15',    text: 'text-pink-400'    },
  'Food & Dining':{ icon: Utensils,     bg: 'bg-amber-500/15',   text: 'text-amber-400'   },
  Transportation: { icon: Car,          bg: 'bg-sky-500/15',     text: 'text-sky-400'     },
  Utilities:      { icon: Zap,          bg: 'bg-yellow-500/15',  text: 'text-yellow-400'  },
  Entertainment:  { icon: Film,         bg: 'bg-purple-500/15',  text: 'text-purple-400'  },
  Healthcare:     { icon: HeartPulse,   bg: 'bg-red-500/15',     text: 'text-red-400'     },
  Education:      { icon: BookOpen,     bg: 'bg-cyan-500/15',    text: 'text-cyan-400'    },
  Rent:           { icon: Home,         bg: 'bg-orange-500/15',  text: 'text-orange-400'  },
  Insurance:      { icon: Shield,       bg: 'bg-teal-500/15',    text: 'text-teal-400'    },
  Subscriptions:  { icon: Bell,         bg: 'bg-rose-500/15',    text: 'text-rose-400'    },
  Travel:         { icon: Plane,        bg: 'bg-blue-500/15',    text: 'text-blue-400'    },
  Other:          { icon: CircleDot,    bg: 'bg-slate-500/15',   text: 'text-slate-400'   },
};

export const getCategoryMeta = (cat) => CATEGORY_META[cat] ?? CATEGORY_META.Other;

// ─── Category icons only (for TransactionForm) ───────────────────────────────
export const CATEGORY_ICONS = Object.fromEntries(
  Object.entries(CATEGORY_META).map(([key, val]) => [key, val.icon])
);
