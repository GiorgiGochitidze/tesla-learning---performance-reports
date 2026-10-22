import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DropdownChevron } from './Icons';
import { Check } from 'lucide-react';
import { FilterState } from '../types';

interface FiltersBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  filters,
  onFilterChange,
}) => {
  const [openDropdown, setOpenDropdown] = useState<'timeframe' | 'people' | 'topic' | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const timeframeOptions = [
    'All-time',
    'Last 30 Days',
    'This Quarter',
    'This Year',
    'Custom Range',
  ];

  const peopleOptions = [
    'All',
    'West Coast Managers',
    'District Managers',
    'Sales Leadership',
    'New Hires',
    'Engineering Team',
  ];

  const topicOptions = [
    'All',
    'Food Safety',
    'Compliance Basics',
    'Company Networking',
    'Covid Protocols',
    'Cyber Security',
  ];

  const handleSelect = (key: keyof FilterState, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
    setOpenDropdown(null);
  };

  return (
    <div ref={barRef} className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {/* Timeframe Dropdown */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.99 }}
            onClick={() =>
              setOpenDropdown(openDropdown === 'timeframe' ? null : 'timeframe')
            }
            className={`w-full h-12.25 px-5 flex items-center justify-between rounded-2xl bg-white border transition-all text-left cursor-pointer ${
              openDropdown === 'timeframe'
                ? 'border-[#1B59F8] shadow-sm ring-2 ring-[#1B59F8]/10'
                : 'border-[#EFF0F6] hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-1.5 text-sm md:text-base font-medium truncate">
              <span className="text-gray-500">Timeframe:</span>
              <span className="text-[#151E23] font-semibold truncate">
                {filters.timeframe}
              </span>
            </div>
            <motion.div
              animate={{ rotate: openDropdown === 'timeframe' ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-gray-500 shrink-0 ml-2"
            >
              <DropdownChevron className="w-3 h-3" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {openDropdown === 'timeframe' && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-[#EFF0F6] py-1.5 z-30 overflow-hidden"
              >
                {timeframeOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelect('timeframe', opt)}
                    className="w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <span
                      className={
                        filters.timeframe === opt
                          ? 'font-semibold text-[#1B59F8]'
                          : 'text-gray-700'
                      }
                    >
                      {opt}
                    </span>
                    {filters.timeframe === opt && (
                      <Check className="w-4 h-4 text-[#1B59F8]" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* People Dropdown */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.99 }}
            onClick={() =>
              setOpenDropdown(openDropdown === 'people' ? null : 'people')
            }
            className={`w-full h-12.25 px-5 flex items-center justify-between rounded-2xl bg-white border transition-all text-left cursor-pointer ${
              openDropdown === 'people'
                ? 'border-[#1B59F8] shadow-sm ring-2 ring-[#1B59F8]/10'
                : 'border-[#EFF0F6] hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-1.5 text-sm md:text-base font-medium truncate">
              <span className="text-gray-500">People:</span>
              <span className="text-[#151E23] font-semibold truncate">
                {filters.people}
              </span>
            </div>
            <motion.div
              animate={{ rotate: openDropdown === 'people' ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-gray-500 shrink-0 ml-2"
            >
              <DropdownChevron className="w-3 h-3" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {openDropdown === 'people' && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-[#EFF0F6] py-1.5 z-30 overflow-hidden"
              >
                {peopleOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelect('people', opt)}
                    className="w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <span
                      className={
                        filters.people === opt
                          ? 'font-semibold text-[#1B59F8]'
                          : 'text-gray-700'
                      }
                    >
                      {opt}
                    </span>
                    {filters.people === opt && (
                      <Check className="w-4 h-4 text-[#1B59F8]" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Topic Dropdown */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.99 }}
            onClick={() =>
              setOpenDropdown(openDropdown === 'topic' ? null : 'topic')
            }
            className={`w-full h-12.25 px-5 flex items-center justify-between rounded-2xl bg-white border transition-all text-left cursor-pointer ${
              openDropdown === 'topic'
                ? 'border-[#1B59F8] shadow-sm ring-2 ring-[#1B59F8]/10'
                : 'border-[#EFF0F6] hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-1.5 text-sm md:text-base font-medium truncate">
              <span className="text-gray-500">Topic:</span>
              <span className="text-[#151E23] font-semibold truncate">
                {filters.topic}
              </span>
            </div>
            <motion.div
              animate={{ rotate: openDropdown === 'topic' ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-gray-500 shrink-0 ml-2"
            >
              <DropdownChevron className="w-3 h-3" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {openDropdown === 'topic' && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-[#EFF0F6] py-1.5 z-30 overflow-hidden"
              >
                {topicOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelect('topic', opt)}
                    className="w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <span
                      className={
                        filters.topic === opt
                          ? 'font-semibold text-[#1B59F8]'
                          : 'text-gray-700'
                      }
                    >
                      {opt}
                    </span>
                    {filters.topic === opt && (
                      <Check className="w-4 h-4 text-[#1B59F8]" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
