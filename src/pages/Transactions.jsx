import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, Search } from 'lucide-react';
import TransactionTable from '../components/TransactionTable';
import TransactionForm from '../components/TransactionForm';
import RoleGuard from '../components/RoleGuard';
import EmptyState from '../components/EmptyState';
import useStore from '../store/store';

export default function Transactions() {
  const { transactions, openTransactionForm } = useStore();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filtered = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) ||
                          t.category.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">All Transactions</h3>
          <p className="text-sm text-slate-500">{filtered.length} transactions found</p>
        </div>
        <RoleGuard requiredRole="admin">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openTransactionForm()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </motion.button>
        </RoleGuard>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 flex flex-col sm:flex-row gap-3"
      >
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-surface-700 focus-within:border-primary-500/50 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none w-full"
          />
        </div>
        <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-xl p-1 gap-0.5">
          {['all', 'income', 'expense'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                filterType === type
                  ? 'bg-white dark:bg-surface-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card overflow-hidden"
      >
        {filtered.length > 0 ? (
          <TransactionTable transactions={filtered} />
        ) : (
          <EmptyState
            title="No transactions found"
            description="Try adjusting your search or filters."
          />
        )}
      </motion.div>

      {/* Transaction Form Modal */}
      <TransactionForm />
    </div>
  );
}
