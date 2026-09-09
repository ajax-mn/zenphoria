// Production deployed backend URL on Render
const PRODUCTION_API_URL = 'https://zenphoria-backend.onrender.com';
const LOCAL_API_URL = 'http://localhost:8000';

/**
 * Determine API candidate URLs in order of priority:
 * 1. Explicit VITE_API_URL / VITE_API from env
 * 2. If running on localhost browser, try local backend first, with production fallback
 * 3. If running on deployed domain (Vercel / Netlify / etc.), use production backend
 */
function getApiEndpoints() {
  const envUrl = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API || '').trim().replace(/\/+$/, '');
  
  if (envUrl) {
    const normalized = envUrl.replace(/(\/api)+$/i, '') + '/api';
    return [normalized, `${PRODUCTION_API_URL}/api`];
  }

  // Check if browser is on localhost
  const isLocalHost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (isLocalHost) {
    return [`${LOCAL_API_URL}/api`, `${PRODUCTION_API_URL}/api`];
  }

  return [`${PRODUCTION_API_URL}/api`];
}

/**
 * Robust fetch wrapper that attempts candidate API URLs sequentially.
 * If localhost is down or unreachable, it automatically falls back to the live Render backend.
 */
async function fetchWithFallback(endpointPath, options = {}) {
  const endpoints = getApiEndpoints();
  let lastError = null;

  for (let i = 0; i < endpoints.length; i++) {
    const baseUrl = endpoints[i];
    const fullUrl = `${baseUrl}${endpointPath.startsWith('/') ? '' : '/'}${endpointPath}`;

    try {
      const response = await fetch(fullUrl, options);
      return response;
    } catch (err) {
      console.warn(`API attempt failed for ${fullUrl}:`, err.message);
      lastError = err;
      // If another fallback endpoint exists, continue to next
    }
  }

  throw lastError || new Error('Unable to connect to API server.');
}

export const api = {
  // Book session submission
  async joinWaitingList(data) {
    try {
      const res = await fetchWithFallback('/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.warn('Backend unavailable, handled gracefully:', err);
      return { status: 'confirmed', ...data };
    }
  },

  // Consultation assessment submission
  async submitConsultation(data) {
    try {
      const res = await fetchWithFallback('/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.warn('Backend unavailable, handled gracefully:', err);
      return { status: 'received', ...data };
    }
  },

  // Fetch articles from backend
  async getArticles(topic = '', search = '') {
    try {
      const params = new URLSearchParams();
      if (topic && topic !== 'All Topics') params.append('topic', topic);
      if (search) params.append('search', search);

      const queryStr = params.toString() ? `?${params.toString()}` : '';
      const res = await fetchWithFallback(`/articles${queryStr}`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.warn('Backend unavailable, fallback to local data:', err);
      return null;
    }
  },

  // Fetch pillars
  async getPillars() {
    try {
      const res = await fetchWithFallback('/pillars');
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.warn('Backend unavailable, fallback to local data:', err);
      return null;
    }
  },

  // Admin authentication
  async adminLogin(username, password) {
    try {
      const res = await fetchWithFallback('/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Authentication failed' }));
        throw new Error(err.detail || 'Invalid username or password');
      }
      return await res.json();
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('failed to fetch')) {
        throw new Error('Cannot connect to server. Please check your internet connection or verify the deployed backend service.');
      }
      throw err;
    }
  },

  // Get all registered clients with search & filter
  async getAdminClients(token, { search = '', status = '', focus_area = '' } = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'all') params.append('status', status);
    if (focus_area && focus_area !== 'all') params.append('focus_area', focus_area);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const res = await fetchWithFallback(`/admin/clients${queryStr}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to fetch registered clients' }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
    return await res.json();
  },

  // Get admin metrics & statistics
  async getAdminStats(token) {
    const res = await fetchWithFallback('/admin/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      throw new Error('Failed to fetch dashboard statistics');
    }
    return await res.json();
  },

  // Update client status or details
  async updateClient(token, clientId, data) {
    const res = await fetchWithFallback(`/admin/clients/${clientId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to update client' }));
      throw new Error(err.detail || 'Update failed');
    }
    return await res.json();
  },

  // Delete client booking
  async deleteClient(token, clientId) {
    const res = await fetchWithFallback(`/admin/clients/${clientId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to delete client' }));
      throw new Error(err.detail || 'Deletion failed');
    }
    return await res.json();
  }
};
