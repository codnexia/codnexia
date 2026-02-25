// ── API utility for communicating with the NestJS backend ──
// All fetch calls go through here. JWT token is auto-attached.

const API_URL = 'http://localhost:3000/api';

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

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }

  return res.json();
}

// ── Auth ──

export async function login(email: string, password: string) {
  const data = await apiFetch<{ user: any; accessToken: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  // Store token so all future requests are authenticated
  setToken(data.accessToken);
  return data;
}

export async function getProfile() {
  return apiFetch<{ id: string; name: string; email: string; createdAt: string }>('/auth/me');
}

export async function updateProfile(data: { name?: string; email?: string }) {
  return apiFetch<{ id: string; name: string; email: string; createdAt: string }>('/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// ── Contact ──

export async function submitContact(form: {
  name: string; email: string; company?: string;
  service?: string; budget?: string; message: string;
}) {
  return apiFetch('/contact', { method: 'POST', body: JSON.stringify(form) });
}

// ── Content Pages ──

export async function getContentPages() {
  const pages = await apiFetch<any[]>('/content');
  return pages.map(mapContentPage);
}

export async function createContentPage(data: { name: string; content?: string; status?: string }) {
  const page = await apiFetch<any>('/content', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return mapContentPage(page);
}

export async function updateContentPage(id: string, data: { name?: string; content?: string; status?: string }) {
  const page = await apiFetch<any>(`/content/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return mapContentPage(page);
}

export async function deleteContentPage(id: string) {
  return apiFetch(`/content/${id}`, { method: 'DELETE' });
}

// ── Media Files ──

export async function getMediaFiles() {
  const files = await apiFetch<any[]>('/media');
  return files.map(mapMediaFile);
}

export async function uploadMediaFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const result = await apiFetch<any>('/media/upload', {
    method: 'POST',
    body: formData,
  });
  return mapMediaFile(result);
}

export async function deleteMediaFile(id: string) {
  return apiFetch(`/media/${id}`, { method: 'DELETE' });
}

// ── Analytics ──

export async function getDashboardData() {
  return apiFetch<{
    stats: any[];
    weeklyTraffic: { data: number[]; labels: string[] };
  }>('/analytics/dashboard');
}

export async function getVisitorData() {
  return apiFetch<{ stats: any[]; visitors: any[] }>('/analytics/visitors');
}

// Public endpoint - tracks a page view from the client site
export async function trackPageView(page: string, sessionId: string, device: string) {
  return apiFetch('/analytics/track', {
    method: 'POST',
    body: JSON.stringify({ page, sessionId, device }),
  });
}

// ── Activity Feed ──

export async function getRecentActivity() {
  const items = await apiFetch<any[]>('/activity');
  return items.map(mapActivity);
}

// ── Response Mappers ──
// Transform backend responses to match the frontend type shapes

function mapContentPage(page: any) {
  return {
    id: page.id as string,
    name: page.name as string,
    status: page.status as string,
    updated: timeAgo(page.updatedAt),
    content: page.content as string,
  };
}

function mapMediaFile(file: any) {
  return {
    id: file.id as string,
    name: file.originalName as string,
    size: formatFileSize(file.size),
    type: getFileType(file.mimeType),
    date: formatDate(file.createdAt),
  };
}

function mapActivity(item: any) {
  return {
    text: item.description as string,
    time: timeAgo(item.createdAt),
    color: (item.color || '#2DD4A8') as string,
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
  if (mimeType.includes('svg')) return 'SVG';
  if (mimeType.startsWith('image/')) return 'Image';
  if (mimeType.startsWith('video/')) return 'Video';
  if (mimeType.startsWith('audio/')) return 'Audio';
  if (mimeType.includes('pdf')) return 'PDF';
  return 'File';
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
