const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = {
  // Book session submission
  async joinWaitingList(data) {
    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
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
      return await res.json();
    } catch (err) {
      console.warn('Backend unavailable, fallback to local data:', err);
      return null;
    }
  }
};
