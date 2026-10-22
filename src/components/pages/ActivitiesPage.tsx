import React, { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'motion/react';
import { StorageService } from '../../services/storage';
import { ActivityLogItem } from '../../types';
import {
  Plus,
  Search,
  Clock,
  X,
} from 'lucide-react';

export const ActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLogItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Completed' | 'In Progress' | 'Scheduled'>('All');
  const [search, setSearch] = useState('');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Form state
  const [userName, setUserName] = useState('Sam Wheeler');
  const [topicTitle, setTopicTitle] = useState('Food Safety & Facility Sanitation');
  const [score, setScore] = useState(90);
  const [status, setStatus] = useState<'Completed' | 'In Progress' | 'Scheduled'>('Completed');

  const listRef = useRef<HTMLDivElement>(null);

  const loadActivities = () => {
    setActivities(StorageService.getActivities());
  };

  useEffect(() => {
    loadActivities();
    const handleUpdate = () => loadActivities();
    window.addEventListener('tesla_storage_updated', handleUpdate);
    return () => window.removeEventListener('tesla_storage_updated', handleUpdate);
  }, []);

  const filtered = activities.filter((act) => {
    const matchesSearch =
      act.userName.toLowerCase().includes(search.toLowerCase()) ||
      act.topicTitle.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' || act.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Stagger entrance of activity items
  useGSAP(
    () => {
      if (listRef.current) {
        gsap.fromTo(
          listRef.current.children,
          { opacity: 0, x: -10 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.04,
            duration: 0.35,
            ease: 'power2.out',
          }
        );
      }
    },
    { scope: listRef, dependencies: [filterStatus, filtered.length] }
  );

  const handleItemHover = (e: React.MouseEvent<HTMLDivElement>, enter: boolean) => {
    gsap.to(e.currentTarget, {
      x: enter ? 4 : 0,
      backgroundColor: enter ? 'rgba(249, 250, 252, 0.95)' : 'transparent',
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  const handleRecordActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = StorageService.getCurrentUser();

    StorageService.logActivity({
      id: 'act-' + Date.now(),
      userId: currentUser.id,
      userName: userName || currentUser.name,
      userAvatar: currentUser.avatarUrl,
      topicTitle,
      action: status === 'Completed' ? 'completed_quiz' : 'started_course',
      score: Number(score) || 85,
      status,
      timestamp: new Date().toISOString(),
      formattedTime: 'Just now',
    });

    setIsLogModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#EFF0F6] rounded-[20px] p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#151E23] tracking-tight flex items-center gap-2">
            <span>Training &amp; Assessment Audit Stream</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Real-time activity ledger recording employee assessments, module completions, and score events saved to Localhost.
          </p>
        </div>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B59F8] hover:bg-[#1546C4] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Record Activity Event</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by learner or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-[#EFF0F6] text-xs focus:outline-none focus:border-[#1B59F8]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['All', 'Completed', 'In Progress', 'Scheduled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#1B59F8] text-white'
                  : 'bg-white border border-[#EFF0F6] text-gray-600 hover:text-gray-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Activities Timeline */}
      <div className="bg-white border border-[#EFF0F6] rounded-[20px] p-6 shadow-2xs space-y-4">
        {filtered.length > 0 ? (
          <div ref={listRef} className="divide-y divide-[#EFF0F6]">
            {filtered.map((item) => (
              <div
                key={item.id}
                onMouseEnter={(e) => handleItemHover(e, true)}
                onMouseLeave={(e) => handleItemHover(e, false)}
                className="py-4 first:pt-0 last:pb-0 px-2 rounded-xl flex items-center justify-between gap-4 group transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={item.userAvatar || '/images/Photo_34x34.png'}
                    alt={item.userName}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-100 shrink-0"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        item.userName
                      )}&background=EFF0F6&color=151E23&bold=true`;
                    }}
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-gray-900">
                        {item.userName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {item.action === 'completed_quiz'
                          ? 'completed quiz in'
                          : item.action === 'started_course'
                          ? 'initiated course'
                          : item.action === 'joined_platform'
                          ? 'registered account'
                          : 'attempted'}
                      </span>
                      <span className="text-xs font-semibold text-[#1B59F8] truncate">
                        {item.topicTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.formattedTime}
                      </span>
                      {item.score !== undefined && (
                        <span>Score: {item.score}%</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      item.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : item.status === 'In Progress'
                        ? 'bg-blue-50 text-[#1B59F8] border border-blue-100'
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-sm text-gray-400">
            No activity events found matching your criteria.
          </div>
        )}
      </div>

      {/* Log Modal */}
      <AnimatePresence>
        {isLogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#EFF0F6] z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#EFF0F6] pb-3">
                <h3 className="text-base font-bold text-[#151E23]">
                  Record Activity to Localhost
                </h3>
                <button
                  onClick={() => setIsLogModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRecordActivity} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Learner Name
                  </label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1B59F8]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Topic / Course Title
                  </label>
                  <input
                    type="text"
                    required
                    value={topicTitle}
                    onChange={(e) => setTopicTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1B59F8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Score (%)
                    </label>
                    <input
                      type="number"
                      value={score}
                      onChange={(e) => setScore(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1B59F8]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value as 'Completed' | 'In Progress' | 'Scheduled')
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1B59F8]"
                    >
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Scheduled">Scheduled</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EFF0F6]">
                  <button
                    type="button"
                    onClick={() => setIsLogModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#1B59F8] text-white font-semibold shadow-xs"
                  >
                    Save Event
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
