import {
  AuthUser,
  UserLeaderboardItem,
  GroupLeaderboardItem,
  CourseItem,
  ActivityLogItem,
  AppSettings,
  OnboardingTask,
  MetricItem,
} from "../types";
import {
  initialMetrics,
  userLeaderboard,
  groupLeaderboard,
} from "../data/mockData";

const STORAGE_KEYS = {
  CURRENT_USER: "tesla_reports_current_user",
  ALL_ACCOUNTS: "tesla_reports_accounts",
  PEOPLE: "tesla_reports_people",
  GROUPS: "tesla_reports_groups",
  COURSES: "tesla_reports_courses",
  ACTIVITIES: "tesla_reports_activities",
  SETTINGS: "tesla_reports_settings",
  ONBOARDING: "tesla_reports_onboarding",
  METRICS: "tesla_reports_metrics",
  LAST_TAB: "tesla_reports_last_tab",
};

// Default seed data
const DEFAULT_USER: AuthUser = {
  id: "usr-sam-wheeler",
  name: "Sam Wheeler",
  email: "samwheeler@example.com",
  role: "Senior Operations Director",
  avatarUrl: "/images/Photo_34x34.png",
  loggedIn: true,
};

const DEFAULT_SETTINGS: AppSettings = {
  userName: "Sam Wheeler",
  userEmail: "samwheeler@example.com",
  userRole: "Senior Operations Director",
  companyName: "Tesla Inc.",
  defaultTimeframe: "All-time",
  passingThreshold: 80,
  emailNotifications: true,
  weeklyDigest: true,
  autoEnrollNewHires: true,
};

const DEFAULT_COURSES: CourseItem[] = [
  {
    id: "course-1",
    title: "Food Safety & Facility Sanitation",
    category: "Workplace Safety",
    description:
      "Guidelines on sterile handling, chemical storage, and cross-contamination prevention in testing facilities.",
    duration: "25 min",
    questionsCount: 42,
    difficulty: "Intermediate",
    passingGrade: 80,
    enrolledCount: 120,
    completedCount: 88,
    imageUrl: "/images/Rectangle_2370_49x32.png",
    status: "active",
  },
  {
    id: "course-2",
    title: "Compliance Basics & ISO Procedures",
    category: "Regulatory",
    description:
      "Comprehensive regulatory framework, documentation standards, and OSHA compliance criteria.",
    duration: "40 min",
    questionsCount: 65,
    difficulty: "Advanced",
    passingGrade: 85,
    enrolledCount: 95,
    completedCount: 49,
    imageUrl: "/images/Rectangle_2371_49x32.png",
    status: "active",
  },
  {
    id: "course-3",
    title: "Company Networking & Secure Protocols",
    category: "IT & Infrastructure",
    description:
      "Internal VPN setup, perimeter security, and connected diagnostic workstation guidelines.",
    duration: "15 min",
    questionsCount: 38,
    difficulty: "Beginner",
    passingGrade: 75,
    enrolledCount: 140,
    completedCount: 50,
    imageUrl: "/images/Rectangle_2372_49x32.png",
    status: "active",
  },
  {
    id: "course-4",
    title: "Covid & Health Hazard Protocols",
    category: "Health & Safety",
    description:
      "Emergency containment measures, quarantine thresholds, and health triage guidelines.",
    duration: "20 min",
    questionsCount: 30,
    difficulty: "Beginner",
    passingGrade: 90,
    enrolledCount: 180,
    completedCount: 171,
    imageUrl: "/images/Rectangle_2370_51x32.png",
    status: "active",
  },
  {
    id: "course-5",
    title: "Cyber Security Basics & Phishing Defense",
    category: "Information Security",
    description:
      "Zero-trust authentication, credential hygiene, and simulated social engineering attack avoidance.",
    duration: "30 min",
    questionsCount: 54,
    difficulty: "Intermediate",
    passingGrade: 85,
    enrolledCount: 165,
    completedCount: 152,
    imageUrl: "/images/Rectangle_2371_51x32.png",
    status: "active",
  },
  {
    id: "course-6",
    title: "Social Media & Brand Confidentiality",
    category: "Corporate Policy",
    description:
      "Protection of unreleased Tesla vehicle designs, gigafactory media policies, and public representation.",
    duration: "18 min",
    questionsCount: 28,
    difficulty: "Beginner",
    passingGrade: 80,
    enrolledCount: 150,
    completedCount: 134,
    imageUrl: "/images/Rectangle_2372_51x32.png",
    status: "active",
  },
];

const DEFAULT_ACTIVITIES: ActivityLogItem[] = [
  {
    id: "act-1",
    userId: "1",
    userName: "Jesse Thomas",
    userAvatar: "/images/Photo___Thomas_42x42_6.png",
    topicTitle: "Cyber Security Basics & Phishing Defense",
    action: "completed_quiz",
    score: 98,
    status: "Completed",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    formattedTime: "12 minutes ago",
  },
  {
    id: "act-2",
    userId: "2",
    userName: "Thisal Mathiyazhagan",
    userAvatar: "/images/Photo___Thomas_42x42_7.png",
    topicTitle: "Compliance Basics & ISO Procedures",
    action: "completed_quiz",
    score: 89,
    status: "Completed",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    formattedTime: "45 minutes ago",
  },
  {
    id: "act-3",
    userId: "3",
    userName: "Helen Chuang",
    userAvatar: "/images/Photo___Thomas_42x42_8.png",
    topicTitle: "Food Safety & Facility Sanitation",
    action: "started_course",
    score: 88,
    status: "In Progress",
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    formattedTime: "1.5 hours ago",
  },
  {
    id: "act-4",
    userId: "4",
    userName: "Lura Silverman",
    userAvatar: "/images/Photo___Thomas_42x42_9.png",
    topicTitle: "Social Media & Brand Confidentiality",
    action: "completed_quiz",
    score: 92,
    status: "Completed",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    formattedTime: "3 hours ago",
  },
  {
    id: "act-5",
    userId: "8",
    userName: "Adrian Lu",
    userAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    topicTitle: "Company Networking & Secure Protocols",
    action: "started_course",
    status: "In Progress",
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    formattedTime: "4 hours ago",
  },
  {
    id: "act-6",
    userId: "usr-sam-wheeler",
    userName: "Sam Wheeler",
    userAvatar: "/images/Photo_34x34.png",
    topicTitle: "Executive Compliance Briefing",
    action: "completed_quiz",
    score: 100,
    status: "Completed",
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    formattedTime: "6 hours ago",
  },
];

const DEFAULT_ONBOARDING: OnboardingTask[] = [
  {
    id: "task-1",
    title: "Sign In and Complete User Profile",
    description:
      "Verify your corporate email and configure job title and department.",
    completed: true,
    targetTab: "settings",
    points: 50,
  },
  {
    id: "task-2",
    title: "Review Executive Reports & Knowledge KPIs",
    description:
      "Analyze current baseline knowledge and active group benchmarks.",
    completed: true,
    targetTab: "reports",
    points: 100,
  },
  {
    id: "task-3",
    title: "Complete First Assessment Quiz in Library",
    description:
      "Test your knowledge on Cyber Security or Food Safety fundamentals.",
    completed: false,
    targetTab: "library",
    points: 150,
  },
  {
    id: "task-4",
    title: "Enroll Team Member or Review Department Roster",
    description:
      "Add a new member to the People directory and assign their department.",
    completed: false,
    targetTab: "people",
    points: 100,
  },
  {
    id: "task-5",
    title: "Inspect Live Activity Feed & Audit Trail",
    description: "Monitor team quiz submissions and real-time pass/fail rates.",
    completed: false,
    targetTab: "activities",
    points: 75,
  },
];

// Helper to safely read from localStorage
function getLocal<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    if (!val) return fallback;
    return JSON.parse(val) as T;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

// Helper to safely write to localStorage
function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Dispatch custom event so listeners within the app update immediately
    window.dispatchEvent(new Event("tesla_storage_updated"));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

export const StorageService = {
  // Initialization: seeds initial data on first visit
  init(): void {
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      setLocal(STORAGE_KEYS.CURRENT_USER, DEFAULT_USER);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      setLocal(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PEOPLE)) {
      setLocal(STORAGE_KEYS.PEOPLE, userLeaderboard);
    }
    if (!localStorage.getItem(STORAGE_KEYS.GROUPS)) {
      setLocal(STORAGE_KEYS.GROUPS, groupLeaderboard);
    }
    if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
      setLocal(STORAGE_KEYS.COURSES, DEFAULT_COURSES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
      setLocal(STORAGE_KEYS.ACTIVITIES, DEFAULT_ACTIVITIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ONBOARDING)) {
      setLocal(STORAGE_KEYS.ONBOARDING, DEFAULT_ONBOARDING);
    }
    if (!localStorage.getItem(STORAGE_KEYS.METRICS)) {
      setLocal(STORAGE_KEYS.METRICS, initialMetrics);
    }
  },

  // Active Tab Persistence
  getLastTab(): string {
    try {
      const user = this.getCurrentUser();
      const savedTab = localStorage.getItem(STORAGE_KEYS.LAST_TAB);
      if (user && user.loggedIn && savedTab) {
        return savedTab;
      }
      return "landing";
    } catch {
      return "landing";
    }
  },

  setLastTab(tab: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_TAB, tab);
    } catch (e) {
      console.error("Error saving last tab to localStorage:", e);
    }
  },

  // Auth & Current User
  getCurrentUser(): AuthUser {
    return getLocal<AuthUser>(STORAGE_KEYS.CURRENT_USER, DEFAULT_USER);
  },

  login(email: string, _password?: string): AuthUser {
    const people = this.getPeople();
    const existing = people.find(
      (p) => p.email?.toLowerCase() === email.toLowerCase(),
    );

    const user: AuthUser = {
      id: existing?.id || "usr-" + Date.now(),
      name:
        existing?.name ||
        email
          .split("@")[0]
          .replace(".", " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
      email: email,
      role: existing?.role || "Staff Member",
      avatarUrl: existing?.avatarUrl || "/images/Photo_34x34.png",
      loggedIn: true,
    };

    setLocal(STORAGE_KEYS.CURRENT_USER, user);
    return user;
  },

  signup(name: string, email: string, role: string): AuthUser {
    const user: AuthUser = {
      id: "usr-" + Date.now(),
      name: name,
      email: email,
      role: role || "Production Associate",
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1B59F8&color=ffffff&bold=true`,
      loggedIn: true,
    };

    // Save as current user
    setLocal(STORAGE_KEYS.CURRENT_USER, user);

    // Also add to people roster
    const people = this.getPeople();
    const newPerson: UserLeaderboardItem = {
      rank: people.length + 1,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: "Engineering",
      points: 50,
      accuracy: 95,
      trend: "up",
      avatarUrl: user.avatarUrl,
      completedQuizzes: 1,
      status: "active",
      joinedDate: "Just now",
    };
    people.unshift(newPerson);
    setLocal(STORAGE_KEYS.PEOPLE, people);

    // Log activity
    this.logActivity({
      id: "act-" + Date.now(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatarUrl,
      topicTitle: "New User Registration",
      action: "joined_platform",
      status: "Completed",
      timestamp: new Date().toISOString(),
      formattedTime: "Just now",
    });

    return user;
  },

  logout(): void {
    const currentUser = this.getCurrentUser();
    setLocal(STORAGE_KEYS.CURRENT_USER, { ...currentUser, loggedIn: false });
    localStorage.removeItem(STORAGE_KEYS.LAST_TAB);
  },

  updateCurrentUser(updates: Partial<AuthUser>): AuthUser {
    const current = this.getCurrentUser();
    const updated = { ...current, ...updates };
    setLocal(STORAGE_KEYS.CURRENT_USER, updated);
    return updated;
  },

  // People Management (Roster)
  getPeople(): UserLeaderboardItem[] {
    return getLocal<UserLeaderboardItem[]>(
      STORAGE_KEYS.PEOPLE,
      userLeaderboard,
    );
  },

  addPerson(person: Omit<UserLeaderboardItem, "rank">): UserLeaderboardItem {
    const list = this.getPeople();
    const newPerson: UserLeaderboardItem = {
      ...person,
      rank: list.length + 1,
      id: person.id || "usr-" + Date.now(),
      points: person.points || 0,
      trend: "up",
      status: person.status || "active",
      joinedDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      avatarUrl:
        person.avatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=EFF0F6&color=151E23&bold=true`,
    };

    const updated = [newPerson, ...list].map((p, idx) => ({
      ...p,
      rank: idx + 1,
    }));
    setLocal(STORAGE_KEYS.PEOPLE, updated);

    // Also update Onboarding task 4 (Enroll Team Member) if not done
    this.completeOnboardingTask("task-4");

    return newPerson;
  },

  deletePerson(nameOrId: string): void {
    const list = this.getPeople();
    const filtered = list.filter(
      (p) => p.name !== nameOrId && p.id !== nameOrId,
    );
    const reindexed = filtered.map((p, idx) => ({ ...p, rank: idx + 1 }));
    setLocal(STORAGE_KEYS.PEOPLE, reindexed);
  },

  // Courses / Library
  getCourses(): CourseItem[] {
    return getLocal<CourseItem[]>(STORAGE_KEYS.COURSES, DEFAULT_COURSES);
  },

  addCourse(
    course: Omit<
      CourseItem,
      "id" | "enrolledCount" | "completedCount" | "status"
    >,
  ): CourseItem {
    const courses = this.getCourses();
    const newCourse: CourseItem = {
      ...course,
      id: "course-" + Date.now(),
      enrolledCount: 1,
      completedCount: 0,
      status: "active",
    };
    const updated = [newCourse, ...courses];
    setLocal(STORAGE_KEYS.COURSES, updated);
    return newCourse;
  },

  deleteCourse(id: string): void {
    const courses = this.getCourses();
    const updated = courses.filter((c) => c.id !== id);
    setLocal(STORAGE_KEYS.COURSES, updated);
  },

  // Activities Log
  getActivities(): ActivityLogItem[] {
    return getLocal<ActivityLogItem[]>(
      STORAGE_KEYS.ACTIVITIES,
      DEFAULT_ACTIVITIES,
    );
  },

  logActivity(activity: ActivityLogItem): void {
    const activities = this.getActivities();
    const updated = [activity, ...activities.slice(0, 49)];
    setLocal(STORAGE_KEYS.ACTIVITIES, updated);
  },

  // Settings
  getSettings(): AppSettings {
    return getLocal<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },

  updateSettings(settings: Partial<AppSettings>): AppSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    setLocal(STORAGE_KEYS.SETTINGS, updated);

    // If name or email changed, update current user too
    if (settings.userName || settings.userEmail || settings.userRole) {
      this.updateCurrentUser({
        name: settings.userName || current.userName,
        email: settings.userEmail || current.userEmail,
        role: settings.userRole || current.userRole,
      });
    }

    return updated;
  },

  // Onboarding Tasks
  getOnboardingTasks(): OnboardingTask[] {
    return getLocal<OnboardingTask[]>(
      STORAGE_KEYS.ONBOARDING,
      DEFAULT_ONBOARDING,
    );
  },

  toggleOnboardingTask(id: string): void {
    const tasks = this.getOnboardingTasks();
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t,
    );
    setLocal(STORAGE_KEYS.ONBOARDING, updated);
  },

  completeOnboardingTask(id: string): void {
    const tasks = this.getOnboardingTasks();
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: true } : t,
    );
    setLocal(STORAGE_KEYS.ONBOARDING, updated);
  },

  // Reset all localhost data back to pristine default
  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.PEOPLE);
    localStorage.removeItem(STORAGE_KEYS.GROUPS);
    localStorage.removeItem(STORAGE_KEYS.COURSES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING);
    localStorage.removeItem(STORAGE_KEYS.METRICS);
    localStorage.removeItem(STORAGE_KEYS.LAST_TAB);
    this.init();
    window.dispatchEvent(new Event("tesla_storage_updated"));
  },
};
