// ── API utility for communicating with the NestJS backend ──
// All fetch calls go through here. JWT token is auto-attached.

import type {
  AuthResponse,
  ProfileResponse,
  ContentPageResponse,
  MediaFileResponse,
  ActivityResponse,
  DashboardResponse,
  VisitorResponse,
  TestimonialResponse,
  PortfolioResponse,
  InviteTokenResponse,
  PaginatedResponse,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.PROD
    ? (() => { throw new Error('VITE_API_URL must be set in production'); })()
    : 'http://localhost:3000/api'
);

// ── Token Management ──

export function getToken(): string | null {
  return sessionStorage.getItem('codnexia_token');
}

export function setToken(token: string): void {
  sessionStorage.setItem('codnexia_token', token);
}

export function clearAuth(): void {
  sessionStorage.removeItem('codnexia_token');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

// ── Base Fetch Wrapper ──
// Automatically adds JWT header and handles errors

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  // Don't set Content-Type for FormData (browser sets it with boundary)
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> ?? {}) },
  });

  if (res.status === 429) {
    throw new Error('Too many requests. Please wait a moment and try again.');
  }

  // C3: Handle expired/invalid JWT — clear token and redirect to login
  if (res.status === 401 && token) {
    clearAuth();
    window.location.href = '/admin-dashboard?session=expired';
    throw new Error('Session expired. Please log in again.');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }

  return res.json();
}

// ── Auth ──

export async function login(email: string, password: string) {
  const data = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.accessToken);
  return data;
}

export async function refreshToken() {
  const data = await apiFetch<{ accessToken: string }>('/auth/refresh', { method: 'POST' });
  setToken(data.accessToken);
  return data;
}

export async function getProfile() {
  return apiFetch<ProfileResponse>('/auth/me');
}

export async function updateProfile(data: { name?: string; email?: string }) {
  return apiFetch<ProfileResponse>('/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function register(data: { name: string; email: string; password: string; inviteToken: string }) {
  return apiFetch<{ message: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function generateInvite() {
  return apiFetch<{ token: string; expiresAt: string }>('/auth/invite', { method: 'POST' });
}

export async function getInvites(page = 1, limit = 20) {
  return apiFetch<PaginatedResponse<InviteTokenResponse>>(`/auth/invites?page=${page}&limit=${limit}`);
}

// ── Contact ──

export async function submitContact(form: {
  name: string; email: string; company?: string;
  service?: string; budget?: string; message: string;
}) {
  return apiFetch<{ success: boolean }>('/contact', { method: 'POST', body: JSON.stringify(form) });
}

// ── Content Pages ──

export async function getPublishedContent() {
  const items = await apiFetch<ContentPageResponse[]>('/content/public');
  return items.map(mapContentPage);
}

export async function getContentPages(page = 1, limit = 20) {
  const res = await apiFetch<PaginatedResponse<ContentPageResponse>>(`/content?page=${page}&limit=${limit}`);
  return { ...res, data: res.data.map(mapContentPage) };
}

export async function createContentPage(data: { name: string; content?: string; status?: string }) {
  const page = await apiFetch<ContentPageResponse>('/content', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return mapContentPage(page);
}

export async function updateContentPage(id: string, data: { name?: string; content?: string; status?: string }) {
  const page = await apiFetch<ContentPageResponse>(`/content/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return mapContentPage(page);
}

export async function deleteContentPage(id: string) {
  return apiFetch<{ success: boolean }>(`/content/${id}`, { method: 'DELETE' });
}

// ── Media Files ──

export async function getMediaFiles(page = 1, limit = 20) {
  const res = await apiFetch<PaginatedResponse<MediaFileResponse>>(`/media?page=${page}&limit=${limit}`);
  return { ...res, data: res.data.map(mapMediaFile) };
}

export async function uploadMediaFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const result = await apiFetch<MediaFileResponse>('/media/upload', {
    method: 'POST',
    body: formData,
  });
  return mapMediaFile(result);
}

export async function deleteMediaFile(id: string) {
  return apiFetch<{ success: boolean }>(`/media/${id}`, { method: 'DELETE' });
}

// ── Analytics ──

export async function getDashboardData() {
  return apiFetch<DashboardResponse>('/analytics/dashboard');
}

export async function getVisitorData() {
  return apiFetch<VisitorResponse>('/analytics/visitors');
}

// Public endpoint - tracks a page view from the client site
export async function trackPageView(page: string, sessionId: string, device: string) {
  return apiFetch<{ success: boolean }>('/analytics/track', {
    method: 'POST',
    body: JSON.stringify({ page, sessionId, device }),
  });
}

// ── Activity Feed ──

export async function getRecentActivity() {
  const items = await apiFetch<ActivityResponse[]>('/activity');
  return items.map(mapActivity);
}

// ── Testimonials ──

export async function getPublishedTestimonials() {
  const items = await apiFetch<TestimonialResponse[]>('/testimonials/public');
  return items.map(mapTestimonial);
}

export async function getTestimonials(page = 1, limit = 20) {
  const res = await apiFetch<PaginatedResponse<TestimonialResponse>>(`/testimonials?page=${page}&limit=${limit}`);
  return { ...res, data: res.data.map(mapTestimonial) };
}

export async function createTestimonial(data: { author: string; company: string; role?: string; content: string; rating?: number; published?: boolean }) {
  const item = await apiFetch<TestimonialResponse>('/testimonials', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return mapTestimonial(item);
}

export async function updateTestimonial(id: string, data: { author?: string; company?: string; role?: string; content?: string; rating?: number; published?: boolean }) {
  const item = await apiFetch<TestimonialResponse>(`/testimonials/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return mapTestimonial(item);
}

export async function deleteTestimonial(id: string) {
  return apiFetch<{ success: boolean }>(`/testimonials/${id}`, { method: 'DELETE' });
}

// ── Portfolios ──

export async function getPublishedPortfolios() {
  return apiFetch<PortfolioResponse[]>('/portfolios/public');
}

export async function getPortfolios(page = 1, limit = 20) {
  const res = await apiFetch<PaginatedResponse<PortfolioResponse>>(`/portfolios?page=${page}&limit=${limit}`);
  return { ...res, data: res.data.map(mapPortfolio) };
}

export async function createPortfolio(data: {
  title: string; subtitle: string; description: string; category: string;
  color?: string; tags?: string[]; metrics?: { v: string; l: string }[];
  liveUrl?: string; repoUrl?: string; featured?: boolean; published?: boolean; sortOrder?: number;
}) {
  const item = await apiFetch<PortfolioResponse>('/portfolios', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return mapPortfolio(item);
}

export async function updatePortfolio(id: string, data: {
  title?: string; subtitle?: string; description?: string; category?: string;
  color?: string; tags?: string[]; metrics?: { v: string; l: string }[];
  liveUrl?: string; repoUrl?: string; featured?: boolean; published?: boolean; sortOrder?: number;
}) {
  const item = await apiFetch<PortfolioResponse>(`/portfolios/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return mapPortfolio(item);
}

export async function deletePortfolio(id: string) {
  return apiFetch<{ success: boolean }>(`/portfolios/${id}`, { method: 'DELETE' });
}

export async function uploadPortfolioImage(id: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const item = await apiFetch<PortfolioResponse>(`/portfolios/${id}/image`, {
    method: 'POST',
    body: formData,
  });
  return mapPortfolio(item);
}

export async function removePortfolioImage(id: string) {
  const item = await apiFetch<PortfolioResponse>(`/portfolios/${id}/image`, { method: 'DELETE' });
  return mapPortfolio(item);
}

// ── Response Mappers ──
// Transform backend responses to match the frontend type shapes

function mapContentPage(page: ContentPageResponse) {
  return {
    id: page.id,
    name: page.name,
    status: page.status,
    updated: timeAgo(page.updatedAt),
    content: page.content,
  };
}

function mapMediaFile(file: MediaFileResponse) {
  return {
    id: file.id,
    name: file.originalName,
    size: formatFileSize(file.size),
    type: getFileType(file.mimeType),
    date: formatDate(file.createdAt),
  };
}

function mapActivity(item: ActivityResponse) {
  return {
    text: item.description,
    time: timeAgo(item.createdAt),
    color: item.color || '#2DD4A8',
  };
}

function mapTestimonial(item: TestimonialResponse) {
  return {
    id: item.id,
    author: item.author,
    company: item.company,
    role: item.role ?? '',
    content: item.content,
    rating: item.rating ?? 5,
    published: item.published,
    updated: timeAgo(item.updatedAt),
  };
}

function mapPortfolio(item: PortfolioResponse) {
  return {
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    description: item.description,
    category: item.category,
    color: item.color,
    tags: item.tags,
    metrics: item.metrics,
    imageUrl: item.imageUrl,
    thumbnailUrl: item.thumbnailUrl,
    liveUrl: item.liveUrl,
    repoUrl: item.repoUrl,
    featured: item.featured,
    published: item.published,
    sortOrder: item.sortOrder,
    updated: timeAgo(item.updatedAt),
  };
}

// ── Helper Utilities ──

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileType(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'Image';
  if (mimeType.startsWith('video/')) return 'Video';
  if (mimeType.startsWith('audio/')) return 'Audio';
  if (mimeType.includes('pdf')) return 'PDF';
  return 'File';
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
