// Categories for transactions
export const categories = [
  'Salary', 'Freelance', 'Investment', 'Shopping', 'Food & Dining',
  'Transportation', 'Utilities', 'Entertainment', 'Healthcare', 'Education',
  'Rent', 'Insurance', 'Subscriptions', 'Travel', 'Other'
];

// Generate realistic transactions
export const initialTransactions = [
  { id: 1, date: '2026-04-04', description: 'Monthly Salary', category: 'Salary', amount: 8500, type: 'income' },
  { id: 2, date: '2026-04-03', description: 'Freelance Web Project', category: 'Freelance', amount: 2200, type: 'income' },
  { id: 3, date: '2026-04-03', description: 'Grocery Store', category: 'Food & Dining', amount: -156.30, type: 'expense' },
  { id: 4, date: '2026-04-02', description: 'Electric Bill', category: 'Utilities', amount: -94.50, type: 'expense' },
  { id: 5, date: '2026-04-02', description: 'Netflix Subscription', category: 'Subscriptions', amount: -15.99, type: 'expense' },
  { id: 6, date: '2026-04-01', description: 'Apartment Rent', category: 'Rent', amount: -1800, type: 'expense' },
  { id: 7, date: '2026-04-01', description: 'Stock Dividends', category: 'Investment', amount: 340, type: 'income' },
  { id: 8, date: '2026-03-31', description: 'Restaurant Dinner', category: 'Food & Dining', amount: -68.40, type: 'expense' },
  { id: 9, date: '2026-03-30', description: 'Uber Rides', category: 'Transportation', amount: -42.80, type: 'expense' },
  { id: 10, date: '2026-03-30', description: 'Health Insurance', category: 'Insurance', amount: -320, type: 'expense' },
  { id: 11, date: '2026-03-29', description: 'Gym Membership', category: 'Healthcare', amount: -60, type: 'expense' },
  { id: 12, date: '2026-03-29', description: 'Online Course', category: 'Education', amount: -49.99, type: 'expense' },
  { id: 13, date: '2026-03-28', description: 'Freelance Design Work', category: 'Freelance', amount: 850, type: 'income' },
  { id: 14, date: '2026-03-27', description: 'Coffee & Snacks', category: 'Food & Dining', amount: -23.50, type: 'expense' },
  { id: 15, date: '2026-03-26', description: 'Concert Tickets', category: 'Entertainment', amount: -120, type: 'expense' },
  { id: 16, date: '2026-03-25', description: 'Gas Station', category: 'Transportation', amount: -55.00, type: 'expense' },
  { id: 17, date: '2026-03-24', description: 'Investment Return', category: 'Investment', amount: 1200, type: 'income' },
  { id: 18, date: '2026-03-23', description: 'Clothing Purchase', category: 'Shopping', amount: -210, type: 'expense' },
  { id: 19, date: '2026-03-22', description: 'Water Bill', category: 'Utilities', amount: -35.80, type: 'expense' },
  { id: 20, date: '2026-03-21', description: 'Weekend Trip', category: 'Travel', amount: -450, type: 'expense' },
];

// Revenue chart data (monthly)
export const revenueData = [
  { month: 'Jul', income: 9200, expenses: 5800 },
  { month: 'Aug', income: 10100, expenses: 6200 },
  { month: 'Sep', income: 8800, expenses: 5500 },
  { month: 'Oct', income: 11500, expenses: 6800 },
  { month: 'Nov', income: 10800, expenses: 7200 },
  { month: 'Dec', income: 12400, expenses: 8100 },
  { month: 'Jan', income: 9800, expenses: 6400 },
  { month: 'Feb', income: 11200, expenses: 7000 },
  { month: 'Mar', income: 13100, expenses: 7800 },
  { month: 'Apr', income: 11890, expenses: 7340 },
];

// Expense breakdown by category
export const expenseBreakdown = [
  { name: 'Rent', value: 1800, color: '#3b82f6' },
  { name: 'Food & Dining', value: 680, color: '#8b5cf6' },
  { name: 'Insurance', value: 320, color: '#06b6d4' },
  { name: 'Shopping', value: 290, color: '#f59e0b' },
  { name: 'Transportation', value: 245, color: '#22c55e' },
  { name: 'Entertainment', value: 180, color: '#ef4444' },
  { name: 'Utilities', value: 165, color: '#ec4899' },
  { name: 'Other', value: 340, color: '#64748b' },
];

// Weekly spending data
export const weeklySpending = [
  { day: 'Mon', amount: 120 },
  { day: 'Tue', amount: 85 },
  { day: 'Wed', amount: 210 },
  { day: 'Thu', amount: 65 },
  { day: 'Fri', amount: 340 },
  { day: 'Sat', amount: 280 },
  { day: 'Sun', amount: 150 },
];

// Monthly trend data for insights
export const monthlyTrend = [
  { month: 'Jan', savings: 3400, savingsRate: 34.7 },
  { month: 'Feb', savings: 4200, savingsRate: 37.5 },
  { month: 'Mar', savings: 5300, savingsRate: 40.5 },
  { month: 'Apr', savings: 4550, savingsRate: 38.3 },
];

// Goal tracking
export const financialGoals = [
  { id: 1, name: 'Emergency Fund', target: 15000, current: 11200, color: '#3b82f6' },
  { id: 2, name: 'Vacation Fund', target: 5000, current: 3200, color: '#8b5cf6' },
  { id: 3, name: 'New Car', target: 30000, current: 8500, color: '#06b6d4' },
  { id: 4, name: 'Investment Portfolio', target: 50000, current: 22000, color: '#22c55e' },
];
