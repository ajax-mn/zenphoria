import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  FileText, 
  Headphones, 
  Briefcase, 
  AlertTriangle, 
  Mail, 
  ExternalLink,
  CheckCircle2,
  Send
} from 'lucide-react';
import { LEGAL_SECTIONS } from '../data/legalData';
import WhatsAppRedirectButton from './WhatsAppRedirectButton';

export default function LegalModal({ isOpen, onClose, defaultTab = 'ethics' }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: 'General Support', message: '' });

  useEffect(() => {
    if (defaultTab && LEGAL_SECTIONS[defaultTab]) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab, isOpen]);

  if (!isOpen) return null;

  const currentSection = LEGAL_SECTIONS[activeTab] || LEGAL_SECTIONS.ethics;

  const getTabIcon = (tabId) => {
    switch (tabId) {
      case 'ethics':
        return <ShieldCheck size={16} />;
      case 'privacy':
        return <Lock size={16} />;
      case 'terms':
        return <FileText size={16} />;
      case 'support':
        return <Headphones size={16} />;
      case 'careers':
        return <Briefcase size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', subject: 'General Support', message: '' });
    }, 4000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '820px', 
          width: '95%',
          maxHeight: '90vh', 
          display: 'flex', 
          flexDirection: 'column', 
          padding: 0, 
          overflow: 'hidden',
          borderRadius: '16px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div style={{
          padding: '20px 24px 16px',
          background: 'var(--accent-forest, #1A221A)',
          color: '#FAF8F5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/emblem-white.png" alt="Zenphoria" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            <div>
              <div style={{ 
                fontFamily: 'Georgia, serif', 
                fontSize: '18px', 
                fontWeight: 600, 
                letterSpacing: '0.04em',
                lineHeight: 1.1
              }}>
                Zenphoria Governance & Policies
              </div>
              <div style={{ fontSize: '11.5px', color: '#D4AF37', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '2px' }}>
                Legal, Ethics & Institutional Standards
              </div>
            </div>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            style={{ 
              position: 'static', 
              background: 'rgba(255,255,255,0.12)', 
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
            aria-label="Close legal modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div style={{
          background: 'var(--bg-primary, #F7F5F0)',
          borderBottom: '1px solid var(--border-color, #E2DFD4)',
          padding: '10px 18px',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {[
            { id: 'ethics', label: 'Ethics' },
            { id: 'privacy', label: 'Privacy Policy' },
            { id: 'terms', label: 'Terms of Service' },
            { id: 'support', label: 'Contact Support' },
            { id: 'careers', label: 'Careers' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '9999px',
                  fontSize: '12.5px',
                  fontWeight: isActive ? 700 : 500,
                  background: isActive ? 'var(--btn-primary-bg, #2E382E)' : 'rgba(255,255,255,0.7)',
                  color: isActive ? '#FFFFFF' : 'var(--text-body, #4E574E)',
                  border: isActive ? '1px solid #2E382E' : '1px solid var(--border-color, #E2DFD4)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {getTabIcon(tab.id)}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content Area (Scrollable) */}
        <div style={{
          padding: '24px 28px',
          overflowY: 'auto',
          flex: 1,
          background: '#FFFFFF'
        }}>
          {/* Section Header */}
          <div style={{ marginBottom: '22px', borderBottom: '1px solid var(--border-color, #EBE8DE)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '6px' }}>
              <span style={{
                background: 'var(--bg-subtle-badge-green, #DCEADC)',
                color: 'var(--accent-olive, #215421)',
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                {currentSection.badge}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted, #7C887C)' }}>
                Updated: {currentSection.lastUpdated}
              </span>
            </div>
            <h2 className="page-title" style={{ fontSize: '24px', margin: '0 0 6px', color: 'var(--text-headline, #1A221A)' }}>
              {currentSection.title}
            </h2>
            <p className="page-subtitle" style={{ fontSize: '13.5px', margin: 0, color: 'var(--text-body, #556255)' }}>
              {currentSection.subtitle}
            </p>
          </div>

          {/* Ethics Emergency Callout */}
          {activeTab === 'ethics' && (
            <div style={{
              background: '#FFF8E7',
              border: '1px solid #FFE0A3',
              borderRadius: '10px',
              padding: '14px 16px',
              marginBottom: '20px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start'
            }}>
              <AlertTriangle size={20} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '13px', color: '#92400E', lineHeight: 1.5 }}>
                <strong>Important Clinical Notice:</strong> Zenphoria provides structured psychological education and consultation. If you or someone you know is facing an immediate life-threatening psychiatric emergency, please dial <strong>14416 (Tele-MANAS, India)</strong>, <strong>988 (USA)</strong>, or contact your nearest hospital emergency department immediately.
              </div>
            </div>
          )}

          {/* Section Clauses / Paragraphs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {currentSection.content.map((item, idx) => (
              <div key={idx} style={{ background: '#FAF9F6', borderRadius: '10px', padding: '16px 18px', border: '1px solid #EFECE4' }}>
                <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--text-headline, #202B20)', margin: '0 0 8px' }}>
                  {item.heading}
                </h3>
                <div style={{ fontSize: '13.5px', lineHeight: 1.65, color: 'var(--text-body, #4A564A)', whiteSpace: 'pre-line' }}>
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Form for Support Tab */}
          {activeTab === 'support' && (
            <div style={{ marginTop: '24px', background: '#F2EFE8', borderRadius: '12px', padding: '20px', border: '1px solid #E2DFD4' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2B372B', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={18} color="var(--accent-olive)" />
                <span>Submit a Client Support Inquiry</span>
              </h3>
              <p style={{ fontSize: '13px', color: '#6A756A', margin: '0 0 16px' }}>
                Our team responds to all scheduling, technical, and invoicing inquiries within 2-4 business hours.
              </p>

              {contactSubmitted ? (
                <div style={{
                  background: '#E2F0E2',
                  border: '1px solid #B7DDB7',
                  borderRadius: '8px',
                  padding: '14px',
                  textAlign: 'center',
                  color: '#1E5128',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <CheckCircle2 size={18} />
                  <span>Thank you! Your support ticket has been logged. Our administration desk will email you shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '12px' }}>Your Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. Maya Lin" 
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        required 
                        style={{ fontSize: '13px', padding: '8px 12px' }}
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '12px' }}>Email Address</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        placeholder="maya@example.com" 
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        required 
                        style={{ fontSize: '13px', padding: '8px 12px' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>Inquiry Type</label>
                    <select 
                      className="form-select"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      style={{ fontSize: '13px', padding: '8px 12px' }}
                    >
                      <option value="Scheduling & Rescheduling">Scheduling & Rescheduling</option>
                      <option value="Google Meet Video Link Access">Google Meet Video Link Access</option>
                      <option value="Billing & Invoicing">Billing & Invoicing</option>
                      <option value="Clinical Director Inquiry">Clinical Director Inquiry</option>
                      <option value="General Support">General Support</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>Message Details</label>
                    <textarea 
                      className="form-textarea"
                      rows={3}
                      placeholder="Please include your booking reference if applicable..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                      style={{ fontSize: '13px', padding: '8px 12px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button type="submit" className="btn btn-primary" style={{ fontSize: '13px', padding: '8px 18px' }}>
                      <Send size={14} />
                      <span>Send Support Inquiry</span>
                    </button>
                    <WhatsAppRedirectButton 
                      clientName={contactForm.name || 'Client'}
                      customMessage="Hi Zenphoria Support, I have an inquiry regarding my consultation appointment."
                    />
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Quick Apply Button for Careers Tab */}
          {activeTab === 'careers' && (
            <div style={{ marginTop: '24px', background: '#F2EFE8', borderRadius: '12px', padding: '18px 20px', border: '1px solid #E2DFD4', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14.5px', color: '#2B372B', marginBottom: '3px' }}>
                  Ready to practice with Zenphoria?
                </div>
                <div style={{ fontSize: '12.5px', color: '#6A756A' }}>
                  Send your CV & clinical orientation statement to <strong>careers@thezenphoria.com</strong>
                </div>
              </div>
              <a 
                href="mailto:careers@thezenphoria.com?subject=Clinical%20Fellowship%20Application%20-%20Zenphoria" 
                className="btn btn-primary"
                style={{ fontSize: '13px', padding: '9px 18px', textDecoration: 'none' }}
              >
                <Mail size={15} />
                <span>Email Clinical CV &rarr;</span>
              </a>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '14px 24px',
          background: 'var(--bg-primary, #F7F5F0)',
          borderTop: '1px solid var(--border-color, #E2DFD4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted, #7C887C)' }}>
            Official Legal Documentation &bull; &copy; 2026 Zenphoria
          </div>
          <button className="btn btn-outline" onClick={onClose} style={{ fontSize: '12.5px', padding: '6px 16px' }}>
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
