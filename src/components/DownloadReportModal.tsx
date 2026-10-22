import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, Download, CheckCircle, Loader2 } from 'lucide-react';

interface DownloadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadReportModal: React.FC<DownloadReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [format, setFormat] = useState<'pdf' | 'csv' | 'xlsx'>('pdf');
  const [includeLeaderboards, setIncludeLeaderboards] = useState(true);
  const [includeTopicAnalysis, setIncludeTopicAnalysis] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

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
          className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#EFF0F6] overflow-hidden flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#EFF0F6] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1B59F8] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#151E23]">
                  Export Executive Report
                </h3>
                <p className="text-xs text-gray-500">
                  Download learning metrics and team performance data
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

          {/* Form */}
          <div className="p-6 space-y-5">
            {/* Format selection */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Export Format
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'pdf', label: 'PDF Summary', ext: '.pdf' },
                  { id: 'csv', label: 'CSV Data', ext: '.csv' },
                  { id: 'xlsx', label: 'Excel Sheet', ext: '.xlsx' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormat(item.id as 'pdf' | 'csv' | 'xlsx')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      format === item.id
                        ? 'border-[#1B59F8] bg-blue-50/50 text-[#1B59F8] font-semibold ring-1 ring-[#1B59F8]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <span className="block text-xs font-semibold">
                      {item.label}
                    </span>
                    <span className="block text-[10px] text-gray-400 mt-0.5">
                      {item.ext}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Checkbox inclusions */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Include Sections
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeLeaderboards}
                    onChange={(e) => setIncludeLeaderboards(e.target.checked)}
                    className="rounded text-[#1B59F8] focus:ring-[#1B59F8]"
                  />
                  <span>Full User &amp; Groups Leaderboard Rankings</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeTopicAnalysis}
                    onChange={(e) => setIncludeTopicAnalysis(e.target.checked)}
                    className="rounded text-[#1B59F8] focus:ring-[#1B59F8]"
                  />
                  <span>Weakest &amp; Strongest Topics Breakdown</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-gray-50 border-t border-[#EFF0F6] flex items-center justify-end gap-2.5">
            <button
              onClick={onClose}
              disabled={isDownloading}
              className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading || isSuccess}
              className="flex items-center gap-2 px-5 py-2 bg-[#1B59F8] hover:bg-[#1546C4] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-70"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
