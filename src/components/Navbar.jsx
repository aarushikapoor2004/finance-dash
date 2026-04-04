import { Search, Moon, Sun, Shield, Eye, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../store/store';

export default function Navbar() {
  const { theme, toggleTheme, role, setRole, activePage } = useStore();

  const pageTitle = {
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    insights: 'Insights',
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="glass-navbar sticky top-0 z-30 h-[72px] flex items-center justify-between px-6 lg:px-8"
    >
      {/* Left: Page Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {pageTitle[activePage] || 'Dashboard'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-transparent focus-within:border-primary-500/50 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none w-44"
          />
        </div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger-500 rounded-full"></span>
        </motion.button>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>

        {/* Role Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-xl p-1 gap-0.5">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setRole('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              role === 'admin'
                ? 'bg-white dark:bg-surface-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setRole('viewer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              role === 'viewer'
                ? 'bg-white dark:bg-surface-700 text-accent-600 dark:text-accent-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Viewer
          </motion.button>
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary-500/20 ml-1">
          Z
        </div>
      </div>
    </motion.header>
  );
}
