import { motion, AnimatePresence } from 'framer-motion';
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

  return (
    <div className="min-h-screen" style={{ background: '#090e1a' }}>

      {/* ── Ambient gradient orbs ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
        <div
          className="absolute rounded-full blur-[140px]"
          style={{
            width: 600, height: 600,
            top: -280, right: -180,
            background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full blur-[140px]"
          style={{
            width: 500, height: 500,
            top: '42%', left: -200,
            background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full blur-[120px]"
          style={{
            width: 400, height: 400,
            bottom: -180, right: '22%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* ── Sidebar ── */}
      <Sidebar />

      {/* ── Main content ── */}
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarOpen ? 260 : 72 }}
        transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative min-h-screen flex flex-col"
      >
        <Navbar />

        <div className="flex-1 px-5 lg:px-8 py-5">
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
