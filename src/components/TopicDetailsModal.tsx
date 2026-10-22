import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TopicItem } from '../types';
import { X, BookOpen, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface TopicDetailsModalProps {
  topic: TopicItem | null;
  onClose: () => void;
}

export const TopicDetailsModal: React.FC<TopicDetailsModalProps> = ({
  topic,
  onClose,
}) => {
  if (!topic) return null;

  const isWeakest = topic.type === 'weakest';

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
          className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#EFF0F6] overflow-hidden flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#EFF0F6] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={topic.imageUrl}
                alt={topic.title}
                className="w-12 h-8 rounded-lg object-cover ring-1 ring-gray-200"
              />
              <div>
                <h3 className="text-base font-bold text-[#151E23]">
                  {topic.title}
                </h3>
                <span
                  className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isWeakest
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-emerald-50 text-emerald-600'
                  }`}
                >
                  {isWeakest ? 'Needs Focus' : 'High Competency'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 divide-x divide-gray-100 bg-gray-50/70 py-3.5 px-4 text-center border-b border-gray-100">
            <div>
              <span className="text-xs text-gray-400 block font-medium">
                Accuracy
              </span>
              <span className="text-base font-bold text-gray-900">
                {topic.percentage}%
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block font-medium">
                Questions
              </span>
              <span className="text-base font-bold text-gray-900">
                {topic.questionsCount || 40}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block font-medium">
                Avg. Time
              </span>
              <span className="text-base font-bold text-gray-900">
                {topic.avgTime || '2m 10s'}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5 text-sm">
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Curriculum Breakdown
              </h4>
              <p className="text-gray-600 text-xs leading-relaxed">
                Covers critical operational procedures, regulatory protocols, and best practices for
                manufacturing facilities and customer operations.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                {isWeakest ? (
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-xs font-semibold text-gray-900">
                    {isWeakest
                      ? 'Recommended Retraining Micro-Module'
                      : 'Mastery Maintained'}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {isWeakest
                      ? 'Schedule a 5-minute refresher quiz for units scoring below 60%.'
                      : 'Employees demonstrate compliant handling and high retention rates.'}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                Level: {topic.difficulty || 'Intermediate'}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                Updated: October 2026
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t border-[#EFF0F6] flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#1B59F8] hover:bg-[#1546C4] text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Close Details
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
