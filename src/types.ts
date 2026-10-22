export interface MetricItem {
  id: string;
  title: string;
  value: string;
  subtext?: string;
  hasSparkline?: boolean;
  sparklineVariant?: 'starting' | 'current' | 'gain';
  infoText?: string;
}

export interface ActivityMonth {
  month: string;
  shortMonth: string;
  value: number; // 0 to 400
  percentage: number;
  users: number;
  quizzes: number;
}

export interface TopicItem {
  id: string;
  title: string;
  percentage: number;
  correctLabel: string;
  imageUrl: string;
  type: 'weakest' | 'strongest';
  questionsCount?: number;
  avgTime?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface UserLeaderboardItem {
  rank: number;
  id?: string;
  name: string;
  email?: string;
  points: number;
  accuracy?: number; // e.g. 98 for 98% Correct
  trend: 'up' | 'down';
  avatarUrl?: string;
  department?: string;
  role?: string;
  completedQuizzes?: number;
  status?: 'active' | 'inactive' | 'pending';
  joinedDate?: string;
}

export interface GroupLeaderboardItem {
  rank: number;
  id?: string;
  name: string;
  pointsPerUser: number;
  accuracy?: number;
  trend: 'up' | 'down';
  membersCount?: number;
  region?: string;
}

export interface FilterState {
  timeframe: string;
  people: string;
  topic: string;
}

export interface CourseItem {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  questionsCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  passingGrade: number; // e.g. 80
  enrolledCount: number;
  completedCount: number;
  imageUrl?: string;
  status: 'active' | 'archived' | 'draft';
}

export interface ActivityLogItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  topicTitle: string;
  action: 'completed_quiz' | 'started_course' | 'earned_badge' | 'joined_platform';
  score?: number;
  status: 'Completed' | 'In Progress' | 'Scheduled';
  timestamp: string;
  formattedTime: string;
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  targetTab?: string;
  points: number;
}

export interface AppSettings {
  userName: string;
  userEmail: string;
  userRole: string;
  companyName: string;
  defaultTimeframe: string;
  passingThreshold: number;
  emailNotifications: boolean;
  weeklyDigest: boolean;
  autoEnrollNewHires: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
  loggedIn: boolean;
}
