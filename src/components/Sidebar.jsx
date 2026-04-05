import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ArrowLeftRight, TrendingUp,
  ChevronLeft, Sparkles, Settings, HelpCircle,
} from 'lucide-react';
import { useEffect } from 'react';
import useStore from '../store/store';

// ─── Navigation Items ───────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, shortcut: '1' },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight, shortcut: '2' },
  { id: 'insights', label: 'Insights', icon: TrendingUp, shortcut: '3' },
];

const BOTTOM_ITEMS = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

// ─── Tooltip (collapsed state) ──────────────────────────────────────────────
function NavTooltip({ label }) {
  return (
    <div
      className="absolute left-full ml-3 px-2.5 py-1.5 z-[60] rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-xl"
      style={{
        background: 'var(--bg-tooltip)',
        border: '1px solid var(--border-card)',
        color: 'var(--text-heading)',
      }}
    >
      {label}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[5px] w-2.5 h-2.5 rotate-45"
        style={{
          background: 'var(--bg-tooltip)',
          borderLeft: '1px solid var(--border-card)',
          borderBottom: '1px solid var(--border-card)',
        }}
      />
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
      `}
      style={{ color: isActive ? 'var(--text-heading)' : 'var(--btn-surface-text)' }}
    >
      {/* Active pill bg */}
      {isActive && (
        <motion.div
          layoutId="sidebar-pill"
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'var(--pill-active-bg)',
            boxShadow: `inset 0 0 0 1px var(--pill-active-border)`,
          }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        />
      )}

      {/* Hover bg */}
      {!isActive && (
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'var(--hover-overlay)' }}
        />
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
        ${isActive ? 'text-indigo-400' : ''}
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
            className="relative z-10 text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
            style={{
              color: 'var(--text-muted)',
              background: 'var(--kbd-bg)',
              border: '1px solid var(--kbd-border)',
            }}
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
        transition-colors duration-200
        ${sidebarOpen ? 'px-3 py-2' : 'px-0 py-2 justify-center'}
      `}
      style={{ color: 'var(--text-muted)' }}
      title={!sidebarOpen ? item.label : undefined}
    >
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'var(--hover-overlay)' }}
      />
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
    <div className="mx-3 h-px" style={{ background: `linear-gradient(to right, transparent, var(--border-card), transparent)` }} />
  );
}

// ─── Sidebar Content (shared between desktop & mobile) ──────────────────────
function SidebarContent({ sidebarOpen, activePage, setActivePage, toggleSidebar, onNavClick }) {
  return (
    <>
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-4 h-[66px] flex-shrink-0">
        <div className="relative flex-shrink-0">
          <div className="absolute -inset-1 rounded-[14px] bg-indigo-500/30 blur-md animate-pulse-slow" />
          <div className="relative w-9 h-9 rounded-[11px] flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col leading-tight min-w-0"
            >
              <span className="text-[15px] font-bold tracking-tight" style={{ color: 'var(--text-heading)' }}>Zorvyn</span>
              <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>Finance Suite</span>
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
              className="text-[10px] font-semibold uppercase tracking-[0.1em] px-3 mb-3"
              style={{ color: 'var(--text-dim)' }}
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
            onClick={() => { setActivePage(item.id); onNavClick?.(); }}
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
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 rounded-[9px] flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-[12px] font-bold shadow-md">
            Z
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500"
            style={{ boxShadow: `0 0 0 2px var(--status-ring)` }}
          />
        </div>

        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.15 }}
              className="flex-1 min-w-0"
            >
              <p className="text-[13px] font-semibold truncate leading-tight" style={{ color: 'var(--text-heading)' }}>Teja Reddy</p>
              <p className="text-[11px] truncate leading-tight" style={{ color: 'var(--text-muted)' }}>Tejareddy@zorvyn.com</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse toggle — only desktop */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSidebar}
          title={sidebarOpen ? 'Collapse' : 'Expand'}
          className={`
            hidden md:flex flex-shrink-0 p-1.5 rounded-lg
            transition-all duration-200
            ${!sidebarOpen ? 'mx-auto' : ''}
          `}
          style={{
            background: 'var(--btn-surface-bg)',
            border: '1px solid var(--btn-surface-border)',
            color: 'var(--text-muted)',
          }}
        >
          <motion.div
            animate={{ rotate: sidebarOpen ? 0 : 180 }}
            transition={{ duration: 0.28 }}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </motion.div>
        </motion.button>
      </div>
    </>
  );
}

// ─── Sidebar Root ───────────────────────────────────────────────────────────
export default function Sidebar() {
  const { activePage, setActivePage, sidebarOpen, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen } = useStore();

  // Close mobile sidebar on window resize to desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e) => { if (e.matches) setMobileSidebarOpen(false); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [setMobileSidebarOpen]);

  return (
    <>
      {/* ═══ DESKTOP SIDEBAR (md+) ═══ */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 72 }}
        transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
        className="hidden md:flex fixed left-0 top-0 h-screen z-40 flex-col select-none"
        style={{
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-subtle)',
          transition: 'background 0.3s ease',
        }}
      >
        <SidebarContent
          sidebarOpen={sidebarOpen}
          activePage={activePage}
          setActivePage={setActivePage}
          toggleSidebar={toggleSidebar}
        />
      </motion.aside>

      {/* ═══ MOBILE SIDEBAR DRAWER (<md) ═══ */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            {/* Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Drawer panel */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed left-0 top-0 h-screen w-[260px] z-[56] flex flex-col select-none md:hidden"
              style={{
                background: 'var(--bg-sidebar)',
                borderRight: '1px solid var(--border-subtle)',
              }}
            >
              <SidebarContent
                sidebarOpen={true}
                activePage={activePage}
                setActivePage={setActivePage}
                toggleSidebar={toggleSidebar}
                onNavClick={() => setMobileSidebarOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
