import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Calendar } from 'lucide-react';
import { api } from '../services/api';

export default function BookingModal({ isOpen, onClose, initialData }) {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    focusArea: 'Stress & Anxiety',
    cadence: 'Bi-Weekly Modular Cadence',
    preferredDate: '',
    notes: ''
  });

  // Pre-fill preferences when modal opens from consultation assessment
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          email: initialData.email || '',
          focusArea: initialData.focusArea || 'Stress & Anxiety',
          cadence: initialData.cadence || 'Bi-Weekly Modular Cadence',
          preferredDate: initialData.preferredDate || '',
          notes: initialData.notes || ''
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) return;
    setIsLoading(true);

    const formattedNotes = [
      formData.preferredDate ? `[Preferred Date: ${formData.preferredDate}]` : '',
      formData.notes ? `Notes: ${formData.notes}` : ''
    ].filter(Boolean).join(' ');

    // Single API call to save booking record to Neon DB (bookings table)
    await api.joinWaitingList({
      name: formData.name,
      email: formData.email,
      focus_area: formData.focusArea,
      cadence: formData.cadence,
      notes: formattedNotes
    });

    setIsLoading(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({ name: '', email: '', focusArea: 'Stress & Anxiety', cadence: 'Bi-Weekly Modular Cadence', preferredDate: '', notes: '' });
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
              <span className="section-overline" style={{ margin: 0 }}>
                {initialData ? 'Tailored Consultation Booking' : 'Direct Session Reservation'}
              </span>
            </div>
            <h2 className="page-title" style={{ fontSize: '28px', marginBottom: '10px' }}>
              Book Your Session
            </h2>
            <p className="page-subtitle" style={{ fontSize: '14.5px', marginBottom: '22px' }}>
              {initialData 
                ? 'Your tailored preferences from your consultation assessment have been pre-filled below.'
                : 'Schedule your preliminary clinical consultation with Zenphoria specialists.'}
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
                <label className="form-label">Primary Focus Area</label>
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
                <label className="form-label">Preferred Session Cadence</label>
                <select 
                  className="form-select"
                  value={formData.cadence}
                  onChange={(e) => setFormData({ ...formData, cadence: e.target.value })}
                >
                  <option value="Weekly 1-on-1 Intensive">Weekly 1-on-1 Intensive</option>
                  <option value="Bi-Weekly Modular Cadence">Bi-Weekly Modular Cadence</option>
                  <option value="Executive Single Deep Dive">Executive Single Deep Dive</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Time Window / Date</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Next Monday Morning or Next Available"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Additional Notes & Goals</label>
                <textarea 
                  className="form-textarea" 
                  rows={3}
                  placeholder="Share any specific outcomes or topics you'd like to explore..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }} disabled={isLoading}>
                <Calendar size={16} />
                <span>{isLoading ? 'Saving Booking...' : 'Confirm Booking'}</span>
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ display: 'inline-flex', padding: '16px', background: '#E2E9E2', borderRadius: '50%', color: '#3A4B3A', marginBottom: '16px' }}>
              <CheckCircle2 size={40} />
            </div>
            <h2 className="page-title" style={{ fontSize: '26px', marginBottom: '10px' }}>
              Booking Confirmed!
            </h2>
            <p className="page-subtitle" style={{ fontSize: '14.5px', maxWidth: '400px', margin: '0 auto 24px' }}>
              Thank you, <strong>{formData.name || 'there'}</strong>. Your consultation reservation for <em>{formData.focusArea}</em> ({formData.cadence}) has been stored in our clinical database. Confirmation details have been sent to <strong>{formData.email}</strong>.
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
