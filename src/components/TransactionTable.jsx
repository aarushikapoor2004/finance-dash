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
          <tr style={{ borderBottom: '1px solid var(--border-card)' }}>
            <th className="px-3 sm:px-4 py-3 sm:py-3.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Transaction</th>
            <th className="hidden sm:table-cell px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Category</th>
            <th className="hidden md:table-cell px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Date</th>
            <th className="px-3 sm:px-4 py-3 sm:py-3.5 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Amount</th>
            {showActions && isAdmin && (
              <th className="px-3 sm:px-4 py-3 sm:py-3.5 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Actions</th>
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
                <td className="px-3 sm:px-4 py-3 sm:py-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      t.type === 'income' ? 'text-success-500' : 'text-danger-500'
                    }`}
                      style={{ background: t.type === 'income' ? 'var(--icon-income-bg)' : 'var(--icon-expense-bg)' }}
                    >
                      {t.type === 'income' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-medium block truncate" style={{ color: 'var(--text-primary)' }}>{t.description}</span>
                      <span className="sm:hidden text-[11px]" style={{ color: 'var(--text-muted)' }}>{t.category}</span>
                    </div>
                  </div>
                </td>
                <td className="hidden sm:table-cell px-4 py-4">
                  <span className="badge" style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)' }}>
                    {t.category}
                  </span>
                </td>
                <td className="hidden md:table-cell px-4 py-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                  {formatDate(t.date)}
                </td>
                <td className={`px-3 sm:px-4 py-3 sm:py-4 text-sm font-semibold text-right ${
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
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--hover-overlay)'; e.currentTarget.style.color = '#6366f1'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                      >
                        <Edit3 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteTransaction(t.id)}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--icon-expense-bg)'; e.currentTarget.style.color = '#ef4444'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
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
