import type { ContentPage, MediaFile, AdminProfile, PortfolioProject, Testimonial } from "../types";

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
  { id: "5", name: "Contact Info", status: "Published", updated: "2 days ago", content: "info@codnexia.uk" },
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

// ── Client: Trust Strip ──

export const TRUST_BADGES = [
  { icon: "\u2699\uFE0F", text: "Built with modern tech stack" },
  { icon: "\uD83D\uDE80", text: "Scalable & production-ready systems" },
  { icon: "\u2714\uFE0F", text: "Trusted engineering approach" },
  { icon: "\uD83C\uDF0D", text: "Global clients, African excellence" },
];

// ── Client: Why Codnexia ──

export const WHY_CODNEXIA = [
  { icon: "\uD83C\uDF0D", title: "African Talent, Global Standards", desc: "World-class engineering rooted in Africa, delivering to clients across the globe.", color: "#2DD4A8" },
  { icon: "\u2699\uFE0F", title: "Engineering-First Approach", desc: "We don't just code \u2014 we architect. Every system is built for performance, security, and maintainability.", color: "#4A9FF5" },
  { icon: "\uD83D\uDE80", title: "Scalable by Design", desc: "From day one, every solution is designed to handle growth \u2014 more users, more data, more complexity.", color: "#F5A623" },
  { icon: "\uD83E\uDD1D", title: "Long-Term Partnership", desc: "We don't disappear after deployment. We stay on to optimize, maintain, and scale alongside your business.", color: "#E84855" },
];

// ── Client: Tech Stack ──

export const TECH_CATEGORIES = [
  {
    icon: "🧱", title: "Core Engineering", subtitle: "Our Identity",
    description: "The foundational technologies that power every Codnexia product.",
    color: "#2DD4A8",
    type: "items" as const,
    items: [
      { area: "Frontend", tools: [
        { name: "React", desc: "Component-driven UIs", icon: "⚛" },
        { name: "Next.js", desc: "SSR & static generation", icon: "▲" },
      ]},
      { area: "Backend", tools: [
        { name: "Node.js", desc: "Event-driven runtime", icon: "⬡" },
        { name: "NestJS", desc: "Enterprise architecture", icon: "🐈" },
      ]},
      { area: "Database", tools: [
        { name: "PostgreSQL", desc: "Relational powerhouse", icon: "🐘" },
      ]},
      { area: "DevOps", tools: [
        { name: "Docker", desc: "Containerized deployments", icon: "🐳" },
        { name: "CI/CD", desc: "Automated pipelines", icon: "🔄" },
      ]},
    ],
  },
  {
    icon: "⚙️", title: "Backend Power & Real-Time", subtitle: "Beyond the Basics",
    description: "Capabilities that prove we're not just basic devs.",
    color: "#4A9FF5",
    type: "capabilities" as const,
    capabilities: [
      { name: "REST API Development", desc: "Clean, versioned, documented APIs built for scale" },
      { name: "WebSockets", desc: "Real-time communication for live dashboards, chat & collaboration" },
      { name: "Authentication Systems", desc: "JWT tokens, HTTP-only cookies, OAuth2, role-based access" },
      { name: "Scalable Architecture", desc: "Microservices, event-driven design, horizontal scaling" },
    ],
  },
  {
    icon: "⚡", title: "Acceleration Layer", subtitle: "Low-Code",
    description: "Speed up delivery and MVPs without sacrificing quality.",
    color: "#F5A623",
    type: "items" as const,
    items: [
      { area: "Speed Tools", tools: [
        { name: "Supabase", desc: "Instant backend + auth", icon: "⚡" },
        { name: "Xano", desc: "No-code API builder", icon: "✦" },
        { name: "Retool", desc: "Internal tool builder", icon: "🔧" },
      ]},
    ],
  },
  {
    icon: "🚀", title: "Rapid Development", subtitle: "No-Code",
    description: "For startups and quick launches — live in days, not months.",
    color: "#A78BFA",
    type: "items" as const,
    items: [
      { area: "Platforms", tools: [
        { name: "Bubble", desc: "Full-stack visual dev", icon: "◉" },
        { name: "Webflow", desc: "Visual web design", icon: "◆" },
        { name: "FlutterFlow", desc: "Mobile app builder", icon: "📱" },
      ]},
    ],
  },
];

export const AUTOMATION_ITEMS = [
  { name: "Workflow Automation", desc: "Connect systems with Zapier, Make, and custom orchestration" },
  { name: "Business Process Automation", desc: "Eliminate manual tasks and reduce human error at scale" },
  { name: "API Integrations", desc: "Bridge any two systems with custom middleware and webhooks" },
];

export const AI_ITEMS = [
  { name: "AI-Powered Chat Systems", desc: "Intelligent chatbots and conversational interfaces for customers" },
  { name: "AI-Assisted Workflows", desc: "Smart recommendations, auto-classification, and decision support" },
  { name: "AI-Driven Data Processing", desc: "Extract insights, summarize documents, and analyze patterns" },
  { name: "AI Customer Interaction", desc: "Personalized experiences powered by machine learning" },
];

export const WHY_THIS_STACK = [
  { icon: "🏗", title: "Serious Engineering", desc: "Production-grade code with clean architecture and full test coverage.", color: "#2DD4A8" },
  { icon: "⚡", title: "Fast Delivery", desc: "Low-code and no-code layers let us ship MVPs in days, not months.", color: "#F5A623" },
  { icon: "🤖", title: "AI-Ready", desc: "Every system we build is designed to integrate intelligent automation.", color: "#4A9FF5" },
  { icon: "📈", title: "Scalable Partner", desc: "From startup prototype to enterprise platform — our stack grows with you.", color: "#A78BFA" },
];

// ── Client: Process ──

export const PROCESS_STEPS = [
  { step: "01", title: "Discovery & Planning", desc: "We dive deep into your business, goals, and users to define a clear project scope and roadmap.", icon: "\uD83D\uDD0D" },
  { step: "02", title: "System Architecture", desc: "We design the technical blueprint \u2014 database schemas, API contracts, infrastructure, and scalability patterns.", icon: "\uD83D\uDCD0" },
  { step: "03", title: "Development", desc: "Agile sprints with clean, tested code. REST APIs, real-time features, responsive UIs \u2014 built to spec.", icon: "\u2699\uFE0F" },
  { step: "04", title: "Testing & Optimization", desc: "Comprehensive QA, performance audits, security reviews, and CI/CD pipeline setup.", icon: "\uD83E\uDDEA" },
  { step: "05", title: "Deployment & Scaling", desc: "Containerized deployment, monitoring, and ongoing support to ensure your system grows with your business.", icon: "\uD83D\uDE80" },
];

// ── Client: Services ──

export const SERVICES = [
  { icon: "\uD83C\uDF10", title: "Web Applications", desc: "Modern, responsive web apps with React, NestJS, and scalable backends. From SPAs to full-stack platforms.", tag: "Frontend + Backend" },
  { icon: "\uD83D\uDCF1", title: "Mobile Applications", desc: "Native and cross-platform mobile apps for iOS and Android using React Native and Flutter.", tag: "iOS \u00B7 Android" },
  { icon: "\u2601\uFE0F", title: "SaaS Platforms", desc: "End-to-end SaaS platforms with multi-tenancy, subscription billing, dashboards, and analytics.", tag: "Cloud" },
  { icon: "\uD83D\uDD17", title: "APIs & Integrations", desc: "RESTful APIs, GraphQL, third-party integrations, webhooks, and data pipeline orchestration.", tag: "Backend" },
  { icon: "\u26A1", title: "Automation Systems", desc: "Intelligent workflows, process automation, scheduled jobs, and event-driven architectures.", tag: "Automation" },
];

// ── Client: Contact ──

export const SERVICE_OPTIONS = [
  "Web Application Development", "Mobile App Development", "SaaS Platform Development",
  "APIs & Integrations", "Automation Systems",
];

export const BUDGET_OPTIONS = ["< $5K", "$5K - $15K", "$15K - $50K", "$50K+", "Not sure"];

export const CONTACT_INFO = [
  { icon: "\u2709", label: "Email", value: "info@codnexia.uk", sub: "We respond within 24 hours" },
  { icon: "\u25CE", label: "Website", value: "codnexia.uk", sub: "Visit our portfolio & blog" },
  { icon: "\u25C8", label: "Location", value: "Africa", sub: "Serving clients globally" },
  { icon: "\u23F1", label: "Availability", value: "Mon - Fri", sub: "7:00 AM - 8:00 PM EAT" },
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

// ── Client: Testimonials ──

export const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: "ft-1",
    author: "Kevin Otieno",
    company: "FinTrack",
    role: "CEO",
    rating: 5,
    content: "We needed a financial dashboard that could handle real-time analytics for 12K+ users. Codnexia nailed it \u2014 React frontend, PostgreSQL backend, Stripe integration, all shipped two weeks early with 99.9% uptime from day one.",
    published: true,
    updated: "",
  },
  {
    id: "ft-2",
    author: "Dr. Priya Nair",
    company: "MediConnect",
    role: "Chief Medical Officer",
    rating: 5,
    content: "Building a telemedicine platform with video consultations and prescription management is no small feat. Codnexia\u2019s team handled WebRTC, React Native, and MongoDB like pros. Over 200 doctors and 5K+ consultations later, it just works.",
    published: true,
    updated: "",
  },
  {
    id: "ft-3",
    author: "Ibrahim Danjuma",
    company: "LogiFlow",
    role: "Director of Logistics",
    rating: 4,
    content: "Our supply chain was a mess before LogiFlow. Codnexia built us a tracking and route planning system with real-time Google Maps integration. We\u2019ve cut costs by 30% and processed over 10K shipments without a hitch.",
    published: true,
    updated: "",
  },
  {
    id: "ft-4",
    author: "Grace Wanjiku",
    company: "EduPulse",
    role: "Founder & CEO",
    rating: 5,
    content: "Codnexia turned our idea into a gamified learning platform serving 50K+ students with 1.2K courses. The adaptive quizzes and real-time WebSocket features keep our learners engaged. Next.js and GraphQL was the right call.",
    published: true,
    updated: "",
  },
  {
    id: "ft-5",
    author: "Thomas Kamau",
    company: "AgriSense",
    role: "Head of Product",
    rating: 5,
    content: "IoT meets agriculture \u2014 that was our pitch, and Codnexia made it real. Soil sensors, drone mapping, ML-powered yield predictions, all on a beautiful React dashboard. 500+ farms connected with over a million data points flowing daily.",
    published: true,
    updated: "",
  },
  {
    id: "ft-6",
    author: "Fatima Hassan",
    company: "PaySwift",
    role: "VP of Engineering",
    rating: 5,
    content: "Handling M-Pesa, card payments, and crypto in one gateway with sub-200ms latency? Codnexia delivered. $5M+ processed, 100K+ transactions, and zero security breaches. Their Go and Kubernetes expertise is world-class.",
    published: true,
    updated: "",
  },
];
