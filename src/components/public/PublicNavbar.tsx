import React from 'react';
import { TeslaLogo } from '../TeslaLogo';
import { ArrowRight, LogIn, LayoutDashboard } from 'lucide-react';
import { AuthUser } from '../../types';

interface PublicNavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentUser?: AuthUser;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#EFF0F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => onNavigate('landing')}
          className="cursor-pointer flex items-center gap-2 group"
        >
          <TeslaLogo className="h-4" />
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-[#E51837] tracking-wider uppercase ml-1">
            Academy
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => onNavigate('landing')}
            className={`text-sm font-medium transition-colors ${
              currentPage === 'landing'
                ? 'text-[#1B59F8] font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`text-sm font-medium transition-colors ${
              currentPage === 'about'
                ? 'text-[#1B59F8] font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            About Us
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1.5"
          >
            Reports
          </button>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          {currentUser && currentUser.loggedIn ? (
            <button
              onClick={() => onNavigate('reports')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1B59F8] hover:bg-[#1546C4] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => onNavigate('auth')}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => onNavigate('auth')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1B59F8] hover:bg-[#1546C4] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
              >
                <span>Sign Up</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
