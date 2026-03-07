import type { ContentPage, MediaFile, AdminProfile, PortfolioProject } from "../types";

// ── Admin Dashboard ──

export const DASHBOARD_STATS = [
  { label: "Total Visitors", value: 12847, change: 12.5, icon: "\u25C9", delay: 0, spark: [30, 45, 35, 60, 50, 70, 85, 65, 90, 78, 95, 100] },
  { label: "Page Views", value: 48293, change: 8.3, icon: "\u25D0", delay: 80, spark: [20, 30, 45, 35, 55, 40, 60, 50, 65, 75, 70, 80] },
  { label: "Active Now", value: 34, change: -2.1, icon: "\u26A1", delay: 160, spark: [40, 35, 50, 30, 45, 55, 38, 42, 36, 44, 32, 34] },
  { label: "Avg. Session", value: 245, change: 5.7, icon: "\u23F1", delay: 240, suffix: "s", spark: [180, 200, 190, 220, 210, 230, 225, 240, 235, 245, 250, 245] },
];

export const WEEKLY_TRAFFIC = {
  data: [320, 480, 390, 520, 610, 450, 380],
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};

export const RECENT_ACTIVITY = [
  { text: "Hero section updated", time: "2m ago", color: "#2DD4A8" },
  { text: "New media uploaded", time: "18m ago", color: "#4A9FF5" },
  { text: "Services page edited", time: "1h ago", color: "#F5A623" },
  { text: "Admin role changed", time: "3h ago", color: "#E84855" },
  { text: "Contact form received", time: "5h ago", color: "#2DD4A8" },
];

// ── Admin Content ──

export const INITIAL_PAGES: ContentPage[] = [
  { id: "1", name: "Hero Section", status: "Published", updated: "2 min ago", content: "Engineering the Next Generation of Software" },
  { id: "2", name: "About Codnexia", status: "Published", updated: "1 hour ago", content: "Codnexia Software is a global software development company..." },
  { id: "3", name: "Our Process", status: "Draft", updated: "3 hours ago", content: "Discovery, Build, Test, Deploy" },
  { id: "4", name: "Services", status: "Published", updated: "1 day ago", content: "Web Apps, Mobile, SaaS, APIs, AI" },
  { id: "5", name: "Contact Info", status: "Published", updated: "2 days ago", content: "info@codnexia.com" },
];

// ── Admin Media ──

export const INITIAL_FILES: MediaFile[] = [
  { id: "1", name: "hero-bg.jpg", size: "2.4 MB", type: "Image", date: "Feb 15" },
  { id: "2", name: "codnexia-logo.svg", size: "12 KB", type: "SVG", date: "Feb 14" },
  { id: "3", name: "team-nairobi.png", size: "1.8 MB", type: "Image", date: "Feb 12" },
  { id: "4", name: "demo-reel.mp4", size: "8.2 MB", type: "Video", date: "Feb 10" },
];

// ── Admin Visitors ──

export const VISITOR_STATS = [
  { label: "Live Visitors", value: 34, change: 4.2, icon: "\u25C9", delay: 0, spark: [20, 28, 24, 32, 30, 36, 34] },
  { label: "Today's Views", value: 1847, change: 11.3, icon: "\u25D0", delay: 80, spark: [800, 950, 1100, 1300, 1500, 1700, 1847] },
  { label: "Bounce Rate", value: 38, change: -3.1, icon: "\u21A9", delay: 160, suffix: "%", spark: [45, 42, 44, 40, 41, 39, 38] },
];

export const VISITORS = [
  { id: "v_8f2a", page: "/home", duration: "4m 12s", country: "\uD83C\uDDF0\uD83C\uDDEA", device: "Desktop", status: "active" },
  { id: "v_3c1b", page: "/services", duration: "2m 34s", country: "\uD83C\uDDFA\uD83C\uDDF8", device: "Mobile", status: "active" },
  { id: "v_9d4e", page: "/about", duration: "1m 08s", country: "\uD83C\uDDEC\uD83C\uDDE7", device: "Desktop", status: "active" },
  { id: "v_7a2f", page: "/contact", duration: "0m 47s", country: "\uD83C\uDDE9\uD83C\uDDEA", device: "Tablet", status: "idle" },
  { id: "v_1e5c", page: "/home", duration: "6m 21s", country: "\uD83C\uDDF3\uD83C\uDDEC", device: "Mobile", status: "active" },
  { id: "v_4b3d", page: "/services", duration: "3m 45s", country: "\uD83C\uDDFF\uD83C\uDDE6", device: "Desktop", status: "idle" },
  { id: "v_6f7a", page: "/about", duration: "1m 33s", country: "\uD83C\uDDEE\uD83C\uDDF3", device: "Mobile", status: "active" },
];

// ── Admin Settings ──

export const DEFAULT_PROFILE: AdminProfile = { name: "", email: "", role: "Admin" };

export const SECURITY_SETTINGS = [
  { label: "JWT Expiry", value: "24 hours", desc: "Token refresh handled automatically" },
  { label: "Token Storage", value: "Session Storage", desc: "JWT stored in browser session" },
  { label: "Session", value: "Active", desc: "Since Feb 17, 2026 at 09:14 AM" },
  { label: "2FA", value: "Disabled", desc: "Recommended for production" },
];

// ── Client: Hero ──

export const HERO_METRICS = [
  { v: 50, s: "+", l: "Projects Delivered" },
  { v: 20, s: "+", l: "Global Clients" },
  { v: 99, s: "%", l: "Client Satisfaction" },
];

// ── Client: About ──

export const ABOUT_PILLARS = [
  { icon: "\u25CE", title: "Mission", desc: "To build high-quality, scalable, and innovative software solutions that empower businesses globally while showcasing African engineering excellence.", color: "#2DD4A8" },
  { icon: "\u25C8", title: "Vision", desc: "To become a globally trusted technology company originating from Africa, shaping the future of digital innovation and software development.", color: "#4A9FF5" },
  { icon: "\u2726", title: "Values", desc: "Innovation First \u00B7 Engineering Excellence \u00B7 Integrity & Trust \u00B7 Global Mindset \u00B7 African Excellence", color: "#F5A623" },
];

export const CORE_VALUES = ["Innovation First", "Engineering Excellence", "Integrity & Trust", "Global Mindset", "African Excellence"];

// ── Client: Process ──

export const PROCESS_STEPS = [
  { step: "01", title: "Discovery & Design", desc: "Understand your vision, define scope, wireframe solutions and plan the architecture.", icon: "\uD83D\uDD0D" },
  { step: "02", title: "Build & Develop", desc: "Agile sprints with clean, scalable code. REST APIs, WebSockets, mobile & web UIs.", icon: "\u2699\uFE0F" },
  { step: "03", title: "Test & Integrate", desc: "Comprehensive QA, security audits, CI/CD pipelines and system integrations.", icon: "\uD83E\uDDEA" },
  { step: "04", title: "Deploy & Scale", desc: "Containerized deployment, monitoring dashboards, and ongoing support for growth.", icon: "\uD83D\uDE80" },
];

// ── Client: Services ──

export const SERVICES = [
  { icon: "\uD83C\uDF10", title: "Web Applications", desc: "Modern, responsive web apps with React, NestJS, and scalable backends. From SPAs to full-stack platforms.", tag: "Frontend + Backend" },
  { icon: "\uD83D\uDCF1", title: "Mobile Apps", desc: "Native and cross-platform mobile apps for iOS and Android using React Native and Flutter.", tag: "iOS \u00B7 Android" },
  { icon: "\u2601\uFE0F", title: "SaaS Products", desc: "End-to-end SaaS platforms with multi-tenancy, subscription billing, dashboards, and analytics.", tag: "Cloud" },
  { icon: "\uD83D\uDD17", title: "API & Integrations", desc: "RESTful APIs, GraphQL, third-party integrations, webhooks, and data pipeline orchestration.", tag: "Backend" },
  { icon: "\u26A1", title: "No-Code / Low-Code", desc: "Rapid prototyping and business automation with Bubble, Retool, and custom low-code platforms.", tag: "Rapid" },
  { icon: "\uD83E\uDD16", title: "AI & Automation", desc: "AI-driven systems, LLM integrations, intelligent workflows, chatbots, and process automation.", tag: "AI/ML" },
  { icon: "\uD83D\uDCD0", title: "System Design & Consulting", desc: "Architecture consulting, tech audits, infrastructure planning, and team augmentation.", tag: "Consulting" },
];

// ── Client: Contact ──

export const SERVICE_OPTIONS = [
  "Web Application Development", "Mobile App Development", "SaaS Product Development",
  "API & System Integrations", "No-Code / Low-Code Solutions", "AI & Automation Systems",
  "System Design & Consulting",
];

export const BUDGET_OPTIONS = ["< $5K", "$5K - $15K", "$15K - $50K", "$50K+", "Not sure"];

export const CONTACT_INFO = [
  { icon: "\u2709", label: "Email", value: "info@codnexia.com", sub: "We respond within 24 hours" },
  { icon: "\u25CE", label: "Website", value: "www.codnexia.com", sub: "Visit our portfolio & blog" },
  { icon: "\u25C8", label: "Location", value: "Africa", sub: "Serving clients globally" },
  { icon: "\u23F1", label: "Availability", value: "Mon - Fri", sub: "9:00 AM - 6:00 PM EAT" },
];

export const SOCIAL_LINKS = [
  { name: "Twitter", icon: "\uD835\uDD4F" },
  { name: "GitHub", icon: "\u2318" },
  { name: "LinkedIn", icon: "in" },
  { name: "Dribbble", icon: "\u25C9" },
];

// ── Client: Portfolio ──

export const FALLBACK_PORTFOLIOS: PortfolioProject[] = [
  {
    id: "fp-1",
    title: "FinTrack",
    subtitle: "Smart Financial Dashboard",
    description: "A comprehensive financial management platform with real-time analytics, budget tracking, and AI-powered insights for personal and business finances.",
    category: "SaaS",
    color: "#2DD4A8",
    tags: ["React", "Node.js", "PostgreSQL", "Chart.js", "Stripe"],
    metrics: [
      { v: "12K+", l: "Active Users" },
      { v: "99.9%", l: "Uptime" },
      { v: "$2M+", l: "Tracked Monthly" },
    ],
    imageUrl: null,
    thumbnailUrl: null,
    liveUrl: null,
    repoUrl: null,
    featured: true,
    published: true,
    sortOrder: 0,
  },
  {
    id: "fp-2",
    title: "MediConnect",
    subtitle: "Healthcare Appointment Platform",
    description: "Telemedicine platform connecting patients with healthcare providers. Features video consultations, prescription management, and health record tracking.",
    category: "Healthcare",
    color: "#4A9FF5",
    tags: ["React Native", "NestJS", "WebRTC", "MongoDB"],
    metrics: [
      { v: "5K+", l: "Consultations" },
      { v: "200+", l: "Doctors" },
    ],
    imageUrl: null,
    thumbnailUrl: null,
    liveUrl: null,
    repoUrl: null,
    featured: false,
    published: true,
    sortOrder: 1,
  },
  {
    id: "fp-3",
    title: "LogiFlow",
    subtitle: "Supply Chain Management",
    description: "End-to-end logistics and supply chain optimization tool with real-time tracking, route planning, and warehouse management capabilities.",
    category: "Logistics",
    color: "#F5A623",
    tags: ["Vue.js", "Python", "Redis", "Google Maps API"],
    metrics: [
      { v: "30%", l: "Cost Reduction" },
      { v: "10K+", l: "Shipments" },
    ],
    imageUrl: null,
    thumbnailUrl: null,
    liveUrl: null,
    repoUrl: null,
    featured: false,
    published: true,
    sortOrder: 2,
  },
  {
    id: "fp-4",
    title: "EduPulse",
    subtitle: "Interactive Learning Platform",
    description: "Gamified e-learning platform with adaptive quizzes, progress analytics, video courses, and collaborative study groups for students and educators.",
    category: "EdTech",
    color: "#E84855",
    tags: ["Next.js", "GraphQL", "AWS", "WebSocket"],
    metrics: [
      { v: "50K+", l: "Students" },
      { v: "1.2K", l: "Courses" },
    ],
    imageUrl: null,
    thumbnailUrl: null,
    liveUrl: null,
    repoUrl: null,
    featured: false,
    published: true,
    sortOrder: 3,
  },
  {
    id: "fp-5",
    title: "AgriSense",
    subtitle: "Smart Agriculture IoT Dashboard",
    description: "IoT-powered agricultural monitoring system with soil sensors, weather integration, drone mapping, and crop yield predictions using machine learning.",
    category: "AgriTech",
    color: "#2DD4A8",
    tags: ["React", "Python", "TensorFlow", "IoT", "MQTT"],
    metrics: [
      { v: "25%", l: "Yield Increase" },
      { v: "500+", l: "Farms" },
      { v: "1M+", l: "Data Points/Day" },
    ],
    imageUrl: null,
    thumbnailUrl: null,
    liveUrl: null,
    repoUrl: null,
    featured: false,
    published: true,
    sortOrder: 4,
  },
  {
    id: "fp-6",
    title: "PaySwift",
    subtitle: "Mobile Payment Gateway",
    description: "Secure mobile payment solution supporting M-Pesa, card payments, and crypto transactions with instant settlement and fraud detection.",
    category: "FinTech",
    color: "#4A9FF5",
    tags: ["React Native", "Go", "Kubernetes", "Stripe", "Web3"],
    metrics: [
      { v: "$5M+", l: "Processed" },
      { v: "100K+", l: "Transactions" },
      { v: "< 200ms", l: "Avg Latency" },
    ],
    imageUrl: null,
    thumbnailUrl: null,
    liveUrl: null,
    repoUrl: null,
    featured: false,
    published: true,
    sortOrder: 5,
  },
];
