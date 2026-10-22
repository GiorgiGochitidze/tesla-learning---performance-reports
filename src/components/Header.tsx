import React from 'react';
import { motion } from 'motion/react';
import { DownloadIcon } from './Icons';
import { Menu, Globe } from 'lucide-react';

interface HeaderProps {
  title?: string;
  onOpenMobileMenu?: () => void;
  onDownloadClick?: () => void;
  onNavigatePublic?: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Reports',
  onOpenMobileMenu,
  onDownloadClick,
  onNavigatePublic,
}) => {
  return (
    <header className="w-full bg-white border-b border-[#EFF0F6] sticky top-0 z-50">
      <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Mobile hamburger & Page Title */}
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div>
            <motion.h1
              key={title}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-[#151E23] tracking-tight"
            >
              {title}
            </motion.h1>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {onNavigatePublic && (
            <button
              onClick={() => onNavigatePublic('landing')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-[#EFF0F6] transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-gray-400" />
              <span>Public Site</span>
            </button>
          )}

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: '#F9FAFB' }}
            whileTap={{ scale: 0.97 }}
            onClick={onDownloadClick}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#EFF0F6] bg-white text-sm font-semibold text-gray-700 shadow-xs hover:border-gray-300 hover:text-gray-900 transition-all cursor-pointer"
          >
            <DownloadIcon className="w-4 h-4 text-gray-500" />
            <span>Download</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};
