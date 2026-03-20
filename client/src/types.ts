import type { ReactNode } from "react";

export type ToastType = "success" | "error" | "info" | "warning";
export type ToastFn = (msg: string, type?: ToastType) => void;
export type ViewState = "client" | "login" | "signup" | "admin" | "careers" | "interview";

export interface Toast {
  id: number;
  msg: string;
  type: ToastType;
}

export interface AnimNumProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export interface PillProps {
  children: ReactNode;
  color?: string;
}

export interface BtnProps {
  children: ReactNode;
  variant?: "primary" | "ghost" | "secondary";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  textarea?: boolean;
  error?: string;
}

export interface SparklineProps {
  data: number[];
  color?: string;
  w?: number;
  h?: number;
}

export interface BarChartProps {
  data: number[];
  labels?: string[];
  color?: string;
}

export interface StatCardProps {
  label: string;
  value: number;
  change?: number;
  spark?: number[];
  icon?: string;
  delay?: number;
  suffix?: string;
  prefix?: string;
}

export interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export interface AdminPanelProps {
  onLogout: () => void;
  onBack: () => void;
}

export interface AdminSignupProps {
  onSuccess: () => void;
  onBack: () => void;
  inviteToken: string;
}

export interface AdminSettingsProps {
  onLogout: () => void;
}

export interface ContactForm {
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  message: string;
}

export interface ContentPage {
  id: string;
  name: string;
  status: string;
  updated: string;
  content: string;
}

export interface MediaFile {
  id: string;
  name: string;
  size: string;
  type: string;
  date: string;
}

export interface AdminProfile {
  name: string;
  email: string;
  role: string;
}

// ── Paginated Response ──

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ── API Response Types ──

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export interface ProfileResponse {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface ContentPageResponse {
  id: string;
  name: string;
  status: string;
  content: string;
  updatedAt: string;
}

export interface MediaFileResponse {
  id: string;
  originalName: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

export interface ActivityResponse {
  description: string;
  createdAt: string;
  color?: string;
}

export interface DashboardStat {
  label: string;
  value: number;
  change: number;
  icon: string;
  spark: number[];
  suffix?: string;
  prefix?: string;
}

export interface DashboardResponse {
  stats: DashboardStat[];
  weeklyTraffic: { data: number[]; labels: string[] };
}

export interface VisitorEntry {
  id: string;
  page: string;
  duration: string;
  country: string;
  device: string;
  status: string;
}

export interface VisitorResponse {
  stats: DashboardStat[];
  visitors: VisitorEntry[];
}

export interface Testimonial {
  id: string;
  author: string;
  company: string;
  role: string;
  content: string;
  rating: number;
  published: boolean;
  updated: string;
}

export interface TestimonialResponse {
  id: string;
  author: string;
  company: string;
  role: string;
  content: string;
  rating: number;
  published: boolean;
  updatedAt: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  color: string;
  tags: string[];
  metrics: { v: string; l: string }[];
  imageUrl: string | null;
  thumbnailUrl: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
}

export interface PortfolioResponse {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  color: string;
  tags: string[];
  metrics: { v: string; l: string }[];
  imageUrl: string | null;
  thumbnailUrl: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  updatedAt: string;
}

export interface ParsedResume {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  currentRole?: string;
  company?: string;
  experience?: string;
  primaryStack?: string[];
  otherSkills?: string;
  degree?: string;
  field?: string;
  university?: string;
  gradYear?: string;
  summary?: string;
}

export interface CareerApplication {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  country: string;
  city: string;
  nationality: string;
  linkedin: string;
  github: string;
  portfolio: string;
  website: string;
  currentRole: string;
  company: string;
  experience: string;
  noticePeriod: string;
  employmentType: string;
  workMode: string;
  salaryExpectation: string;
  salaryCurrency: string;
  primaryStack: string[];
  otherSkills: string;
  proficiency: string;
  languages: string;
  certifications: string;
  degree: string;
  field: string;
  university: string;
  gradYear: string;
  position: string;
  coverLetter: string;
  heardFrom: string;
  availability: string;
  callDate: string;
  callTime: string;
  timezone: string;
  callTopics: string[];
  status: string;
  // AI recruitment fields
  resumeUrl: string | null;
  resumeParsed: ParsedResume | null;
  screeningScore: number | null;
  screeningNotes: string | null;
  screeningStatus: string | null;
  interviewScore: number | null;
  compositeScore: number | null;
  finalRecommendation: string | null;
  createdAt: string;
}

export interface InterviewQuestion {
  index: number;
  category: string;
  question: string;
  answered: boolean;
}

export interface InterviewState {
  status: string;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredCount: number;
  expiresAt: string;
  completedAt: string | null;
}

export interface AiInterview {
  id: string;
  applicationId: string;
  accessToken: string;
  status: string;
  questions: { category: string; question: string }[];
  answers: { questionIndex: number; answer: string; submittedAt: string }[];
  currentQuestionIndex: number;
  evaluationScore: number | null;
  evaluationNotes: string | null;
  evaluationRecommendation: string | null;
  startedAt: string | null;
  completedAt: string | null;
  expiresAt: string;
  createdAt: string;
}

export interface CareerApplicationResponse extends CareerApplication {}

export interface JobPosition {
  id: string;
  title: string;
  type: string;
  mode: string;
  department: string | null;
  description: string | null;
  requirements: string | null;
  open: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobPositionResponse extends JobPosition {}

export interface InviteTokenResponse {
  id: string;
  token: string;
  used: boolean;
  expiresAt: string;
  createdAt: string;
}
