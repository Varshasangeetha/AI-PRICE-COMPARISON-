/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const BASE_URL = '/api';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

async function request(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers
    }
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { error: text || 'Invalid JSON response from server' };
  }

  if (!response.ok) {
    throw new Error(data.error || 'API Request failed');
  }

  return data;
}

export const api = {
  auth: {
    register: (body: any) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    profile: () => request('/auth/profile'),
    logout: () => request('/auth/logout', { method: 'POST' }),
    updateProfile: (body: any) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
  },
  search: {
    natural: (query: string) => request('/search/natural', { method: 'POST', body: JSON.stringify({ query }) }),
    semantic: (query: string) => request('/search/semantic', { method: 'POST', body: JSON.stringify({ query }) }),
    chat: (message: string, history: any[]) => request('/search/chat', { method: 'POST', body: JSON.stringify({ message, history }) }),
    history: () => request('/search/history'),
    deleteHistory: (id: string) => request(`/search/history/${id}`, { method: 'DELETE' }),
    trending: () => request('/search/trending'),
  },
  products: {
    getAll: (params: Record<string, string>) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/products?${qs}`);
    },
    getOne: (id: string) => request(`/products/${id}`),
    create: (body: any) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: any) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => request(`/products/${id}`, { method: 'DELETE' }),
    compare: (productIds: string[]) => request('/products/compare', { method: 'POST', body: JSON.stringify({ productIds }) }),
    trends: (id: string) => request(`/products/${id}/trends`),
    similar: (id: string) => request(`/products/${id}/similar`),
    submitReview: (id: string, body: any) => request(`/products/${id}/review`, { method: 'POST', body: JSON.stringify(body) }),
  },
  wishlist: {
    get: () => request('/wishlist'),
    add: (productId: string, notes?: string) => request('/wishlist', { method: 'POST', body: JSON.stringify({ productId, notes }) }),
    remove: (id: string) => request(`/wishlist/${id}`, { method: 'DELETE' }),
    check: (productId: string) => request(`/wishlist/check/${productId}`),
    recommendations: () => request('/wishlist/recommendations'),
  },
  alerts: {
    get: () => request('/alerts'),
    create: (body: any) => request('/alerts', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, targetPrice: number) => request(`/alerts/${id}`, { method: 'PUT', body: JSON.stringify({ targetPrice }) }),
    delete: (id: string) => request(`/alerts/${id}`, { method: 'DELETE' }),
    history: () => request('/alerts/history'),
    triggerCheck: () => request('/alerts/check', { method: 'POST' }),
  },
  admin: {
    getUsers: () => request('/admin/users'),
    updateUser: (id: string, body: any) => request(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    deleteUser: (id: string) => request(`/admin/users/${id}`, { method: 'DELETE' }),
    dashboard: () => request('/admin/dashboard'),
    analyticsSearch: () => request('/admin/analytics/search'),
    analyticsProducts: () => request('/admin/analytics/products'),
    analyticsPlatforms: () => request('/admin/analytics/platforms'),
    logs: () => request('/admin/logs'),
    monitor: () => request('/admin/monitor'),
  }
};
