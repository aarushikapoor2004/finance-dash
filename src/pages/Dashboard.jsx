import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import SummaryCard from '../components/SummaryCard';
import TransactionTable from '../components/TransactionTable';
import useStore from '../store/store';
import { revenueData, expenseBreakdown, weeklySpending } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 !shadow-xl">
        <p className="text-xs font-semibold text-slate-900 dark:text-white mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { transactions, getSummary } = useStore();
  const summary = getSummary();

  const formatCurrency = (val) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;

  const recentTransactions = transactions.slice(0, 7);

  const summaryCards = [
    { title: 'Total Balance', value: formatCurrency(summary.balance), change: 12.5, icon: DollarSign, color: 'blue' },
    { title: 'Total Income', value: formatCurrency(summary.totalIncome), change: 8.2, icon: TrendingUp, color: 'green' },
    { title: 'Total Expenses', value: formatCurrency(summary.totalExpenses), change: -3.1, icon: TrendingDown, color: 'red' },
    { title: 'Savings Rate', value: `${summary.savingsRate}%`, change: 5.4, icon: PiggyBank, color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <SummaryCard key={card.title} {...card} delay={i} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Revenue Overview</h3>
              <p className="text-xs text-slate-500 mt-0.5">Income vs Expenses trend</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-500"></span>
                <span className="text-slate-500">Income</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-500"></span>
                <span className="text-slate-500">Expenses</span>
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" name="Income" stroke="#3b82f6" fill="url(#incomeGrad)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#3b82f6' }} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#8b5cf6" fill="url(#expenseGrad)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#8b5cf6' }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Expense Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="glass-card p-6"
        >
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Expense Breakdown</h3>
          <p className="text-xs text-slate-500 mb-4">By category this month</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={expenseBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {expenseBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {expenseBreakdown.slice(0, 6).map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-500 dark:text-slate-400 truncate">{item.name}</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium ml-auto">${item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Weekly Spending + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Spending */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="glass-card p-6"
        >
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Weekly Spending</h3>
          <p className="text-xs text-slate-500 mb-4">Daily expense overview</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklySpending}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" name="Spending" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
              <p className="text-xs text-slate-500 mt-0.5">Latest activity</p>
            </div>
          </div>
          <TransactionTable transactions={recentTransactions} showActions={false} />
        </motion.div>
      </div>
    </div>
  );
}
