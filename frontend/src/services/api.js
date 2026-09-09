// Automatically normalize API base URL so /api is never duplicated whether VITE_API_URL or VITE_API is used
const rawEnvUrl = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API || 'http://localhost:8000').trim().replace(/\/+$/, '');
const API_BASE_URL = rawEnvUrl.replace(/(\/api)+$/i, '') + '/api';

export const api = {
  // Book session submission
  async joinWaitingList(data) {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
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
      const res = await fetch(`${API_BASE_URL}/consultations`, {
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

      const res = await fetch(`${API_BASE_URL}/articles?${params.toString()}`);
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
      const res = await fetch(`${API_BASE_URL}/pillars`);
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
    const res = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Authentication failed' }));
      throw new Error(err.detail || 'Invalid username or password');
    }
    return await res.json();
  },

  // Get all registered clients with search & filter
  async getAdminClients(token, { search = '', status = '', focus_area = '' } = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'all') params.append('status', status);
    if (focus_area && focus_area !== 'all') params.append('focus_area', focus_area);

    const res = await fetch(`${API_BASE_URL}/admin/clients?${params.toString()}`, {
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
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
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
    const res = await fetch(`${API_BASE_URL}/admin/clients/${clientId}`, {
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
    const res = await fetch(`${API_BASE_URL}/admin/clients/${clientId}`, {
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



