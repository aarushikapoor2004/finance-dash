import { motion } from 'framer-motion';
import { 
  LayoutDashboard, ArrowLeftRight, TrendingUp, 
  ChevronLeft, ChevronRight, Sparkles 
} from 'lucide-react';
import useStore from '../store/store';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: TrendingUp },
];

export default function Sidebar() {
  const { activePage, setActivePage, sidebarOpen, toggleSidebar } = useStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 260 : 80 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="glass-sidebar fixed left-0 top-0 h-screen z-40 flex flex-col"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-[72px] border-b border-slate-200 dark:border-white/5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/25">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Zorvyn</h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-500 -mt-0.5 font-medium">Finance Dashboard</p>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1.5">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full ${isActive ? 'nav-item-active' : 'nav-item'}`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-500' : ''}`} />
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm"
                >
                  {item.label}
                </motion.span>
              )}
              {isActive && sidebarOpen && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Toggle */}
      <div className="px-3 py-4 border-t border-slate-200 dark:border-white/5">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 transition-colors"
        >
          {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    </motion.aside>
  );
}
