import React from 'react';
import { motion } from 'motion/react';
import { TeslaLogo } from '../TeslaLogo';
import { ArrowLeft, AlertCircle } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (page: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col justify-between font-sans antialiased text-[#151E23] p-4">
      {/* Top Header */}
      <header className="max-w-7xl mx-auto w-full py-6 flex items-center justify-between">
        <div
          onClick={() => onNavigate('landing')}
          className="cursor-pointer flex items-center gap-2"
        >
          <TeslaLogo className="h-4" />
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-[#E51837] tracking-wider uppercase ml-1">
            Academy
          </span>
        </div>
      </header>

      {/* Main 404 Content */}
      <main className="flex-1 flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl border border-[#EFF0F6] shadow-xl p-8 text-center space-y-5"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#E51837] mx-auto flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div>
            <span className="text-5xl font-extrabold text-[#151E23] block tracking-tight">
              404
            </span>
            <h1 className="text-xl font-bold text-[#151E23] mt-2">
              Page Not Found
            </h1>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              The requested view or document path does not exist in Localhost storage or has been moved.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('reports')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1B59F8] hover:bg-[#1546C4] text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Executive Reports</span>
            </button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-gray-400">
        Tesla Learning System · Error Code: 404_PAGE_NOT_FOUND
      </footer>
    </div>
  );
};