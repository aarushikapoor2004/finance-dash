import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import useStore from '../store/store';
import { categories } from '../data/mockData';

export default function TransactionForm() {
  const { showTransactionForm, editingTransaction, closeTransactionForm, addTransaction, updateTransaction } = useStore();

  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: 'Salary',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        description: editingTransaction.description,
        amount: Math.abs(editingTransaction.amount).toString(),
        category: editingTransaction.category,
        type: editingTransaction.type,
        date: editingTransaction.date,
      });
    } else {
      setForm({
        description: '',
        amount: '',
        category: 'Salary',
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [editingTransaction, showTransactionForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;

    const amount = parseFloat(form.amount);
    const transaction = {
      description: form.description,
      amount: form.type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
      category: form.category,
      type: form.type,
      date: form.date,
    };

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transaction);
    } else {
      addTransaction(transaction);
    }
    closeTransactionForm();
  };

  return (
    <AnimatePresence>
      {showTransactionForm && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeTransactionForm}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingTransaction ? 'Edit Transaction' : 'New Transaction'}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeTransactionForm}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type Toggle */}
                <div className="flex bg-slate-100 dark:bg-white/5 rounded-xl p-1 gap-0.5">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: 'income' })}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      form.type === 'income'
                        ? 'bg-white dark:bg-surface-700 text-success-600 dark:text-success-400 shadow-sm'
                        : 'text-slate-500'
                    }`}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: 'expense' })}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      form.type === 'expense'
                        ? 'bg-white dark:bg-surface-700 text-danger-600 dark:text-danger-400 shadow-sm'
                        : 'text-slate-500'
                    }`}
                  >
                    Expense
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Monthly salary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="input-field"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="input-field"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={closeTransactionForm} className="btn-secondary flex-1">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    {editingTransaction ? 'Update' : 'Add Transaction'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
