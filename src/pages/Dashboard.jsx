import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, ArrowUpRight } from 'lucide-react';
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell, Sector,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import SummaryCard from '../components/SummaryCard';
import TransactionTable from '../components/TransactionTable';
import useStore from '../store/store';
import ChartTooltip from '../components/shared/ChartTooltip';
import ChartCard, { LegendItem } from '../components/shared/ChartCard';
import { GradientBar } from '../components/shared/GradientBar';
import { revenueData } from '../data/mockData';

// ─── Design tokens ────────────────────────────────────────────────────────────
const GRID_COLOR    = 'rgba(255,255,255,0.04)';
const TICK_COLOR    = '#475569';
const TICK_SIZE     = 11;
const INCOME_COLOR  = '#6366f1';
const EXPENSE_COLOR = '#8b5cf6';

const PIE_COLORS = [
  '#6366f1', '#8b5cf6', '#06b6d4',
  '#f59e0b', '#10b981', '#f43f5e',
  '#ec4899', '#64748b',
];

const axisProps = {
  axisLine: false,
  tickLine: false,
  tick: { fill: TICK_COLOR, fontSize: TICK_SIZE, fontFamily: 'Inter, sans-serif' },
};

// ─── Active Pie sector ────────────────────────────────────────────────────────
function ActivePieShape(props) {
  const {
    cx, cy, innerRadius, outerRadius,
    startAngle, endAngle, fill, payload, value,
  } = props;

  return (
    <g>
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={1}
      />
      <Sector
        cx={cx} cy={cy}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 14}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.4}
      />
      <text x={cx} y={cy - 10} textAnchor="middle" fill="#fff" fontSize={18} fontWeight={800} fontFamily="Inter, sans-serif">
        ${value.toLocaleString()}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#475569" fontSize={11} fontFamily="Inter, sans-serif">
        {payload.name}
      </text>
    </g>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { transactions, getSummary, getWeeklySpending, getExpenseBreakdown, getInsights } = useStore();
  const summary = getSummary();
  const weeklySpending = getWeeklySpending();
  const expenseBreakdown = getExpenseBreakdown();
  const insights = getInsights();
  const [activePieIdx, setActivePieIdx] = useState(0);

  const onPieEnter = useCallback((_, idx) => setActivePieIdx(idx), []);

  const fmt = (val) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;

  const recentTransactions = transactions.slice(0, 7);

  // Compute real change percentages
  const balanceChange = insights.lastMonthIncome > 0
    ? Number(((summary.balance / (insights.lastMonthIncome - insights.lastMonthExpenses) - 1) * 100).toFixed(1)) || 0
    : 0;

  const summaryCards = [
    { title: 'Total Balance',  value: fmt(summary.balance),       change: balanceChange,          icon: DollarSign, color: 'blue'   },
    { title: 'Total Income',   value: fmt(summary.totalIncome),   change: insights.incomeChange,  icon: TrendingUp,  color: 'green'  },
    { title: 'Total Expenses', value: fmt(summary.totalExpenses), change: -Math.abs(insights.expenseChange), icon: TrendingDown, color: 'red'   },
    { title: 'Savings Rate',   value: `${summary.savingsRate}%`,  change: Number(summary.savingsRate) > 20 ? 5.4 : -2.1, icon: PiggyBank,   color: 'purple' },
  ];

  const weeklyTotal = weeklySpending.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <SummaryCard key={card.title} {...card} delay={i} />
        ))}
      </div>

      {/* Row 1: Area chart + Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Area chart */}
        <ChartCard
          title="Revenue Overview"
          subtitle="Income vs Expenses · 10-month trend"
          delay={0.25}
          className="lg:col-span-2"
          legend={
            <>
              <LegendItem color={INCOME_COLOR}  label="Income"   />
              <LegendItem color={EXPENSE_COLOR} label="Expenses" />
            </>
          }
        >
          <ResponsiveContainer width="100%" height={272}>
            <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="grad-income" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={INCOME_COLOR} stopOpacity={0.35} />
                  <stop offset="85%"  stopColor={INCOME_COLOR} stopOpacity={0.03} />
                  <stop offset="100%" stopColor={INCOME_COLOR} stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="grad-expense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={EXPENSE_COLOR} stopOpacity={0.28} />
                  <stop offset="85%"  stopColor={EXPENSE_COLOR} stopOpacity={0.02} />
                  <stop offset="100%" stopColor={EXPENSE_COLOR} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={GRID_COLOR} />
              <XAxis dataKey="month" {...axisProps} dy={8} />
              <YAxis {...axisProps} dx={-4} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }}
              />
              <Area
                type="monotoneX" dataKey="income" name="Income"
                stroke={INCOME_COLOR} strokeWidth={2.5}
                fill="url(#grad-income)" dot={false}
                activeDot={{ r: 5, fill: INCOME_COLOR, stroke: 'rgba(9,14,26,0.8)', strokeWidth: 2, filter: `drop-shadow(0 0 6px ${INCOME_COLOR})` }}
              />
              <Area
                type="monotoneX" dataKey="expenses" name="Expenses"
                stroke={EXPENSE_COLOR} strokeWidth={2.5}
                fill="url(#grad-expense)" dot={false}
                activeDot={{ r: 5, fill: EXPENSE_COLOR, stroke: 'rgba(9,14,26,0.8)', strokeWidth: 2, filter: `drop-shadow(0 0 6px ${EXPENSE_COLOR})` }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Donut pie */}
        <ChartCard title="Expense Breakdown" subtitle="By category · from transactions" delay={0.35}>
          {expenseBreakdown.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%" cy="50%"
                    innerRadius={62} outerRadius={85}
                    paddingAngle={2.5} dataKey="value"
                    activeIndex={activePieIdx}
                    activeShape={<ActivePieShape />}
                    onMouseEnter={onPieEnter}
                    stroke="none"
                  >
                    {expenseBreakdown.map((item, i) => (
                      <Cell
                        key={i}
                        fill={item.color || PIE_COLORS[i % PIE_COLORS.length]}
                        opacity={activePieIdx === i ? 1 : 0.65}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-3">
                {expenseBreakdown.slice(0, 6).map((item, i) => (
                  <button
                    key={item.name}
                    onMouseEnter={() => setActivePieIdx(i)}
                    className="flex items-center gap-2 text-[11px] group text-left"
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0 transition-transform group-hover:scale-125"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-surface-500 group-hover:text-surface-300 transition-colors truncate">
                      {item.name}
                    </span>
                    <span className="text-surface-300 font-semibold ml-auto">
                      ${item.value.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[210px] text-surface-500 text-[13px]">
              No expense data yet
            </div>
          )}
        </ChartCard>
      </div>

      {/* Row 2: Bar chart + Recent transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bar chart — real weekly spending */}
        <ChartCard title="Weekly Spending" subtitle="Daily expense breakdown" delay={0.45}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklySpending} margin={{ top: 4, right: 4, left: -16, bottom: 0 }} barCategoryGap="35%">
              <CartesianGrid vertical={false} stroke={GRID_COLOR} />
              <XAxis dataKey="day" {...axisProps} dy={8} />
              <YAxis {...axisProps} dx={-4} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 6 }}
              />
              <Bar dataKey="amount" name="Spending" shape={<GradientBar />} maxBarSize={36} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.05]">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-surface-600 font-semibold">Weekly Total</p>
              <p className="text-[18px] font-extrabold text-white mt-0.5">
                ${weeklyTotal.toLocaleString()}
              </p>
            </div>
            {weeklyTotal > 0 && (
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
                This week
              </div>
            )}
          </div>
        </ChartCard>

        {/* Recent transactions */}
        <ChartCard title="Recent Transactions" subtitle="Latest activity" delay={0.55} className="lg:col-span-2">
          <TransactionTable transactions={recentTransactions} showActions={false} />
        </ChartCard>
      </div>
    </div>
  );
}
