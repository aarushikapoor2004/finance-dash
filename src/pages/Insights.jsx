import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, Wallet, ArrowRight } from 'lucide-react';
import useStore from '../store/store';
import { monthlyTrend, revenueData, financialGoals, expenseBreakdown } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 !shadow-xl">
        <p className="text-xs font-semibold text-slate-900 dark:text-white mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
            {entry.name}: {typeof entry.value === 'number' && entry.value > 100 ? `$${entry.value.toLocaleString()}` : `${entry.value}%`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Insights() {
  const { getSummary } = useStore();
  const summary = getSummary();

  const insightCards = [
    {
      title: 'Monthly Savings',
      value: `$${Math.round(summary.balance).toLocaleString()}`,
      description: 'You saved more than last month',
      icon: Wallet,
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-500/10',
      textColor: 'text-primary-500',
    },
    {
      title: 'Savings Rate',
      value: `${summary.savingsRate}%`,
      description: 'Of total income saved',
      icon: TrendingUp,
      color: 'from-success-400 to-success-600',
      bgColor: 'bg-success-500/10',
      textColor: 'text-success-500',
    },
    {
      title: 'Top Expense',
      value: 'Rent',
      description: `$1,800 this month`,
      icon: Target,
      color: 'from-accent-400 to-accent-600',
      bgColor: 'bg-accent-500/10',
      textColor: 'text-accent-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insightCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="glass-card p-6 relative overflow-hidden group"
          >
            <div className={`p-3 rounded-xl ${card.bgColor} w-fit mb-4`}>
              <card.icon className={`w-5 h-5 ${card.textColor}`} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{card.title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{card.value}</p>
            <p className="text-xs text-slate-500 mt-1">{card.description}</p>
            
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-5 rounded-full -translate-y-8 translate-x-8 group-hover:opacity-10 transition-opacity`} />
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Savings Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Savings Trend</h3>
          <p className="text-xs text-slate-500 mb-6">Monthly savings amount</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="savings" name="Savings" stroke="#22c55e" fill="url(#savingsGrad)" strokeWidth={2.5} dot={{ r: 4, fill: '#22c55e' }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Income vs Expenses Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Income vs Expenses</h3>
          <p className="text-xs text-slate-500 mb-6">Monthly comparison</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueData.slice(-6)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" name="Income" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={30} />
              <Bar dataKey="expenses" name="Expenses" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Financial Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Financial Goals</h3>
            <p className="text-xs text-slate-500 mt-0.5">Track your progress</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {financialGoals.map((goal, i) => {
            const progress = Math.round((goal.current / goal.target) * 100);
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: goal.color }}></div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{goal.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-surface-700 rounded-full overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.8 + i * 0.1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: goal.color }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>${goal.current.toLocaleString()}</span>
                  <span>${goal.target.toLocaleString()}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Spending by Category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6"
      >
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Spending by Category</h3>
        <p className="text-xs text-slate-500 mb-6">Detailed breakdown</p>
        <div className="space-y-3">
          {expenseBreakdown.map((item, i) => {
            const percentage = Math.round((item.value / expenseBreakdown.reduce((sum, e) => sum + e.value, 0)) * 100);
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.05 }}
                className="flex items-center gap-4"
              >
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-slate-700 dark:text-slate-300 w-32 flex-shrink-0">{item.name}</span>
                <div className="flex-1 h-2 bg-slate-100 dark:bg-surface-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.8 + i * 0.05 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white w-16 text-right">${item.value}</span>
                <span className="text-xs text-slate-500 w-10 text-right">{percentage}%</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
