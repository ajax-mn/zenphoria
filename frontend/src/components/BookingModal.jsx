import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Calendar, Clock, Video, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import WhatsAppRedirectButton from './WhatsAppRedirectButton';
import DateTimePicker from './DateTimePicker';

export default function BookingModal({ isOpen, onClose, initialData }) {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [meetLink, setMeetLink] = useState('');
  const [scheduleError, setScheduleError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    focusArea: 'Stress & Anxiety',
    cadence: 'Bi-Weekly Modular Cadence',
    preferredDate: '',
    isoDatetime: '',
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
          isoDatetime: '',
          notes: initialData.notes || ''
        });
      }
      setMeetLink('');
      setScheduleError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) return;
    setIsLoading(true);
    setScheduleError('');
    setMeetLink('');

    // Step 1: Call the schedule-consultation API to create Google Calendar event + Meet link
    let calendarSuccess = false;
    if (formData.isoDatetime) {
      const scheduleResult = await api.scheduleConsultation({
        client_name: formData.name,
        client_email: formData.email,
        preferred_datetime: formData.isoDatetime,
        duration_minutes: 50,
        focus_area: formData.focusArea,
        notes: formData.notes || ''
      });

      if (scheduleResult && scheduleResult.success && scheduleResult.meet_link) {
        setMeetLink(scheduleResult.meet_link);
        calendarSuccess = true;
      } else {
        // Calendar scheduling failed but we'll still save the booking
        const errorMsg = scheduleResult?.error || 'Could not create calendar event';
        console.warn('Calendar scheduling issue:', errorMsg);
        setScheduleError(errorMsg);
      }
    }

    // Step 2: If calendar scheduling failed or no ISO datetime, save as regular booking
    if (!calendarSuccess) {
      const formattedNotes = [
        formData.preferredDate ? `[Preferred Date & Time: ${formData.preferredDate}]` : '',
        formData.notes ? `Notes: ${formData.notes}` : ''
      ].filter(Boolean).join(' ');

      await api.joinWaitingList({
        name: formData.name,
        email: formData.email,
        focus_area: formData.focusArea,
        cadence: formData.cadence,
        notes: formattedNotes
      });
    }

    setIsLoading(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setMeetLink('');
    setScheduleError('');
    setFormData({ name: '', email: '', focusArea: 'Stress & Anxiety', cadence: 'Bi-Weekly Modular Cadence', preferredDate: '', isoDatetime: '', notes: '' });
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
                <DateTimePicker
                  value={formData.preferredDate}
                  onChange={(val) => setFormData((prev) => ({ ...prev, preferredDate: val }))}
                  onISOChange={(isoVal) => setFormData((prev) => ({ ...prev, isoDatetime: isoVal }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Additional Notes & Goals</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Share any specific outcomes or topics you'd like to explore..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', width: '100%', justifyContent: 'center' }} disabled={isLoading}>
                <Calendar size={16} />
                <span>{isLoading ? 'Scheduling Consultation...' : 'Schedule Consultation'}</span>
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ display: 'inline-flex', padding: '16px', background: '#E2E9E2', borderRadius: '50%', color: '#3A4B3A', marginBottom: '16px' }}>
              <CheckCircle2 size={40} />
            </div>
            <h2 className="page-title" style={{ fontSize: '26px', marginBottom: '10px' }}>
              {meetLink ? 'Consultation Scheduled!' : 'Booking Confirmed!'}
            </h2>
            <p className="page-subtitle" style={{ fontSize: '14.5px', maxWidth: '400px', margin: '0 auto 14px' }}>
              Thank you, <strong>{formData.name || 'there'}</strong>. {meetLink
                ? <>A Google Calendar invite with Meet link has been sent to <strong>{formData.email}</strong>.</>
                : <>Confirmation details have been sent to <strong>{formData.email}</strong>.</>
              }
            </p>

            {/* Google Meet Link Card */}
            {meetLink && (
              <div style={{
                background: 'linear-gradient(135deg, #1a6b3c 0%, #2d8a56 100%)',
                borderRadius: '14px',
                padding: '18px 20px',
                maxWidth: '400px',
                margin: '0 auto 16px',
                textAlign: 'left',
                color: '#fff',
                boxShadow: '0 4px 16px rgba(26, 107, 60, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Video size={20} />
                  <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700, opacity: 0.9 }}>
                    Google Meet Video Link
                  </div>
                </div>
                <a
                  href={meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    wordBreak: 'break-all',
                    border: '1px solid rgba(255,255,255,0.2)',
                    marginBottom: '12px',
                    transition: 'background 0.2s'
                  }}
                >
                  🔗 {meetLink}
                </a>
                <a
                  href={meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#fff',
                    color: '#1a6b3c',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                >
                  <Video size={15} /> Join Meeting Now →
                </a>
              </div>
            )}

            {/* Schedule Error Notice */}
            {scheduleError && !meetLink && (
              <div style={{
                background: '#FFF8E1',
                border: '1px solid #FFE0B2',
                borderRadius: '12px',
                padding: '12px 16px',
                maxWidth: '400px',
                margin: '0 auto 16px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <AlertCircle size={18} color="#E65100" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#E65100', fontWeight: 700, marginBottom: '4px' }}>
                    Calendar Scheduling Notice
                  </div>
                  <div style={{ fontSize: '13px', color: '#5D4037', lineHeight: 1.4 }}>
                    Your booking has been saved. The Meet link could not be generated automatically — our team will email it to you shortly.
                  </div>
                </div>
              </div>
            )}

            {formData.preferredDate && (
              <div style={{
                background: 'var(--bg-card, #F2EFE8)',
                border: '1px solid var(--border-color, #E2DFD4)',
                borderRadius: '12px',
                padding: '12px 16px',
                maxWidth: '400px',
                margin: '0 auto 20px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Clock size={18} color="var(--accent-sage, #566956)" />
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', fontWeight: 700 }}>
                    Scheduled Session
                  </div>
                  <div style={{ fontSize: '13.5px', color: 'var(--text-headline)', fontWeight: 600 }}>
                    {formData.preferredDate}
                  </div>
                </div>
              </div>
            )}

            <div style={{ maxWidth: '360px', margin: '0 auto 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <WhatsAppRedirectButton 
                clientName={formData.name} 
                customMessage={`Hi, I just booked a Zenphoria consultation session for ${formData.focusArea}${formData.preferredDate ? ` scheduled for ${formData.preferredDate}` : ''}. I'd like to confirm the details.`}
              />

              <button
                type="button"
                className="btn btn-outline"
                onClick={handleReset}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Return to Zenphoria
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
