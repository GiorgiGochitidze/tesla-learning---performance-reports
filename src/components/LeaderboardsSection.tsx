import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { UserLeaderboardItem, GroupLeaderboardItem } from '../types';
import { TrendUpIcon, TrendDownIcon } from './Icons';

interface LeaderboardsSectionProps {
  users: UserLeaderboardItem[];
  groups: GroupLeaderboardItem[];
  onOpenFullUserLeaderboard: () => void;
  onOpenFullGroupLeaderboard: () => void;
}

export const LeaderboardsSection: React.FC<LeaderboardsSectionProps> = ({
  users,
  groups,
  onOpenFullUserLeaderboard,
  onOpenFullGroupLeaderboard,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (containerRef.current) {
        const rows = containerRef.current.querySelectorAll('.leaderboard-row');
        gsap.fromTo(
          rows,
          { opacity: 0, x: -10 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.03,
            duration: 0.4,
            ease: 'power2.out',
          }
        );
      }
    },
    { scope: containerRef, dependencies: [users.length, groups.length] }
  );

  const handleRowHover = (e: React.MouseEvent<HTMLDivElement>, enter: boolean) => {
    const row = e.currentTarget;
    const avatar = row.querySelector('.user-avatar');
    const rankEl = row.querySelector('.rank-text');

    gsap.to(row, {
      backgroundColor: enter ? '#F9FAFC' : 'transparent',
      duration: 0.2,
      ease: 'power2.out',
    });

    if (avatar) {
      gsap.to(avatar, {
        scale: enter ? 1.08 : 1,
        duration: 0.2,
        ease: 'power2.out',
      });
    }

    if (rankEl) {
      gsap.to(rankEl, {
        scale: enter ? 1.15 : 1,
        color: enter ? '#1B59F8' : '#686873',
        duration: 0.2,
        ease: 'power2.out',
      });
    }
  };

  return (
    <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {/* User Leaderboard Card */}
      <div className="bg-white border border-[#EFF0F6] rounded-[20px] shadow-2xs hover:border-gray-300 transition-all flex flex-col justify-between overflow-hidden">
        <div className="p-6 pb-4 border-b border-[#EFF0F6]">
          <h3 className="text-sm md:text-base font-semibold text-[#151E23] tracking-tight">
            User Leaderboard
          </h3>
        </div>

        {/* 10 User Rows */}
        <div className="divide-y divide-[#EFF0F6]/60">
          {users.slice(0, 10).map((user, idx) => (
            <div
              key={user.rank}
              onMouseEnter={(e) => handleRowHover(e, true)}
              onMouseLeave={(e) => handleRowHover(e, false)}
              className="leaderboard-row flex items-center justify-between px-6 py-3.5 transition-colors group cursor-pointer"
            >
              {/* Left: Avatar + Name + Score */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="user-avatar w-[42px] h-[42px] rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-[#1B59F8]/20 transition-all"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name
                      )}&background=EFF0F6&color=151E23&bold=true`;
                    }}
                  />
                  {idx < 3 && (
                    <span
                      className={`absolute -top-1 -left-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white ${
                        idx === 0
                          ? 'bg-amber-400'
                          : idx === 1
                          ? 'bg-slate-400'
                          : 'bg-amber-600'
                      }`}
                    >
                      {user.rank}
                    </span>
                  )}
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-[#151E23] truncate group-hover:text-[#1B59F8] transition-colors">
                    {user.name}
                  </span>
                  <span className="text-xs text-[#808080] font-medium truncate">
                    {user.points} Points
                    {user.accuracy ? ` - ${user.accuracy}% Correct` : ''}
                  </span>
                </div>
              </div>

              {/* Right: Rank Number + Trend Indicator */}
              <div className="flex items-center gap-2.5 shrink-0 pl-3">
                <span className="rank-text text-base font-semibold text-[#686873]">
                  {user.rank}
                </span>

                <div className="w-3.5 flex items-center justify-center">
                  {user.trend === 'up' ? (
                    <TrendUpIcon className="w-3 h-3 text-[#1FE08F]" />
                  ) : (
                    <TrendDownIcon className="w-3 h-3 text-[#FF3E13]" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Action */}
        <div className="border-t border-[#EFF0F6] bg-gray-50/30">
          <button
            onClick={onOpenFullUserLeaderboard}
            className="w-full py-4 text-center text-sm font-semibold text-gray-500 hover:text-[#1B59F8] hover:bg-gray-50 transition-all cursor-pointer"
          >
            View full leaderboard
          </button>
        </div>
      </div>

      {/* Groups Leaderboard Card */}
      <div className="bg-white border border-[#EFF0F6] rounded-[20px] shadow-2xs hover:border-gray-300 transition-all flex flex-col justify-between overflow-hidden">
        <div className="p-6 pb-4 border-b border-[#EFF0F6]">
          <h3 className="text-sm md:text-base font-semibold text-[#151E23] tracking-tight">
            Groups Leaderboard
          </h3>
        </div>

        {/* 10 Group Rows */}
        <div className="divide-y divide-[#EFF0F6]/60">
          {groups.slice(0, 10).map((group) => (
            <div
              key={group.rank}
              onMouseEnter={(e) => handleRowHover(e, true)}
              onMouseLeave={(e) => handleRowHover(e, false)}
              className="leaderboard-row flex items-center justify-between px-6 py-[15px] transition-colors group cursor-pointer"
            >
              {/* Left: Group Name + Score / User */}
              <div className="flex flex-col min-w-0 pr-3">
                <span className="text-sm font-semibold text-[#151E23] truncate group-hover:text-[#1B59F8] transition-colors">
                  {group.name}
                </span>
                <span className="text-xs text-[#808080] font-medium truncate">
                  {group.pointsPerUser} Points / User
                  {group.accuracy ? ` - ${group.accuracy}% Correct` : ''}
                </span>
              </div>

              {/* Right: Rank Number + Trend Indicator */}
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="rank-text text-base font-semibold text-[#686873]">
                  {group.rank}
                </span>

                <div className="w-3.5 flex items-center justify-center">
                  {group.trend === 'up' ? (
                    <TrendUpIcon className="w-3 h-3 text-[#1FE08F]" />
                  ) : (
                    <TrendDownIcon className="w-3 h-3 text-[#FF3E13]" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Action */}
        <div className="border-t border-[#EFF0F6] bg-gray-50/30">
          <button
            onClick={onOpenFullGroupLeaderboard}
            className="w-full py-4 text-center text-sm font-semibold text-gray-500 hover:text-[#1B59F8] hover:bg-gray-50 transition-all cursor-pointer"
          >
            View full leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};
