import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit3, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import useStore from '../store/store';

export default function TransactionTable({ transactions, showActions = true }) {
  const { role, deleteTransaction, openTransactionForm } = useStore();
  const isAdmin = role === 'admin';

  const formatCurrency = (amount) => {
    const abs = Math.abs(amount);
    return `${amount < 0 ? '-' : ''}$${abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 dark:border-surface-700">
            <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Transaction</th>
            <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
            <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3.5 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
            {showActions && isAdmin && (
              <th className="px-4 py-3.5 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {transactions.map((t, i) => (
              <motion.tr
                key={t.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className="table-row"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      t.type === 'income' 
                        ? 'bg-success-50 dark:bg-success-500/10 text-success-500' 
                        : 'bg-danger-50 dark:bg-danger-500/10 text-danger-500'
                    }`}>
                      {t.type === 'income' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{t.description}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="badge bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400">
                    {t.category}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400">
                  {formatDate(t.date)}
                </td>
                <td className={`px-4 py-4 text-sm font-semibold text-right ${
                  t.type === 'income' ? 'text-success-500' : 'text-danger-500'
                }`}>
                  {t.type === 'income' ? '+' : ''}{formatCurrency(t.amount)}
                </td>
                {showActions && isAdmin && (
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openTransactionForm(t)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-primary-500 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteTransaction(t.id)}
                        className="p-2 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-500/10 text-slate-400 hover:text-danger-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
