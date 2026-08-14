import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <Sparkles size={13} className="text-white" />
          </div>
          <span className="text-sm font-bold text-slate-700">Career<span className="text-blue-600">AI</span></span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-slate-400">AI-Enhanced Career Guidance System</span>
        </div>
        <div className="flex items-center gap-5 text-xs text-slate-400">
          <Link to="/dashboard" className="hover:text-blue-600 transition-colors font-medium">Dashboard</Link>
          <Link to="/profile"   className="hover:text-blue-600 transition-colors font-medium">Profile</Link>
          <Link to="/assessment" className="hover:text-blue-600 transition-colors font-medium">Assessment</Link>
          <span>© {new Date().getFullYear()} CareerAI</span>
        </div>
      </div>
    </footer>
  );
}
