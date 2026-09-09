import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  LogOut, 
  RefreshCw, 
  Download, 
  Search, 
  Filter, 
  Users, 
  CheckCircle2, 
  Clock, 
  Mail, 
  Calendar, 
  Trash2, 
  ExternalLink, 
  X, 
  AlertCircle,
  Copy,
  Check,
  ChevronDown
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminPage({ onNavigate }) {
  // Authentication State
  const [token, setToken] = useState(() => localStorage.getItem('zenphoria_admin_token') || '');
  const [adminUser, setAdminUser] = useState(() => localStorage.getItem('zenphoria_admin_user') || '');
  
  // Login Form State
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard State
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingClients, setLoadingClients] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [focusFilter, setFocusFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  const [copiedEmail, setCopiedEmail] = useState('');

  // Fetch client data on login or refresh
  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token]);

  const loadDashboardData = async () => {
    setLoadingClients(true);
    try {
      const [clientsData, statsData] = await Promise.all([
        api.getAdminClients(token),
        api.getAdminStats(token).catch(() => null)
      ]);
      setClients(clientsData || []);
      if (statsData) setStats(statsData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      if (err.message && err.message.includes('401')) {
        handleLogout();
        setLoginError('Your session has expired. Please log in again.');
      } else {
        setActionMessage({ type: 'error', text: 'Error connecting to database. Please check backend connection.' });
      }
    } finally {
      setLoadingClients(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginForm.username.trim() || !loginForm.password.trim()) {
      setLoginError('Please provide both administrator username and password.');
      return;
    }

    setLoginLoading(true);
    try {
      const res = await api.adminLogin(loginForm.username, loginForm.password);
      if (res.token) {
        localStorage.setItem('zenphoria_admin_token', res.token);
        localStorage.setItem('zenphoria_admin_user', res.username);
        setToken(res.token);
        setAdminUser(res.username);
        setLoginForm({ username: '', password: '' });
      }
    } catch (err) {
      setLoginError(err.message || 'Invalid administrator username or password.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('zenphoria_admin_token');
    localStorage.removeItem('zenphoria_admin_user');
    setToken('');
    setAdminUser('');
    setClients([]);
    setSelectedClient(null);
  };

  const handleStatusChange = async (clientId, newStatus) => {
    try {
      const updated = await api.updateClient(token, clientId, { status: newStatus });
      setClients(prev => prev.map(c => c.id === clientId ? { ...c, status: updated.status } : c));
      if (selectedClient && selectedClient.id === clientId) {
        setSelectedClient(prev => ({ ...prev, status: updated.status }));
      }
      showTemporaryNotice('success', `Client status updated to "${newStatus}".`);
    } catch (err) {
      showTemporaryNotice('error', 'Failed to update status: ' + err.message);
    }
  };

  const handleDeleteClient = async (clientId, clientName) => {
    if (!window.confirm(`Are you sure you want to permanently delete registration for "${clientName}"?`)) {
      return;
    }
    try {
      await api.deleteClient(token, clientId);
      setClients(prev => prev.filter(c => c.id !== clientId));
      if (selectedClient && selectedClient.id === clientId) {
        setSelectedClient(null);
      }
      showTemporaryNotice('success', `Client registration for "${clientName}" removed.`);
    } catch (err) {
      showTemporaryNotice('error', 'Failed to delete client: ' + err.message);
    }
  };

  const showTemporaryNotice = (type, text) => {
    setActionMessage({ type, text });
    setTimeout(() => {
      setActionMessage({ type: '', text: '' });
    }, 4000);
  };

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(''), 2000);
  };

  const handleExportCSV = () => {
    if (!clients.length) return;
    const headers = ['ID', 'Name', 'Email', 'Focus Area', 'Cadence', 'Status', 'Notes', 'Created At'];
    const rows = filteredClients.map(c => [
      `"${c.id}"`,
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${(c.email || '').replace(/"/g, '""')}"`,
      `"${(c.focus_area || '').replace(/"/g, '""')}"`,
      `"${(c.cadence || '').replace(/"/g, '""')}"`,
      `"${(c.status || '').replace(/"/g, '""')}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`,
      `"${c.created_at ? new Date(c.created_at).toLocaleString() : ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `zenphoria_registered_clients_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered and searched clients
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchSearch = searchTerm === '' || 
        (client.name && client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.focus_area && client.focus_area.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.notes && client.notes.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = statusFilter === 'all' || 
        (client.status && client.status.toLowerCase() === statusFilter.toLowerCase());

      const matchFocus = focusFilter === 'all' || 
        (client.focus_area && client.focus_area.toLowerCase() === focusFilter.toLowerCase());

      return matchSearch && matchStatus && matchFocus;
    });
  }, [clients, searchTerm, statusFilter, focusFilter]);

  // Unique focus areas for filter dropdown
  const uniqueFocusAreas = useMemo(() => {
    const areas = new Set(clients.map(c => c.focus_area).filter(Boolean));
    return Array.from(areas);
  }, [clients]);

  // If Not Authenticated: Render Login Page
  if (!token) {
    return (
      <div className="page-wrapper admin-login-wrapper">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-badge">
              <ShieldCheck size={16} />
              <span>Admin Access</span>
            </div>
            <h1 className="admin-login-title">Clinical Administration</h1>
            <p className="admin-login-subtitle">
              Sign in with administrative credentials to access and manage registered client records.
            </p>
          </div>

          {loginError && (
            <div className="admin-alert admin-alert-error">
              <AlertCircle size={18} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="admin-login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="admin-username">Administrator Name / Username</label>
              <div className="input-with-icon">
                <User className="input-icon" size={18} />
                <input
                  id="admin-username"
                  type="text"
                  className="input-field"
                  placeholder="Enter admin username"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  autoFocus
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-password">Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={18} />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Enter admin password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block admin-submit-btn"
              disabled={loginLoading}
            >
              {loginLoading ? (
                <>
                  <RefreshCw size={16} className="spin-icon" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="admin-login-footer">
            <button 
              type="button" 
              className="admin-back-home-btn"
              onClick={() => onNavigate('home')}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If Authenticated: Render Admin Dashboard
  return (
    <div className="page-wrapper admin-dashboard-wrapper">
      {/* Top Banner & Control Bar */}
      <div className="admin-header-bar">
        <div className="admin-title-group">
          <div className="admin-badge">
            <ShieldCheck size={14} />
            <span>Admin Portal</span>
          </div>
          <h1 className="admin-page-title">Registered Client Management</h1>
          <p className="admin-page-desc">
            Directly synced with Neon PostgreSQL database. View, filter, and manage consultation bookings.
          </p>
        </div>

        <div className="admin-actions-group">
          <button 
            className="btn btn-outline admin-btn-sm" 
            onClick={loadDashboardData}
            title="Refresh Client Records"
            disabled={loadingClients}
          >
            <RefreshCw size={15} className={loadingClients ? 'spin-icon' : ''} />
            <span>Refresh</span>
          </button>

          <button 
            className="btn btn-outline admin-btn-sm" 
            onClick={handleExportCSV}
            title="Export Records to CSV"
            disabled={!filteredClients.length}
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>

          <button 
            className="btn btn-secondary admin-btn-sm admin-logout-btn" 
            onClick={handleLogout}
            title="Log Out of Admin Session"
          >
            <LogOut size={15} />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Action Notification Message */}
      {actionMessage.text && (
        <div className={`admin-alert ${actionMessage.type === 'error' ? 'admin-alert-error' : 'admin-alert-success'}`}>
          {actionMessage.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Metric Cards Overview */}
      <div className="admin-metrics-grid">
        <div className="admin-metric-card">
          <div className="admin-metric-icon-wrap" style={{ background: 'var(--bg-subtle-badge-green)' }}>
            <Users size={20} color="var(--accent-sage)" />
          </div>
          <div className="admin-metric-data">
            <span className="admin-metric-label">Total Registered Clients</span>
            <span className="admin-metric-value">{clients.length}</span>
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-icon-wrap" style={{ background: 'var(--bg-subtle-badge-sand)' }}>
            <CheckCircle2 size={20} color="#8A7340" />
          </div>
          <div className="admin-metric-data">
            <span className="admin-metric-label">Confirmed Sessions</span>
            <span className="admin-metric-value">
              {clients.filter(c => (c.status || '').toLowerCase() === 'confirmed').length}
            </span>
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-icon-wrap" style={{ background: 'var(--bg-subtle-badge-rose)' }}>
            <Clock size={20} color="#9E5D4B" />
          </div>
          <div className="admin-metric-data">
            <span className="admin-metric-label">In Progress / Pending</span>
            <span className="admin-metric-value">
              {clients.filter(c => (c.status || '').toLowerCase() !== 'confirmed').length}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <Search size={18} className="admin-search-icon" />
          <input
            type="text"
            className="input-field admin-search-input"
            placeholder="Search by client name, email, focus area, notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="admin-clear-search-btn"
              onClick={() => setSearchTerm('')}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="admin-filter-group">
          <div className="admin-select-wrapper">
            <Filter size={14} className="select-icon" />
            <select
              className="admin-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-review">In Review</option>
              <option value="contacted">Contacted</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="admin-select-wrapper">
            <select
              className="admin-select"
              value={focusFilter}
              onChange={(e) => setFocusFilter(e.target.value)}
            >
              <option value="all">All Focus Areas</option>
              {uniqueFocusAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Clients Table Card */}
      <div className="admin-table-card">
        <div className="admin-table-header-info">
          <span className="admin-table-count">
            Showing <strong>{filteredClients.length}</strong> of <strong>{clients.length}</strong> registered clients
          </span>
          {(searchTerm || statusFilter !== 'all' || focusFilter !== 'all') && (
            <button
              className="admin-reset-filters-btn"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setFocusFilter('all');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {loadingClients ? (
          <div className="admin-table-loading">
            <RefreshCw size={28} className="spin-icon" />
            <p>Fetching records from Neon PostgreSQL database...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="admin-table-empty">
            <Users size={36} strokeWidth={1.5} />
            <h3>No client registrations found</h3>
            <p>
              {searchTerm || statusFilter !== 'all' || focusFilter !== 'all'
                ? "Try adjusting your search terms or filters."
                : "No registered clients in the database yet. When visitors book sessions, their details will appear here."}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Contact Email</th>
                  <th>Focus Area</th>
                  <th>Cadence</th>
                  <th>Registered Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => {
                  const initial = (client.name || 'C').charAt(0).toUpperCase();
                  const dateFormatted = client.created_at 
                    ? new Date(client.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Recent';

                  return (
                    <tr key={client.id} className="admin-table-row">
                      {/* Client Name & Avatar */}
                      <td>
                        <div className="client-cell">
                          <div className="client-avatar">{initial}</div>
                          <div className="client-meta">
                            <span className="client-name">{client.name || 'Anonymous Client'}</span>
                            <span className="client-id-sub">{client.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td>
                        <div className="client-email-cell">
                          <a href={`mailto:${client.email}`} className="client-email-link">
                            {client.email}
                          </a>
                          <button 
                            className="btn-copy-email"
                            onClick={() => handleCopyEmail(client.email)}
                            title="Copy email address"
                          >
                            {copiedEmail === client.email ? <Check size={13} color="green" /> : <Copy size={13} />}
                          </button>
                        </div>
                      </td>

                      {/* Focus Area */}
                      <td>
                        <span className="focus-pill">
                          {client.focus_area || 'General'}
                        </span>
                      </td>

                      {/* Cadence */}
                      <td>
                        <span className="cadence-text">
                          {client.cadence || 'Bi-Weekly Modular'}
                        </span>
                      </td>

                      {/* Created At */}
                      <td>
                        <span className="date-text">{dateFormatted}</span>
                      </td>

                      {/* Status Selector */}
                      <td>
                        <select
                          className={`status-select-pill status-${(client.status || 'confirmed').toLowerCase()}`}
                          value={client.status || 'confirmed'}
                          onChange={(e) => handleStatusChange(client.id, e.target.value)}
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="in-review">In Review</option>
                          <option value="contacted">Contacted</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div className="table-actions">
                          <button
                            className="btn-table-action"
                            onClick={() => setSelectedClient(client)}
                            title="View Full Client Record"
                          >
                            Details
                          </button>
                          <button
                            className="btn-table-action btn-table-action-delete"
                            onClick={() => handleDeleteClient(client.id, client.name)}
                            title="Delete Client Registration"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="modal-overlay" onClick={() => setSelectedClient(null)}>
          <div className="modal-container admin-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="admin-badge">
                <ShieldCheck size={14} />
                <span>Client Record</span>
              </div>
              <button 
                className="modal-close-btn" 
                onClick={() => setSelectedClient(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body admin-detail-body">
              <div className="admin-client-detail-header">
                <div className="client-avatar-large">
                  {(selectedClient.name || 'C').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="admin-client-name">{selectedClient.name}</h2>
                  <div className="admin-client-email-row">
                    <Mail size={15} />
                    <a href={`mailto:${selectedClient.email}`}>{selectedClient.email}</a>
                  </div>
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Booking ID</span>
                  <span className="detail-value mono-text">{selectedClient.id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Focus Area</span>
                  <span className="detail-value">{selectedClient.focus_area}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Cadence Preference</span>
                  <span className="detail-value">{selectedClient.cadence}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Registration Timestamp</span>
                  <span className="detail-value">
                    {selectedClient.created_at ? new Date(selectedClient.created_at).toLocaleString() : 'N/A'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Current Status</span>
                  <select
                    className={`status-select-pill status-${(selectedClient.status || 'confirmed').toLowerCase()}`}
                    value={selectedClient.status || 'confirmed'}
                    onChange={(e) => handleStatusChange(selectedClient.id, e.target.value)}
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="in-review">In Review</option>
                    <option value="contacted">Contacted</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Client Notes Section */}
              <div className="detail-notes-card">
                <span className="detail-label">Submitted Notes & Objectives</span>
                <p className="detail-notes-text">
                  {selectedClient.notes && selectedClient.notes.trim() 
                    ? selectedClient.notes 
                    : 'No additional clinical notes provided with this registration.'}
                </p>
              </div>

              <div className="modal-footer-actions">
                <a 
                  href={`mailto:${selectedClient.email}?subject=Zenphoria Consultation Next Steps&body=Hello ${selectedClient.name},%0D%0A%0D%0AThank you for reaching out regarding your ${selectedClient.focus_area} consultation...`}
                  className="btn btn-primary"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <Mail size={16} />
                  <span>Send Direct Email</span>
                </a>
                <button 
                  className="btn btn-outline"
                  onClick={() => setSelectedClient(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
