import { useState, useRef, useEffect } from 'react';
import { Search, Moon, Sun, Shield, Eye, Bell, Command, Plus, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/store';
import { ViewerBadge } from './RoleGuard';

// ─── Notification Data ───────────────────────────────────────────────────────
const NOTIFICATIONS = [
  { id: 1, title: 'Payment received',    desc: '+$2,200 from freelance',      time: '2m',  dot: 'bg-emerald-500' },
  { id: 2, title: 'Budget alert',        desc: 'Food & Dining near limit',    time: '1h',  dot: 'bg-amber-500'   },
  { id: 3, title: 'Goal achieved',       desc: 'Emergency fund reached 75%',  time: '3h',  dot: 'bg-indigo-500'  },
];

// ─── Page Meta ───────────────────────────────────────────────────────────────
const PAGE_META = {
  dashboard:    { title: 'Dashboard',    subtitle: "Welcome back — here's your financial overview" },
  transactions: { title: 'Transactions', subtitle: 'Manage and track all your transactions'         },
  insights:     { title: 'Insights',     subtitle: 'Analytics and financial intelligence'            },
};

// ─── NotificationPanel ───────────────────────────────────────────────────────
function NotificationPanel({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
      className="
        absolute right-0 top-full mt-2 w-80 z-50
        rounded-2xl border border-white/[0.07] overflow-hidden
        shadow-[0_24px_60px_rgba(0,0,0,0.5)]
      "
      style={{ background: 'rgba(9,14,26,0.97)', backdropFilter: 'blur(40px)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-white">Notifications</span>
          <span className="
            px-1.5 py-0.5 rounded-md text-[10px] font-bold
            bg-indigo-500/15 text-indigo-400 border border-indigo-500/20
          ">
            3
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/[0.06] text-surface-500 hover:text-surface-300 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Notification list */}
      <div>
        {NOTIFICATIONS.map((n, i) => (
          <div
            key={n.id}
            className={`
              flex items-start gap-3 px-4 py-3.5 cursor-pointer
              hover:bg-white/[0.03] transition-colors
              ${i < NOTIFICATIONS.length - 1 ? 'border-b border-white/[0.04]' : ''}
            `}
          >
            <div className={`w-2 h-2 mt-[5px] rounded-full flex-shrink-0 ${n.dot}`} />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-white">{n.title}</p>
              <p className="text-[11px] text-surface-500 mt-0.5">{n.desc}</p>
            </div>
            <span className="text-[10px] text-surface-600 flex-shrink-0 mt-0.5">{n.time} ago</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-white/[0.05]">
        <button className="w-full text-center text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors py-0.5">
          View all notifications →
        </button>
      </div>
    </motion.div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
export default function Navbar() {
  const { theme, toggleTheme, role, setRole, activePage, openTransactionForm, isAdmin, addToast } = useStore();
  const [searchFocused, setSearchFocused]       = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef(null);
  const notifRef  = useRef(null);

  // Close notification panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const meta = PAGE_META[activePage] ?? PAGE_META.dashboard;

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="
        sticky top-0 z-30 flex items-center justify-between
        px-6 lg:px-8 h-[66px]
        border-b border-white/[0.05]
      "
      style={{
        background: 'rgba(9,14,26,0.85)',
        backdropFilter: 'blur(40px) saturate(1.8)',
      }}
    >
      {/* ── Left: Page context ── */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h2 className="text-[16px] font-bold text-white tracking-tight">{meta.title}</h2>

          {/* Live indicator — Dashboard only */}
          {activePage === 'dashboard' && (
            <span className="relative flex h-1.5 w-1.5 ml-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
          )}

          {/* Viewer badge */}
          <ViewerBadge />
        </div>
        <p className="text-[11px] text-surface-500 font-medium mt-0.5 leading-tight">{meta.subtitle}</p>
      </div>

      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-1.5">

        {/* ── Search ── */}
        <div className="hidden md:flex items-center relative">
          <motion.div
            animate={{
              width: searchFocused ? 260 : 188,
              borderColor: searchFocused ? 'rgba(99,102,241,0.45)' : 'rgba(255,255,255,0.06)',
            }}
            transition={{ duration: 0.22 }}
            className="
              flex items-center gap-2 px-3 py-2
              rounded-xl bg-white/[0.04] border transition-shadow
            "
            style={searchFocused ? { boxShadow: '0 0 0 3px rgba(99,102,241,0.12)' } : {}}
          >
            <Search className="w-3.5 h-3.5 text-surface-500 flex-shrink-0" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="
                bg-transparent text-[13px] text-white
                placeholder-surface-600 outline-none w-full
              "
            />
            {!searchFocused && (
              <kbd className="
                hidden lg:flex items-center gap-0.5
                text-[10px] text-surface-600 font-semibold
                bg-white/[0.04] px-1.5 py-0.5
                rounded-md border border-white/[0.06] flex-shrink-0
              ">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            )}
          </motion.div>
        </div>

        {/* ── Add Transaction (Admin only) ── */}
        <motion.button
          whileHover={{ scale: isAdmin() ? 1.04 : 1 }}
          whileTap={{ scale: isAdmin() ? 0.96 : 1 }}
          onClick={() => {
            if (isAdmin()) {
              openTransactionForm();
            } else {
              addToast('🔒 Switch to Admin mode to add transactions', 'error');
            }
          }}
          className={`
            hidden sm:flex items-center gap-1.5
            px-3 py-[7px] rounded-xl
            text-[12px] font-semibold text-white
            transition-all duration-200
            ${!isAdmin() ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{
            background: isAdmin()
              ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
              : 'linear-gradient(135deg, #334155, #1e293b)',
            boxShadow: isAdmin()
              ? '0 2px 14px rgba(99,102,241,0.28), inset 0 1px 0 rgba(255,255,255,0.12)'
              : 'none',
          }}
        >
          {isAdmin() ? <Plus className="w-3.5 h-3.5" /> : <Lock className="w-3 h-3" />}
          <span>{isAdmin() ? 'New' : 'Locked'}</span>
        </motion.button>

        {/* ── Notifications ── */}
        <div className="relative" ref={notifRef}>
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => setShowNotifications((v) => !v)}
            className="
              relative p-2 rounded-xl
              bg-white/[0.03] hover:bg-white/[0.07]
              border border-white/[0.05]
              text-surface-400 hover:text-surface-200
              transition-all duration-200
            "
          >
            <Bell className="w-[17px] h-[17px]" />
            <span className="
              absolute top-[7px] right-[7px]
              w-1.5 h-1.5 rounded-full bg-red-500
              ring-[1.5px] ring-[#090e1a]
            " />
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <NotificationPanel onClose={() => setShowNotifications(false)} />
            )}
          </AnimatePresence>
        </div>

        {/* ── Theme Toggle ── */}
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.93, rotate: 20 }}
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="
            p-2 rounded-xl
            bg-white/[0.03] hover:bg-white/[0.07]
            border border-white/[0.05]
            text-surface-400 hover:text-surface-200
            transition-all duration-200
          "
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ rotate: -80, opacity: 0 }}
              animate={{ rotate: 0,   opacity: 1 }}
              exit={{ rotate: 80,  opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {theme === 'dark'
                ? <Sun  className="w-[17px] h-[17px]" />
                : <Moon className="w-[17px] h-[17px]" />
              }
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* ── Role Switcher ── */}
        <div className="
          hidden lg:flex items-center
          rounded-xl p-0.5 gap-0.5
          bg-white/[0.04] border border-white/[0.05]
        ">
          {/* Admin */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setRole('admin')}
            className={`
              relative flex items-center gap-1.5 px-2.5 py-[6px]
              rounded-[9px] text-[11px] font-semibold
              transition-colors duration-200
              ${role === 'admin' ? 'text-indigo-400' : 'text-surface-500 hover:text-surface-300'}
            `}
          >
            {role === 'admin' && (
              <motion.div
                layoutId="role-active"
                className="absolute inset-0 rounded-[9px] bg-indigo-500/[0.15] border border-indigo-500/25"
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}
            <Shield className="relative z-10 w-3 h-3" />
            <span className="relative z-10">Admin</span>
          </motion.button>

          {/* Viewer */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setRole('viewer')}
            className={`
              relative flex items-center gap-1.5 px-2.5 py-[6px]
              rounded-[9px] text-[11px] font-semibold
              transition-colors duration-200
              ${role === 'viewer' ? 'text-violet-400' : 'text-surface-500 hover:text-surface-300'}
            `}
          >
            {role === 'viewer' && (
              <motion.div
                layoutId="role-active"
                className="absolute inset-0 rounded-[9px] bg-violet-500/[0.15] border border-violet-500/25"
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}
            <Eye className="relative z-10 w-3 h-3" />
            <span className="relative z-10">Viewer</span>
          </motion.button>
        </div>

        {/* ── User Avatar ── */}
        <div className="pl-1">
          <motion.div
            whileHover={{ scale: 1.06 }}
            className="
              relative w-8 h-8 rounded-[10px] cursor-pointer
              bg-gradient-to-br from-indigo-500 to-violet-600
              flex items-center justify-center
              text-white text-[12px] font-bold
              shadow-lg shadow-indigo-500/20
              ring-1 ring-white/[0.08]
            "
          >
            Z
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
