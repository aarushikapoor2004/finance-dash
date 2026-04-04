import { create } from 'zustand';
import { initialTransactions } from '../data/mockData';

const useStore = create((set, get) => ({
  // Theme
  theme: 'dark',
  toggleTheme: () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark';
    set({ theme: newTheme });
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  // Role management
  role: 'admin', // 'admin' | 'viewer'
  setRole: (role) => set({ role }),

  // Navigation
  activePage: 'dashboard',
  setActivePage: (page) => set({ activePage: page }),

  // Sidebar
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Transactions
  transactions: initialTransactions,
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [
        { ...transaction, id: Math.max(0, ...state.transactions.map(t => t.id)) + 1 },
        ...state.transactions,
      ],
    })),
  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
  updateTransaction: (id, updates) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    })),

  // Transaction form modal
  showTransactionForm: false,
  editingTransaction: null,
  openTransactionForm: (transaction = null) =>
    set({ showTransactionForm: true, editingTransaction: transaction }),
  closeTransactionForm: () =>
    set({ showTransactionForm: false, editingTransaction: null }),

  // Computed values
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
}));

// Initialize dark mode on load
if (typeof document !== 'undefined') {
  document.documentElement.classList.add('dark');
}

export default useStore;
