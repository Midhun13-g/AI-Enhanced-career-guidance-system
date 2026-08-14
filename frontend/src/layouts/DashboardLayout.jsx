import { motion } from 'framer-motion';
import { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardNavbar from './DashboardNavbar';
import Footer from './Footer';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-w-0 flex-1">
        <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        >
          {children}
        </motion.main>
        <Footer />
      </div>
    </div>
  );
}
