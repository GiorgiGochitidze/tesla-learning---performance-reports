import { useState, useMemo, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { FiltersBar } from "./components/FiltersBar";
import { MetricCards } from "./components/MetricCards";
import { ActivityChart } from "./components/ActivityChart";
import { TopicsSection } from "./components/TopicsSection";
import { LeaderboardsSection } from "./components/LeaderboardsSection";
import { FullLeaderboardModal } from "./components/FullLeaderboardModal";
import { TopicDetailsModal } from "./components/TopicDetailsModal";
import { DownloadReportModal } from "./components/DownloadReportModal";
import { LandingPage } from "./components/public/LandingPage";
import { AboutPage } from "./components/public/AboutPage";
import { AuthPage } from "./components/public/AuthPage";
import { NotFoundPage } from "./components/public/NotFoundPage";
import { LibraryPage } from "./components/pages/LibraryPage";
import { PeoplePage } from "./components/pages/PeoplePage";
import { ActivitiesPage } from "./components/pages/ActivitiesPage";
import { GetStartedPage } from "./components/pages/GetStartedPage";
import { SettingsPage } from "./components/pages/SettingsPage";
import { StorageService } from "./services/storage";
import {
  initialMetrics,
  monthlyActivityData,
  weakestTopics,
  strongestTopics,
  groupLeaderboard,
} from "./data/mockData";
import { FilterState, TopicItem, AuthUser, UserLeaderboardItem } from "./types";

// Initialize localhost storage
StorageService.init();

export default function App() {
  const validPages = [
    "landing",
    "about",
    "auth",
    "reports",
    "library",
    "people",
    "activities",
    "get-started",
    "settings",
  ];

  // 1. Extract page route from browser URL (e.g., "/about" -> "about")
  const getPageFromPath = (): string => {
    const path = window.location.pathname.replace(/^\/+|\/+$/g, ""); // strip leading/trailing slashes
    if (!path) {
      // Root URL path "/" -> return saved active tab or fallback to 'landing'
      return StorageService.getLastTab();
    }
    return path;
  };

  // 2. Initialize current page state from address bar URL
  const [currentPage, setCurrentPage] = useState<string>(() =>
    getPageFromPath(),
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser>(
    StorageService.getCurrentUser(),
  );
  const [people, setPeople] = useState<UserLeaderboardItem[]>(
    StorageService.getPeople(),
  );

  // 3. Navigation handler: updates state, persists tab, and updates browser address bar URL
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    StorageService.setLastTab(page);

    // Update browser URL bar without triggering a page reload
    const targetPath = page === "landing" ? "/" : `/${page}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, "", targetPath);
    }
  };

  // 4. Handle browser Back / Forward history button clicks
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getPageFromPath());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Filter state for Reports
  const [filters, setFilters] = useState<FilterState>({
    timeframe: "All-time",
    people: "All",
    topic: "All",
  });

  // Modals state
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [leaderboardModalTab, setLeaderboardModalTab] = useState<
    "users" | "groups"
  >("users");
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Sync state with Localhost storage changes
  useEffect(() => {
    const handleStorageUpdate = () => {
      setCurrentUser(StorageService.getCurrentUser());
      setPeople(StorageService.getPeople());
    };
    window.addEventListener("tesla_storage_updated", handleStorageUpdate);
    return () =>
      window.removeEventListener("tesla_storage_updated", handleStorageUpdate);
  }, []);

  // Dynamically reactive data based on filter selection
  const dynamicMetrics = useMemo(() => {
    if (filters.timeframe === "Last 30 Days") {
      return initialMetrics.map((m) => {
        if (m.id === "active_users")
          return {
            ...m,
            value: `${Math.min(people.length, 24)}/${people.length}`,
          };
        if (m.id === "questions_answered") return { ...m, value: "1,142" };
        if (m.id === "current_knowledge") return { ...m, value: "88%" };
        return m;
      });
    }
    if (filters.people === "West Coast Managers") {
      return initialMetrics.map((m) => {
        if (m.id === "active_users") return { ...m, value: "18/18" };
        if (m.id === "current_knowledge") return { ...m, value: "92%" };
        if (m.id === "knowledge_gain") return { ...m, value: "+38%" };
        return m;
      });
    }
    if (filters.topic === "Food Safety") {
      return initialMetrics.map((m) => {
        if (m.id === "current_knowledge") return { ...m, value: "74%" };
        if (m.id === "questions_answered") return { ...m, value: "840" };
        return m;
      });
    }

    if (filters.people === "Engineering Team") {
      return initialMetrics.map((m) => {
        if (m.id === "active_users") return { ...m, value: "12/12" };
        if (m.id === "current_knowledge") return { ...m, value: "94%" };
        return m;
      });
    }

    return initialMetrics.map((m) => {
      if (m.id === "active_users")
        return {
          ...m,
          value: `${Math.min(people.length, 27)}/${people.length}`,
        };
      return m;
    });
  }, [filters, people]);

  const dynamicActivityData = useMemo(() => {
    if (filters.timeframe === "Last 30 Days") {
      return monthlyActivityData.map((d) => ({
        ...d,
        value: Math.round(d.value * 0.85),
      }));
    }
    return monthlyActivityData;
  }, [filters]);

  // Page titles lookup
  const getPageTitle = (page: string) => {
    switch (page) {
      case "reports":
        return "Reports";
      case "library":
        return "Training Library";
      case "people":
        return "People & Workforce";
      case "activities":
        return "Activity Ledger";
      case "get-started":
        return "Get Started";
      case "settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  // 1. Landing Page
  if (currentPage === "landing") {
    return (
      <LandingPage
        onNavigate={(page) => handleNavigate(page)}
        currentUser={currentUser}
      />
    );
  }

  // 2. About Us Page
  if (currentPage === "about") {
    return (
      <AboutPage
        onNavigate={(page) => handleNavigate(page)}
        currentUser={currentUser}
      />
    );
  }

  // 3. Sign In / Sign Up Page
  if (currentPage === "auth") {
    return (
      <AuthPage
        onNavigate={(page) => handleNavigate(page)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          handleNavigate("reports");
        }}
      />
    );
  }

  // 4. Custom 404 Guard for Invalid Paths/URLs
  if (!validPages.includes(currentPage)) {
    return <NotFoundPage onNavigate={(page) => handleNavigate(page)} />;
  }

  // 5. Main Dashboard Layout (Reports, Library, People, Activities, Get Started, Settings)
  return (
    <div className="min-h-screen bg-[#F8F9FD] text-[#151E23] flex flex-col lg:flex-row antialiased">
      {/* Left Navigation Sidebar */}
      <Sidebar
        currentTab={currentPage}
        onSelectTab={(tab) => handleNavigate(tab)}
        onNavigatePublic={(page) => handleNavigate(page)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          title={getPageTitle(currentPage)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onDownloadClick={() => setIsDownloadModalOpen(true)}
          onNavigatePublic={(page) => handleNavigate(page)}
        />

        {/* Dashboard Content Container */}
        <main className="flex-1 max-w-300 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* TAB: Reports Page */}
          {currentPage === "reports" && (
            <div className="space-y-6">
              {/* Filter Bar */}
              <section aria-label="Filters">
                <FiltersBar filters={filters} onFilterChange={setFilters} />
              </section>

              {/* Section 1: KPI Metrics & Activity Bar Chart */}
              <section
                aria-label="Overview Metrics and Activity"
                className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6 items-stretch"
              >
                {/* Left: 6 Metric Cards */}
                <div className="xl:col-span-6 flex flex-col justify-between">
                  <MetricCards metrics={dynamicMetrics} />
                </div>

                {/* Right: Activity Chart */}
                <div className="xl:col-span-6 flex flex-col">
                  <ActivityChart data={dynamicActivityData} />
                </div>
              </section>

              {/* Section 2: Weakest Topics & Strongest Topics */}
              <section aria-label="Topic Strengths and Weaknesses">
                <TopicsSection
                  weakest={weakestTopics}
                  strongest={strongestTopics}
                  onSelectTopic={(topic) => setSelectedTopic(topic)}
                />
              </section>

              {/* Section 3: User Leaderboard & Groups Leaderboard */}
              <section aria-label="Leaderboards">
                <LeaderboardsSection
                  users={people}
                  groups={groupLeaderboard}
                  onOpenFullUserLeaderboard={() => {
                    setLeaderboardModalTab("users");
                    setIsLeaderboardModalOpen(true);
                  }}
                  onOpenFullGroupLeaderboard={() => {
                    setLeaderboardModalTab("groups");
                    setIsLeaderboardModalOpen(true);
                  }}
                />
              </section>
            </div>
          )}

          {/* TAB: Library Page */}
          {currentPage === "library" && <LibraryPage />}

          {/* TAB: People Page */}
          {currentPage === "people" && <PeoplePage />}

          {/* TAB: Activities Page */}
          {currentPage === "activities" && <ActivitiesPage />}

          {/* TAB: Get Started Page */}
          {currentPage === "get-started" && (
            <GetStartedPage onNavigateTab={(tab) => handleNavigate(tab)} />
          )}

          {/* TAB: Settings Page */}
          {currentPage === "settings" && <SettingsPage />}
        </main>
      </div>

      {/* Global Modals */}
      <FullLeaderboardModal
        isOpen={isLeaderboardModalOpen}
        onClose={() => setIsLeaderboardModalOpen(false)}
        defaultTab={leaderboardModalTab}
        users={people}
        groups={groupLeaderboard}
      />

      <TopicDetailsModal
        topic={selectedTopic}
        onClose={() => setSelectedTopic(null)}
      />

      <DownloadReportModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
}
