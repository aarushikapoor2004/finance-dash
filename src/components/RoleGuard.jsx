import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldOff } from 'lucide-react';
import useStore from '../store/store';

/* ═══════════════════════════════════════════════════════════════════════════════
   RoleGuard

   Usage modes:
   ──────────────────────────────────────────
   1. HIDE — completely hides children for non-admin
      <RoleGuard>
        <DangerousButton />
      </RoleGuard>

   2. LOCK — renders children but overlays a "view-only" lock message
      <RoleGuard mode="lock">
        <TransactionTable />
      </RoleGuard>

   3. DISABLE — renders children but passes `disabled` via render prop
      <RoleGuard mode="disable">
        {(canEdit) => <button disabled={!canEdit}>Delete</button>}
      </RoleGuard>

   Props:
   • requiredRole — role needed to pass ("admin" by default)
   • mode         — "hide" | "lock" | "disable" (default: "hide")
   • fallback     — custom fallback JSX for "hide" mode
   • message      — custom lock-overlay message
   ═══════════════════════════════════════════════════════════════════════════════ */

export default function RoleGuard({
  children,
  requiredRole = 'admin',
  mode = 'hide',
  fallback = null,
  message = 'Admin access required to edit',
}) {
  const { role } = useStore();
  const hasAccess = role === requiredRole || (requiredRole === 'viewer'); // viewer = everyone

  // ── Mode: DISABLE (render prop) ──
  if (mode === 'disable') {
    return typeof children === 'function' ? children(hasAccess) : children;
  }

  // ── Mode: HIDE ──
  if (mode === 'hide') {
    return (
      <AnimatePresence>
        {hasAccess ? (
          <motion.div
            key="role-content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        ) : (
          fallback && (
            <motion.div
              key="role-fallback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {fallback}
            </motion.div>
          )
        )}
      </AnimatePresence>
    );
  }

  // ── Mode: LOCK (overlay) ──
  if (mode === 'lock') {
    return (
      <div className="relative">
        {/* Always render children */}
        <div className={!hasAccess ? 'pointer-events-none select-none' : ''}>
          {children}
        </div>

        {/* Lock overlay for non-authorized */}
        <AnimatePresence>
          {!hasAccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="
                absolute inset-0 z-10 flex flex-col items-center justify-center
                rounded-2xl cursor-not-allowed
              "
              style={{
                background: 'var(--bg-modal)',
                backdropFilter: 'blur(6px)',
              }}
            >
              <motion.div
                initial={{ scale: 0.8, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                className="flex flex-col items-center text-center px-6"
              >
                {/* Lock icon with pulse ring */}
                <div className="relative mb-3">
                  <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl animate-pulse-slow" />
                  <div
                    className="relative w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid var(--border-card)' }}
                  >
                    <Lock className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>

                <p className="text-[13px] font-semibold mb-1" style={{ color: 'var(--text-heading)' }}>{message}</p>
                <p className="text-[11px] max-w-[200px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Switch to Admin mode in the navbar to unlock editing
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return children;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ViewerBadge — small inline indicator shown when viewer mode is active
   ═══════════════════════════════════════════════════════════════════════════════ */
export function ViewerBadge() {
  const { role } = useStore();
  return (
    <AnimatePresence>
      {role === 'viewer' && (
        <motion.div
          initial={{ opacity: 0, x: -8, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -8, scale: 0.9 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="
            inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg
            text-[10px] font-bold uppercase tracking-wider
            bg-amber-500/[0.10] text-amber-400
            border border-amber-500/[0.18]
          "
        >
          <ShieldOff className="w-3 h-3" />
          View Only
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   useRoleGuard — hook for programmatic checks
   ═══════════════════════════════════════════════════════════════════════════════ */
export function useRoleGuard() {
  const { role, isAdmin, addToast } = useStore();

  const guardAction = (action, label = 'This action') => {
    if (!isAdmin()) {
      addToast(`🔒 ${label} requires Admin access`, 'error');
      return false;
    }
    action();
    return true;
  };

  return { role, isAdmin: isAdmin(), guardAction };
}
