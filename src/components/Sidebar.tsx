import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ReportsIcon,
  LibraryIcon,
  PeopleIcon,
  ActivitiesIcon,
  GetStartedIcon,
  SettingsIcon,
} from "./Icons";
import { TeslaLogo } from "./TeslaLogo";
import { StorageService } from "../services/storage";
import { AuthUser } from "../types";
import { X, ChevronRight, LogOut, Globe, Check } from "lucide-react";

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onNavigatePublic?: (page: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onNavigatePublic,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const [currentUser, setCurrentUser] = useState<AuthUser>(
    StorageService.getCurrentUser(),
  );
  const [counts, setCounts] = useState({
    courses: 6,
    people: 10,
    activities: 6,
  });
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const refreshData = () => {
    setCurrentUser(StorageService.getCurrentUser());
    setCounts({
      courses: StorageService.getCourses().length,
      people: StorageService.getPeople().length,
      activities: StorageService.getActivities().length,
    });
  };

  useEffect(() => {
    refreshData();
    const handleStorage = () => refreshData();
    window.addEventListener("tesla_storage_updated", handleStorage);
    return () =>
      window.removeEventListener("tesla_storage_updated", handleStorage);
  }, []);

  const mainNavItems = [
    { id: "reports", label: "Reports", icon: ReportsIcon, count: "60" },
    {
      id: "library",
      label: "Library",
      icon: LibraryIcon,
      count: String(counts.courses),
    },
    {
      id: "people",
      label: "People",
      icon: PeopleIcon,
      count: String(counts.people),
    },
    {
      id: "activities",
      label: "Activities",
      icon: ActivitiesIcon,
      count: String(counts.activities),
    },
  ];

  const supportNavItems = [
    { id: "get-started", label: "Get Started", icon: GetStartedIcon },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  const handleLogout = () => {
    StorageService.logout();
    if (onNavigatePublic) {
      onNavigatePublic("landing");
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between bg-white select-none">
      {/* Top Section */}
      <div className="p-6 pb-2">
        {/* Brand / Logo */}
        <div className="flex items-center justify-between pb-6 mb-2">
          <div
            onClick={() => {
              if (onNavigatePublic) onNavigatePublic("landing");
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <TeslaLogo className="h-4" />
          </div>

          {/* Close button on mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Main Nav Items */}
        <nav
          className="[&>button]:cursor-pointer space-y-1.5"
          aria-label="Main Navigation"
        >
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? "text-[#1B59F8] bg-[#1B59F8]/8 font-semibold"
                    : "text-[#4A5568] hover:text-[#151E23] hover:bg-gray-50"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 top-2 bottom-2 w-1 bg-[#1B59F8] rounded-r-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                <div className="flex items-center gap-3.5">
                  <span
                    className={`transition-colors ${
                      isActive
                        ? "text-[#1B59F8]"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.count && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      isActive
                        ? "bg-[#1B59F8]/15 text-[#1B59F8]"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Section Divider & Support Heading */}
        <div className="pt-8 pb-3">
          <div className="px-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Support
          </div>
        </div>

        {/* Support Nav Items */}
        <nav
          className="[&>button]:cursor-pointer space-y-1.5"
          aria-label="Support Navigation"
        >
          {supportNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "text-[#1B59F8] bg-[#1B59F8]/8 font-semibold"
                    : "text-[#4A5568] hover:text-[#151E23] hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`transition-colors ${
                      isActive
                        ? "text-[#1B59F8]"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <span>{item.label}</span>
                </div>
              </motion.button>
            );
          })}
        </nav>

        {/* Quick Link to Public Site */}
        {onNavigatePublic && (
          <div className="pt-6">
            <button
              onClick={() => onNavigatePublic("landing")}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="cursor-pointer">Landing &amp; About Us</span>
            </button>
          </div>
        )}
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-[#EFF0F6] relative">
        <div
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
        >
          <div className="relative">
            <img
              src={currentUser.avatarUrl || "/images/Photo_34x34.png"}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    currentUser.name,
                  )}&background=EFF0F6&color=151E23&bold=true`;
              }}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#1B59F8] transition-colors">
              {currentUser.name}
            </span>
            <span className="text-xs text-gray-400 truncate">
              {currentUser.email}
            </span>
          </div>

          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>

        {/* Profile Popover Menu */}
        <AnimatePresence>
          {isProfileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute left-4 right-4 bottom-full mb-2 bg-white rounded-2xl shadow-xl border border-[#EFF0F6] p-2 z-30 space-y-1 text-xs"
            >
              <div className="px-3 py-2 border-b border-gray-100">
                <span className="font-bold text-gray-900 block truncate">
                  {currentUser.name}
                </span>
                <span className="text-gray-400 block text-[11px] truncate">
                  {currentUser.role}
                </span>
              </div>

              <button
                onClick={() => {
                  onSelectTab("settings");
                  setIsProfileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
              >
                Edit Profile Settings
              </button>

              <button
                onClick={() => {
                  if (onNavigatePublic) onNavigatePublic("about");
                  setIsProfileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
              >
                About Tesla Academy
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 font-medium transition-colors flex items-center justify-between"
              >
                <span>Sign Out</span>
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-60 shrink-0 h-screen sticky top-0 border-r border-[#EFF0F6] bg-white z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpenMobile && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 260 }}
              className="relative w-70 max-w-[80vw] h-full bg-white shadow-2xl z-10"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
