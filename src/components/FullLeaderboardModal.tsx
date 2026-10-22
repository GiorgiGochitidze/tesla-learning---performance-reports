import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserLeaderboardItem, GroupLeaderboardItem } from '../types';
import { TrendUpIcon, TrendDownIcon } from './Icons';
import { X, Search, Trophy, Download } from 'lucide-react';

interface FullLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'users' | 'groups';
  users: UserLeaderboardItem[];
  groups: GroupLeaderboardItem[];
}

export const FullLeaderboardModal: React.FC<FullLeaderboardModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'users',
  users,
  groups,
}) => {
  const [tab, setTab] = useState<'users' | 'groups'>(defaultTab);
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    (u.department && u.department.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    (g.region && g.region.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#EFF0F6] overflow-hidden flex flex-col max-h-[85vh] z-10"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#EFF0F6] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1B59F8] flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#151E23]">
                  Performance Leaderboard
                </h2>
                <p className="text-xs text-gray-500">
                  Global employee ranking and group competency scores
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subheader: Tabs & Search */}
          <div className="p-4 bg-gray-50/70 border-b border-[#EFF0F6] flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Tabs */}
            <div className="flex bg-gray-200/60 p-1 rounded-xl w-full sm:w-auto">
              <button
                onClick={() => setTab('users')}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  tab === 'users'
                    ? 'bg-white text-[#1B59F8] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Individual Users ({users.length})
              </button>
              <button
                onClick={() => setTab('groups')}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  tab === 'groups'
                    ? 'bg-white text-[#1B59F8] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Departments &amp; Regions ({groups.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={tab === 'users' ? 'Search user...' : 'Search group...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:border-[#1B59F8] focus:ring-1 focus:ring-[#1B59F8]"
              />
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#EFF0F6]">
            {tab === 'users' ? (
              filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.rank}
                    className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="w-5 text-center text-sm font-bold text-gray-400">
                        {user.rank}
                      </span>
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name
                          )}&background=EFF0F6&color=151E23&bold=true`;
                        }}
                      />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.department || 'Tesla Staff'} · {user.points} Points
                          {user.accuracy ? ` · ${user.accuracy}% Accuracy` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-[#1B59F8]">
                        {user.points} pts
                      </span>
                      <div className="w-4 flex justify-center">
                        {user.trend === 'up' ? (
                          <TrendUpIcon className="w-3 h-3 text-[#1FE08F]" />
                        ) : (
                          <TrendDownIcon className="w-3 h-3 text-[#FF3E13]" />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-sm text-gray-400">
                  No users found matching &quot;{search}&quot;
                </div>
              )
            ) : filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <div
                  key={group.rank}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-5 text-center text-sm font-bold text-gray-400">
                      {group.rank}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {group.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {group.region || 'Operational Unit'} · {group.membersCount || 25} Members
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-700">
                      {group.pointsPerUser} pts / user
                      {group.accuracy ? ` (${group.accuracy}%)` : ''}
                    </span>
                    <div className="w-4 flex justify-center">
                      {group.trend === 'up' ? (
                        <TrendUpIcon className="w-3 h-3 text-[#1FE08F]" />
                      ) : (
                        <TrendDownIcon className="w-3 h-3 text-[#FF3E13]" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-gray-400">
                No groups found matching &quot;{search}&quot;
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#EFF0F6] bg-gray-50 flex items-center justify-between text-xs text-gray-500">
            <span>Updated real-time with current test completions</span>
            <button
              onClick={() => {
                alert('Exporting leaderboard data as CSV...');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
