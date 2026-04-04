import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';
import useStore from './store/store';

const pages = {
  dashboard: Dashboard,
  transactions: Transactions,
  insights: Insights,
};

function App() {
  const { activePage, sidebarOpen } = useStore();
  const ActivePage = pages[activePage] || Dashboard;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-900 transition-colors duration-300">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-success-400/5 rounded-full blur-3xl"></div>
      </div>

      <Sidebar />

      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarOpen ? 260 : 80 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="relative min-h-screen"
      >
        <Navbar />
        <div className="p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <ActivePage />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
}

export default App;
