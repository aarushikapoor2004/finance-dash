import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ArrowLeftRight, TrendingUp,
  ChevronLeft, Sparkles, Settings, HelpCircle,
} from 'lucide-react';
import useStore from '../store/store';

// ─── Navigation Items ───────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'dashboard',     label: 'Dashboard',     icon: LayoutDashboard, shortcut: '1' },
  { id: 'transactions',  label: 'Transactions',  icon: ArrowLeftRight,  shortcut: '2' },
  { id: 'insights',      label: 'Insights',      icon: TrendingUp,      shortcut: '3' },
];

const BOTTOM_ITEMS = [
  { id: 'settings', label: 'Settings',     icon: Settings   },
  { id: 'help',     label: 'Help & Support', icon: HelpCircle },
];

// ─── Tooltip (collapsed state) ──────────────────────────────────────────────
function NavTooltip({ label }) {
  return (
    <div className="
      absolute left-full ml-3 px-2.5 py-1.5 z-[60]
      rounded-lg bg-surface-800 border border-white/[0.07]
      text-xs font-medium text-white whitespace-nowrap
      opacity-0 group-hover:opacity-100
      pointer-events-none transition-opacity duration-150 shadow-xl
    ">
      {label}
      <div className="
        absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[5px]
        w-2.5 h-2.5 bg-surface-800 border-l border-b border-white/[0.07] rotate-45
      " />
    </div>
  );
}

// ─── Individual Nav Button ───────────────────────────────────────────────────
function NavButton({ item, isActive, sidebarOpen, onClick }) {
  const Icon = item.icon;
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      title={!sidebarOpen ? item.label : undefined}
      className={`
        sidebar-nav-item group relative w-full flex items-center gap-3
        rounded-xl transition-colors duration-200
        ${sidebarOpen ? 'px-3 py-2.5' : 'px-0 py-2.5 justify-center'}
        ${isActive ? 'text-white' : 'text-surface-400 hover:text-surface-200'}
      `}
    >
      {/* Active pill bg */}
      {isActive && (
        <motion.div
          layoutId="sidebar-pill"
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.10) 100%)',
            boxShadow: 'inset 0 0 0 1px rgba(99,102,241,0.22)',
          }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        />
      )}

      {/* Hover bg */}
      {!isActive && (
        <div className="absolute inset-0 rounded-xl bg-white/[0.03] opacity-0 group-hover:opacity-100 transition-opacity" />
      )}

      {/* Left accent bar */}
      {isActive && (
        <motion.div
          layoutId="sidebar-bar"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-r-full bg-indigo-400"
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        />
      )}

      {/* Icon */}
      <Icon className={`
        relative z-10 w-[18px] h-[18px] flex-shrink-0 transition-colors
        ${isActive ? 'text-indigo-400' : 'group-hover:text-surface-200'}
      `} />

      {/* Label */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.15 }}
            className="relative z-10 text-[13px] font-medium flex-1 text-left"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Keyboard shortcut badge */}
      <AnimatePresence>
        {isActive && sidebarOpen && (
          <motion.kbd
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
            className="relative z-10 text-[10px] font-semibold text-surface-500
              bg-white/[0.05] px-1.5 py-0.5 rounded-md border border-white/[0.07]"
          >
            ⌘{item.shortcut}
          </motion.kbd>
        )}
      </AnimatePresence>

      {/* Tooltip on collapsed */}
      {!sidebarOpen && <NavTooltip label={item.label} />}
    </motion.button>
  );
}

// ─── Bottom Utility Button ───────────────────────────────────────────────────
function BottomButton({ item, sidebarOpen }) {
  const Icon = item.icon;
  return (
    <button
      className={`
        group relative w-full flex items-center gap-3 rounded-xl
        text-surface-500 hover:text-surface-300
        transition-colors duration-200
        ${sidebarOpen ? 'px-3 py-2' : 'px-0 py-2 justify-center'}
      `}
      title={!sidebarOpen ? item.label : undefined}
    >
      <div className="absolute inset-0 rounded-xl bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
      <Icon className="relative z-10 w-4 h-4 flex-shrink-0" />
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="relative z-10 text-[13px] font-medium"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      {!sidebarOpen && <NavTooltip label={item.label} />}
    </button>
  );
}

// ─── Divider ────────────────────────────────────────────────────────────────
function Divider() {
  return (
    <div className="mx-3 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
  );
}

// ─── Sidebar Root ───────────────────────────────────────────────────────────
export default function Sidebar() {
  const { activePage, setActivePage, sidebarOpen, toggleSidebar } = useStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 260 : 72 }}
      transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
      className="
        fixed left-0 top-0 h-screen z-40 flex flex-col select-none
        bg-[#090e1a] border-r border-white/[0.05]
      "
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-4 h-[66px] flex-shrink-0">
        {/* Logo mark */}
        <div className="relative flex-shrink-0">
          <div className="absolute -inset-1 rounded-[14px] bg-indigo-500/30 blur-md animate-pulse-slow" />
          <div className="
            relative w-9 h-9 rounded-[11px] flex items-center justify-center
            bg-gradient-to-br from-indigo-500 to-violet-600
            shadow-lg shadow-indigo-500/25
          ">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Brand text */}
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col leading-tight min-w-0"
            >
              <span className="text-[15px] font-bold text-white tracking-tight">Zorvyn</span>
              <span className="text-[11px] text-surface-500 font-medium">Finance Suite</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Divider />

      {/* ── Primary Navigation ── */}
      <nav className="flex-1 px-3 pt-5 pb-3 space-y-0.5 overflow-y-auto scrollbar-none">
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] font-semibold uppercase tracking-[0.1em] text-surface-600 px-3 mb-3"
            >
              Main Menu
            </motion.p>
          )}
        </AnimatePresence>

        {NAV_ITEMS.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            isActive={activePage === item.id}
            sidebarOpen={sidebarOpen}
            onClick={() => setActivePage(item.id)}
          />
        ))}
      </nav>

      {/* ── Utility Links ── */}
      <div className="px-3 pb-3 space-y-0.5">
        {BOTTOM_ITEMS.map((item) => (
          <BottomButton key={item.id} item={item} sidebarOpen={sidebarOpen} />
        ))}
      </div>

      <Divider />

      {/* ── User Profile + Collapse Toggle ── */}
      <div className="px-3 py-3 flex items-center gap-2.5">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="
            w-8 h-8 rounded-[9px] flex items-center justify-center
            bg-gradient-to-br from-indigo-500 to-violet-600
            text-white text-[12px] font-bold shadow-md
          ">
            Z
          </div>
          {/* Online dot */}
          <span className="
            absolute -bottom-0.5 -right-0.5
            w-2.5 h-2.5 rounded-full bg-emerald-500
            ring-2 ring-[#090e1a]
          " />
        </div>

        {/* Name + Email */}
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.15 }}
              className="flex-1 min-w-0"
            >
              <p className="text-[13px] font-semibold text-white truncate leading-tight">John Doe</p>
              <p className="text-[11px] text-surface-500 truncate leading-tight">john@zorvyn.com</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSidebar}
          title={sidebarOpen ? 'Collapse' : 'Expand'}
          className={`
            flex-shrink-0 p-1.5 rounded-lg
            bg-white/[0.04] hover:bg-white/[0.08]
            text-surface-500 hover:text-surface-300
            border border-white/[0.05]
            transition-all duration-200
            ${!sidebarOpen ? 'mx-auto' : ''}
          `}
        >
          <motion.div
            animate={{ rotate: sidebarOpen ? 0 : 180 }}
            transition={{ duration: 0.28 }}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </motion.div>
        </motion.button>
      </div>
    </motion.aside>
  );
}
