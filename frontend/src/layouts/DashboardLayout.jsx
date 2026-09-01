import { motion } from 'framer-motion';
import { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardNavbar from './DashboardNavbar';
import Footer from './Footer';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-neutral-900 lg:flex antialiased selection:bg-[#0038FF] selection:text-white">
      {/* ── Collapsible & Desktop Sidebar Rail ── */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ── Main Canvas ── */}
      <div className="min-w-0 flex-1 flex flex-col justify-between">
        <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />

        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="mx-auto max-w-[1400px] w-full px-4 py-6 sm:px-6 lg:px-8 flex-1"
        >
          {children}
        </motion.main>

        <Footer />
      </div>
    </div>
  );
}