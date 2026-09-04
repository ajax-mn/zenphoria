import React, { useState } from 'react';
import { X, CheckCircle2, Sparkles, Send } from 'lucide-react';

export default function WaitingListModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    focusArea: 'Stress & Anxiety',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({ name: '', email: '', focusArea: 'Stress & Anxiety', notes: '' });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleReset}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleReset} aria-label="Close modal">
          <X size={18} />
        </button>

        {!submitted ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="section-overline" style={{ margin: 0 }}>Priority Access</span>
            </div>
            <h2 className="page-title" style={{ fontSize: '28px', marginBottom: '10px' }}>
              Join the Waiting List
            </h2>
            <p className="page-subtitle" style={{ fontSize: '14px', marginBottom: '22px' }}>
              Bookings are currently paused to maintain clinical depth. Secure your place for our next intake of client cohorts.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Julian Hayes"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="julian@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Interest</label>
                <select 
                  className="form-select"
                  value={formData.focusArea}
                  onChange={(e) => setFormData({ ...formData, focusArea: e.target.value })}
                >
                  <option value="Stress & Anxiety">Stress & Anxiety</option>
                  <option value="Relationships">Relationships</option>
                  <option value="Personal Growth">Personal Growth</option>
                  <option value="General Consultation">General Consultation</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Additional Context (Optional)</label>
                <textarea 
                  className="form-textarea" 
                  rows={3}
                  placeholder="Share any specific goals or areas you wish to address..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                <Send size={16} /> Request Invitation
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ display: 'inline-flex', padding: '16px', background: '#E2E9E2', borderRadius: '50%', color: '#3A4B3A', marginBottom: '16px' }}>
              <CheckCircle2 size={40} />
            </div>
            <h2 className="page-title" style={{ fontSize: '26px', marginBottom: '10px' }}>
              You're on the Waiting List
            </h2>
            <p className="page-subtitle" style={{ fontSize: '14px', maxWidth: '360px', margin: '0 auto 24px' }}>
              Thank you, <strong>{formData.name || 'there'}</strong>. We have reserved your priority position for <em>{formData.focusArea}</em>. You will receive private cohort invitations at <strong>{formData.email}</strong>.
            </p>
            <button className="btn btn-primary" onClick={handleReset}>
              Return to Zenphoria
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
