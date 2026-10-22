import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PublicNavbar } from './PublicNavbar';
import { TeslaLogo } from '../TeslaLogo';
import { StorageService } from '../../services/storage';
import { LogIn, UserPlus, CheckCircle2, ArrowRight } from 'lucide-react';
import { AuthUser } from '../../types';

interface AuthPageProps {
  onNavigate: (page: string) => void;
  onAuthSuccess: (user: AuthUser) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onNavigate,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('samwheeler@example.com');
  const [role, setRole] = useState('Senior Operations Director');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your work email address');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      let user: AuthUser;
      if (mode === 'signup') {
        if (!name.trim()) {
          setErrorMsg('Please enter your full name');
          setIsSubmitting(false);
          return;
        }
        user = StorageService.signup(name, email, role);
      } else {
        user = StorageService.login(email, password);
      }

      setIsSubmitting(false);
      onAuthSuccess(user);
      onNavigate('reports');
    }, 400);
  };

  const handleQuickDemo = (demoEmail: string, demoName: string, demoRole: string) => {
    setEmail(demoEmail);
    setName(demoName);
    setRole(demoRole);
    setPassword('demo12345');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col font-sans antialiased text-[#151E23]">
      <PublicNavbar currentPage="auth" onNavigate={onNavigate} />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl border border-[#EFF0F6] shadow-xl p-8"
        >
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="inline-flex justify-center mb-3">
              <TeslaLogo className="h-5" />
            </div>
            <h2 className="text-2xl font-bold text-[#151E23] tracking-tight">
              {mode === 'signin' ? 'Sign in to Reports' : 'Create Staff Account'}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {mode === 'signin'
                ? 'Access executive knowledge metrics & department analytics'
                : 'Join the Tesla workforce continuous learning roster'}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-white text-[#1B59F8] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-white text-[#1B59F8] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B59F8] focus:ring-1 focus:ring-[#1B59F8]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Corporate Email
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B59F8] focus:ring-1 focus:ring-[#1B59F8]"
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Department / Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Quality Assurance Specialist"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B59F8] focus:ring-1 focus:ring-[#1B59F8]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B59F8] focus:ring-1 focus:ring-[#1B59F8]"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#1B59F8] focus:ring-[#1B59F8]"
                />
                <span>Save credentials in Localhost</span>
              </label>
              <span className="text-gray-400">Offline-safe</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1B59F8] hover:bg-[#1546C4] text-white font-semibold text-sm shadow-xs transition-all cursor-pointer disabled:opacity-70 mt-2"
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : mode === 'signin' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Dashboard</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account &amp; Enter</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-6 pt-5 border-t border-[#EFF0F6]">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2 text-center">
              Quick Localhost Profiles
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  handleQuickDemo(
                    'samwheeler@example.com',
                    'Sam Wheeler',
                    'Senior Operations Director'
                  )
                }
                className="p-2 text-left rounded-xl border border-gray-200 hover:border-[#1B59F8] hover:bg-blue-50/30 text-xs transition-all cursor-pointer"
              >
                <div className="font-semibold text-gray-900 truncate">
                  Sam Wheeler
                </div>
                <div className="text-[10px] text-gray-500 truncate">
                  Director (Default)
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickDemo(
                    'jesse.thomas@example.com',
                    'Jesse Thomas',
                    'Lead Automation Engineer'
                  )
                }
                className="p-2 text-left rounded-xl border border-gray-200 hover:border-[#1B59F8] hover:bg-blue-50/30 text-xs transition-all cursor-pointer"
              >
                <div className="font-semibold text-gray-900 truncate">
                  Jesse Thomas
                </div>
                <div className="text-[10px] text-gray-500 truncate">
                  Rank 1 (637 pts)
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};
