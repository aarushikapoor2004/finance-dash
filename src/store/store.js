import { create } from 'zustand';
import { initialTransactions } from '../data/mockData';

// ─── LocalStorage helpers ───
const loadState = (key, fallback) => {
  try {
    const stored = localStorage.getItem(`zorvyn_${key}`);
    return stored !== null ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const saveState = (key, value) => {
  try {
    localStorage.setItem(`zorvyn_${key}`, JSON.stringify(value));
  } catch {
    // silently fail
  }
};

const useStore = create((set, get) => ({
  // ─── Theme ───
  theme: loadState('theme', 'dark'),
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    set({ theme: next });
    saveState('theme', next);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', next === 'dark');
    }
  },

  // ─── Role management ───
  role: loadState('role', 'admin'),
  isAdmin: () => get().role === 'admin',
  setRole: (role) => {
    set({ role });
    saveState('role', role);
    get().addToast(
      role === 'admin'
        ? '🛡️ Admin mode — full access enabled'
        : '👁️ Viewer mode — read-only access',
      'info'
    );
  },

  // ─── Navigation ───
  activePage: 'dashboard',
  setActivePage: (page) => set({ activePage: page }),

  // ─── Sidebar ───
  sidebarOpen: loadState('sidebarOpen', true),
  mobileSidebarOpen: false,
  toggleSidebar: () => {
    const newState = !get().sidebarOpen;
    set({ sidebarOpen: newState });
    saveState('sidebarOpen', newState);
  },
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

  // ─── Global search ───
  globalSearch: '',
  setGlobalSearch: (q) => set({ globalSearch: q }),
  getSearchResults: () => {
    const q = get().globalSearch.toLowerCase().trim();
    if (!q) return [];
    return get().transactions
      .filter((t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      )
      .slice(0, 6);
  },

  // ─── Transactions ───
  transactions: loadState('transactions', initialTransactions),
  addTransaction: (transaction) =>
    set((state) => {
      const newTransactions = [
        { ...transaction, id: Math.max(0, ...state.transactions.map((t) => t.id)) + 1 },
        ...state.transactions,
      ];
      saveState('transactions', newTransactions);
      setTimeout(() => get().addToast('Transaction added successfully', 'success'), 100);
      return { transactions: newTransactions };
    }),
  deleteTransaction: (id) =>
    set((state) => {
      const newTransactions = state.transactions.filter((t) => t.id !== id);
      saveState('transactions', newTransactions);
      setTimeout(() => get().addToast('Transaction deleted', 'error'), 100);
      return { transactions: newTransactions };
    }),
  updateTransaction: (id, updates) =>
    set((state) => {
      const newTransactions = state.transactions.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      );
      saveState('transactions', newTransactions);
      setTimeout(() => get().addToast('Transaction updated', 'success'), 100);
      return { transactions: newTransactions };
    }),

  // ─── Transaction form modal ───
  showTransactionForm: false,
  editingTransaction: null,
  openTransactionForm: (transaction = null) =>
    set({ showTransactionForm: true, editingTransaction: transaction }),
  closeTransactionForm: () =>
    set({ showTransactionForm: false, editingTransaction: null }),

  // ─── Toast notifications ───
  toasts: [],
  addToast: (message, type = 'success') => {
    const id = Date.now() + Math.random();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 3500);
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  // ─── Computed: Summary ───
  getSummary: () => {
    const { transactions } = get();
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;
    return { totalIncome, totalExpenses, balance, savingsRate };
  },

  // ─── Computed: Weekly spending from real transactions ───
  getWeeklySpending: () => {
    const { transactions } = get();
    const now = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekData = dayNames.map((day) => ({ day, amount: 0 }));

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const d = new Date(t.date);
        const diff = Math.floor((now - d) / 86400000);
        if (diff >= 0 && diff < 7) {
          const dayIdx = d.getDay();
          weekData[dayIdx].amount += Math.abs(t.amount);
        }
      });

    // Rotate so Mon is first
    return [...weekData.slice(1), weekData[0]];
  },

  // ─── Computed: Spending by category ───
  getExpenseBreakdown: () => {
    const { transactions } = get();
    const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#f43f5e', '#ec4899', '#64748b'];
    const catMap = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const cat = t.category;
        catMap[cat] = (catMap[cat] || 0) + Math.abs(t.amount);
      });

    return Object.entries(catMap)
      .sort(([, a], [, b]) => b - a)
      .map(([name, value], i) => ({
        name,
        value: Math.round(value * 100) / 100,
        color: COLORS[i % COLORS.length],
      }));
  },

  // ─── Computed: Smart insights from real data ───
  getInsights: () => {
    const { transactions } = get();
    const summary = get().getSummary();
    const breakdown = get().getExpenseBreakdown();

    // Top expense category
    const topExpense = breakdown[0] || { name: 'None', value: 0 };

    // Transaction count this month
    const now = new Date();
    const thisMonth = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonth = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear();
    });

    const thisMonthExpenses = thisMonth
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + Math.abs(t.amount), 0);
    const lastMonthExpenses = lastMonth
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + Math.abs(t.amount), 0);

    const thisMonthIncome = thisMonth
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);
    const lastMonthIncome = lastMonth
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);

    const expenseChange = lastMonthExpenses > 0
      ? (((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100).toFixed(1)
      : 0;
    const incomeChange = lastMonthIncome > 0
      ? (((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100).toFixed(1)
      : 0;

    // Smart message
    let smartMessage = '';
    let smartType = 'neutral';
    if (Number(expenseChange) > 15) {
      smartMessage = `Spending is up ${Math.abs(expenseChange)}% vs last month. Consider reviewing your ${topExpense.name} expenses.`;
      smartType = 'warning';
    } else if (Number(expenseChange) < -5) {
      smartMessage = `Great job! You've reduced spending by ${Math.abs(expenseChange)}% compared to last month.`;
      smartType = 'success';
    } else if (Number(summary.savingsRate) > 30) {
      smartMessage = `Excellent savings rate at ${summary.savingsRate}%. You're on track with your financial goals.`;
      smartType = 'success';
    } else if (Number(summary.savingsRate) < 10) {
      smartMessage = `Your savings rate is ${summary.savingsRate}%. Try to reduce spending in ${topExpense.name} to improve.`;
      smartType = 'warning';
    } else {
      smartMessage = `Steady month! Your top spending is ${topExpense.name} at $${topExpense.value.toLocaleString()}.`;
      smartType = 'neutral';
    }

    return {
      topExpense,
      thisMonthExpenses,
      lastMonthExpenses,
      expenseChange: Number(expenseChange),
      incomeChange: Number(incomeChange),
      thisMonthIncome,
      lastMonthIncome,
      smartMessage,
      smartType,
      transactionCount: thisMonth.length,
    };
  },
}));

// Initialize theme class on load
if (typeof document !== 'undefined') {
  const savedTheme = loadState('theme', 'dark');
  document.documentElement.classList.toggle('dark', savedTheme === 'dark');
}

export default useStore;
