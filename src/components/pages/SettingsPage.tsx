import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { StorageService } from '../../services/storage';
import { AppSettings } from '../../types';
import {
  Save,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  User,
  Sliders,
  Bell,
  HardDrive,
  Download,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(StorageService.getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setSettings(StorageService.getSettings());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.updateSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleResetData = () => {
    if (
      confirm(
        'Warning: This will reset all localhost people, courses, activities, and settings back to default. Continue?'
      )
    ) {
      StorageService.resetAllData();
      setSettings(StorageService.getSettings());
      alert('Localhost database restored to default state.');
    }
  };

  const handleExportBackup = () => {
    const backup = {
      user: StorageService.getCurrentUser(),
      settings: StorageService.getSettings(),
      people: StorageService.getPeople(),
      courses: StorageService.getCourses(),
      activities: StorageService.getActivities(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tesla_academy_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div className="bg-white border border-[#EFF0F6] rounded-[20px] p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#151E23] tracking-tight">
            Account &amp; Platform Settings
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Configure corporate profile, training passing thresholds, and localhost data retention.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Saved to Localhost!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Details */}
        <div className="bg-white border border-[#EFF0F6] rounded-[20px] p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#EFF0F6]">
            <User className="w-4 h-4 text-[#1B59F8]" />
            <h3 className="text-sm font-semibold text-gray-900">
              User Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={settings.userName}
                onChange={(e) =>
                  setSettings({ ...settings, userName: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1B59F8]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Corporate Email
              </label>
              <input
                type="email"
                value={settings.userEmail}
                onChange={(e) =>
                  setSettings({ ...settings, userEmail: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1B59F8]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Job Title / Role
              </label>
              <input
                type="text"
                value={settings.userRole}
                onChange={(e) =>
                  setSettings({ ...settings, userRole: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1B59F8]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Company Entity
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) =>
                  setSettings({ ...settings, companyName: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1B59F8]"
              />
            </div>
          </div>
        </div>

        {/* Training Thresholds */}
        <div className="bg-white border border-[#EFF0F6] rounded-[20px] p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#EFF0F6]">
            <Sliders className="w-4 h-4 text-[#1B59F8]" />
            <h3 className="text-sm font-semibold text-gray-900">
              Assessment Standards
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Passing Grade Threshold ({settings.passingThreshold}%)
              </label>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={settings.passingThreshold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    passingThreshold: Number(e.target.value),
                  })
                }
                className="w-full accent-[#1B59F8] cursor-pointer"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Modules scoring beneath this threshold will be flagged in Weakest Topics.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Default Report Timeframe
              </label>
              <select
                value={settings.defaultTimeframe}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    defaultTimeframe: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1B59F8]"
              >
                <option value="All-time">All-time</option>
                <option value="This Month">This Month</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="This Quarter">This Quarter</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications & Automation */}
        <div className="bg-white border border-[#EFF0F6] rounded-[20px] p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#EFF0F6]">
            <Bell className="w-4 h-4 text-[#1B59F8]" />
            <h3 className="text-sm font-semibold text-gray-900">
              Notification Preferences
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 cursor-pointer">
              <div>
                <div className="font-semibold text-gray-900">
                  Email Notifications
                </div>
                <div className="text-[11px] text-gray-500">
                  Receive alerts when team members complete mandatory compliance modules
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    emailNotifications: e.target.checked,
                  })
                }
                className="rounded text-[#1B59F8] focus:ring-[#1B59F8] w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 cursor-pointer">
              <div>
                <div className="font-semibold text-gray-900">
                  Weekly Executive Digest
                </div>
                <div className="text-[11px] text-gray-500">
                  Summary email containing weekly knowledge lift and rank movements
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.weeklyDigest}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    weeklyDigest: e.target.checked,
                  })
                }
                className="rounded text-[#1B59F8] focus:ring-[#1B59F8] w-4 h-4"
              />
            </label>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1B59F8] hover:bg-[#1546C4] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* Localhost Storage Management Card */}
      <div className="bg-white border border-[#EFF0F6] rounded-[20px] p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#EFF0F6]">
          <HardDrive className="w-4 h-4 text-gray-700" />
          <h3 className="text-sm font-semibold text-gray-900">
            Localhost Data &amp; Backup
          </h3>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed">
          All data including leaderboards, user rosters, course catalogues, and activity audits are stored locally in browser storage. You can backup your data or reset to factory defaults.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export Localhost JSON Backup</span>
          </button>

          <button
            type="button"
            onClick={handleResetData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-600 text-xs font-semibold transition-colors ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Localhost Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
