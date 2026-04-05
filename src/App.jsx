import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';
import TransactionForm from './components/TransactionForm';
import useStore from './store/store';

const PAGES = {
  dashboard: Dashboard,
  transactions: Transactions,
  insights: Insights,
};

const pageMotion = {
  initial:    { opacity: 0, y: 10, filter: 'blur(6px)' },
  animate:    { opacity: 1, y: 0,  filter: 'blur(0px)' },
  exit:       { opacity: 0, y: -8, filter: 'blur(6px)' },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
};

function App() {
  const { activePage, sidebarOpen } = useStore();
  const ActivePage = PAGES[activePage] || Dashboard;

  // Track if we're on desktop to conditionally apply sidebar margin
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mq.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-body)', transition: 'background 0.3s ease' }}>

      {/* ── Ambient gradient orbs ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
        <div
          className="absolute rounded-full blur-[140px]"
          style={{
            width: 600, height: 600,
            top: -280, right: -180,
            background: 'radial-gradient(circle, var(--gradient-orb-1) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full blur-[140px]"
          style={{
            width: 500, height: 500,
            top: '42%', left: -200,
            background: 'radial-gradient(circle, var(--gradient-orb-2) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full blur-[120px]"
          style={{
            width: 400, height: 400,
            bottom: -180, right: '22%',
            background: 'radial-gradient(circle, var(--gradient-orb-3) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* ── Sidebar ── */}
      <Sidebar />

      {/* ── Main content ── */}
      <motion.main
        initial={false}
        animate={{ marginLeft: isDesktop ? (sidebarOpen ? 260 : 72) : 0 }}
        transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative min-h-screen flex flex-col"
      >
        <Navbar />

        <div className="flex-1 px-3 sm:px-5 lg:px-8 py-4 sm:py-5">
          <AnimatePresence mode="wait">
            <motion.div key={activePage} {...pageMotion}>
              <ActivePage />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>

      {/* ── Global modal ── */}
      <TransactionForm />
    </div>
  );
}

export default App;
