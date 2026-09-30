import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  FileText, 
  Headphones, 
  Briefcase, 
  AlertTriangle, 
  Mail, 
  Phone, 
  Check, 
  Copy, 
  Printer, 
  Search, 
  ChevronRight, 
  ChevronDown,
  Sparkles,
  Award,
  Send,
  ExternalLink,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { 
  LEGAL_SECTIONS, 
  EMERGENCY_CONTACTS, 
  CAREER_POSITIONS, 
  SUPPORT_FAQS 
} from '../data/legalData';
import WhatsAppRedirectButton from './WhatsAppRedirectButton';

export default function LegalModal({ isOpen, onClose, defaultTab = 'ethics' }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Support form state
  const [supportForm, setSupportForm] = useState({
    name: '',
    email: '',
    bookingId: '',
    category: 'Scheduling & Rescheduling',
    message: ''
  });
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  useEffect(() => {
    if (defaultTab && LEGAL_SECTIONS[defaultTab]) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab, isOpen]);

  // Reset search when switching tabs
  useEffect(() => {
    setSearchQuery('');
  }, [activeTab]);

  if (!isOpen) return null;

  const currentSection = LEGAL_SECTIONS[activeTab] || LEGAL_SECTIONS.ethics;

  const navItems = [
    { id: 'ethics', label: 'Ethics & Governance', shortLabel: 'Ethics', icon: ShieldCheck, tag: 'Clinical Rigor' },
    { id: 'privacy', label: 'Privacy & Data Protection', shortLabel: 'Privacy', icon: Lock, tag: 'GDPR / DPDP' },
    { id: 'terms', label: 'Terms of Service', shortLabel: 'Terms', icon: FileText, tag: 'Agreements' },
    { id: 'support', label: 'Client Care & Support', shortLabel: 'Support', icon: Headphones, tag: '24/7 Desk' },
    { id: 'careers', label: 'Careers & Fellowship', shortLabel: 'Careers', icon: Briefcase, tag: 'Open Roles' }
  ];

  // Filter clauses based on search query
  const filteredClauses = useMemo(() => {
    if (!currentSection || !Array.isArray(currentSection.clauses)) return [];
    if (!searchQuery.trim()) return currentSection.clauses;
    const q = searchQuery.toLowerCase();
    return currentSection.clauses.filter(clause => 
      (clause?.title && clause.title.toLowerCase().includes(q)) ||
      (clause?.summary && clause.summary.toLowerCase().includes(q)) ||
      (Array.isArray(clause?.details) && clause.details.some(d => d && d.toLowerCase().includes(q)))
    );
  }, [currentSection, searchQuery]);

  const handleCopyLink = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(`https://www.thezenphoria.com/#${activeTab}`);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2200);
      }
    } catch (err) {
      console.warn('Clipboard copy failed:', err);
    }
  };

  const handleCopyEmail = (emailStr) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailStr);
        setCopiedEmail(emailStr);
        setTimeout(() => setCopiedEmail(null), 2000);
      }
    } catch (err) {
      console.warn('Clipboard copy failed:', err);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    setSupportSubmitted(true);
    setTimeout(() => {
      setSupportSubmitted(false);
      setSupportForm({ name: '', email: '', bookingId: '', category: 'Scheduling & Rescheduling', message: '' });
    }, 4500);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(15, 22, 15, 0.75)', zIndex: 9999 }}>
      <div 
        className="modal-content legal-governance-modal" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '1080px',
          width: '96%',
          height: '90vh',
          maxHeight: '860px',
          display: 'flex',
          flexDirection: 'row',
          padding: 0,
          borderRadius: '20px',
          overflow: 'hidden',
          backgroundColor: '#FAF9F5',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(212, 175, 55, 0.25)'
        }}
      >
        {/* ============================================================ */}
        {/* LEFT SIDEBAR NAVIGATION (Desktop) */}
        {/* ============================================================ */}
        <aside style={{
          width: '290px',
          backgroundColor: '#151D15',
          color: '#FAF8F5',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          flexShrink: 0
        }} className="legal-sidebar-col">
          
          {/* Brand Header */}
          <div>
            <div style={{
              padding: '24px 22px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <img 
                  src="/emblem-white.png" 
                  alt="Zenphoria Emblem" 
                  style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
                />
                <div>
                  <div style={{ 
                    fontFamily: 'Newsreader, Georgia, serif', 
                    fontSize: '20px', 
                    fontWeight: 600, 
                    color: '#FAF8F5', 
                    letterSpacing: '0.04em', 
                    lineHeight: 1.1 
                  }}>
                    Zenphoria
                  </div>
                  <div style={{ 
                    fontSize: '10px', 
                    color: '#D4AF37', 
                    fontWeight: 700, 
                    letterSpacing: '0.14em', 
                    textTransform: 'uppercase',
                    marginTop: '2px'
                  }}>
                    Institutional Standards
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#9CA89C', margin: 0, lineHeight: 1.4 }}>
                Clinical governance, privacy protocols, and ethical compliance repository.
              </p>
            </div>

            {/* Nav Menu */}
            <nav style={{ padding: '16px 12px' }}>
              <div style={{ 
                fontSize: '10px', 
                fontWeight: 700, 
                color: '#6E7C6E', 
                letterSpacing: '0.12em', 
                textTransform: 'uppercase', 
                padding: '0 12px 10px' 
              }}>
                Policies & Governance
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: 'none',
                        background: isActive 
                          ? 'linear-gradient(90deg, rgba(68, 81, 68, 0.85) 0%, rgba(45, 56, 45, 0.95) 100%)' 
                          : 'transparent',
                        color: isActive ? '#FFFFFF' : '#B8C2B8',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.18s ease',
                        boxShadow: isActive ? 'inset 2px 0 0 #D4AF37, 0 4px 12px rgba(0,0,0,0.2)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: isActive ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255,255,255,0.06)',
                          color: isActive ? '#D4AF37' : '#9CA89C'
                        }}>
                          <Icon size={15} />
                        </div>
                        <div>
                          <div style={{ 
                            fontSize: '13px', 
                            fontWeight: isActive ? 700 : 500, 
                            color: isActive ? '#FAF8F5' : '#D0D8D0',
                            letterSpacing: '0.01em'
                          }}>
                            {item.label}
                          </div>
                          <div style={{ fontSize: '10.5px', color: '#7E8E7E', marginTop: '1px' }}>
                            {item.tag}
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={14} color={isActive ? '#D4AF37' : 'rgba(255,255,255,0.2)'} />
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Sidebar Institutional Footer */}
          <div style={{
            padding: '16px 18px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Award size={16} color="#D4AF37" />
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#D4AF37', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Accredited Standards
              </span>
            </div>
            <p style={{ fontSize: '11px', color: '#889888', margin: '0 0 10px', lineHeight: 1.4 }}>
              Aligned with APA Ethics, GDPR, India DPDP Act 2023 & HIPAA Data Guidelines.
            </p>
            <div style={{ fontSize: '10.5px', color: '#6A786A' }}>
              Version 2026.2 &bull; Active & Enforced
            </div>
          </div>
        </aside>

        {/* ============================================================ */}
        {/* RIGHT MAIN CONTENT AREA */}
        {/* ============================================================ */}
        <main style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FAF9F5',
          overflow: 'hidden'
        }}>
          {/* Top Control Bar & Mobile Segmented Nav */}
          <header style={{
            padding: '16px 24px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--border-color, #E8E5DC)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            flexShrink: 0
          }}>
            {/* Search Input Box */}
            <div style={{ position: 'relative', flex: 1, maxWidth: '380px' }}>
              <Search size={15} color="#8A968A" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text"
                className="form-input"
                placeholder={`Search clauses in ${currentSection?.title || 'Policy'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: '34px',
                  paddingRight: '12px',
                  paddingTop: '7px',
                  paddingBottom: '7px',
                  fontSize: '12.5px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--bg-primary, #F9F8F3)',
                  border: '1px solid var(--border-color, #E2DFD4)'
                }}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Quick Actions & Close Modal */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={handleCopyLink}
                className="btn btn-outline"
                style={{ fontSize: '11.5px', padding: '6px 12px', borderRadius: '8px', gap: '5px' }}
                title="Copy direct link to this policy"
              >
                {copiedLink ? <Check size={13} color="#215421" /> : <Copy size={13} />}
                <span>{copiedLink ? 'Copied' : 'Share Link'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="btn btn-outline"
                style={{ fontSize: '11.5px', padding: '6px 12px', borderRadius: '8px', gap: '5px' }}
                title="Print or save this policy as PDF"
              >
                <Printer size={13} />
                <span>Print PDF</span>
              </button>

              <button
                type="button"
                className="modal-close-btn"
                onClick={onClose}
                aria-label="Close modal"
                style={{ position: 'static', width: '32px', height: '32px' }}
              >
                <X size={16} />
              </button>
            </div>
          </header>

          {/* Mobile Horizontal Tabs (visible only on narrow screens) */}
          <div className="legal-mobile-tabs" style={{
            display: 'none',
            overflowX: 'auto',
            padding: '8px 16px',
            backgroundColor: '#151D15',
            gap: '6px',
            scrollbarWidth: 'none',
            flexShrink: 0
          }}>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: isActive ? 700 : 500,
                    backgroundColor: isActive ? '#D4AF37' : 'rgba(255,255,255,0.1)',
                    color: isActive ? '#151D15' : '#E0E8E0',
                    border: 'none',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                >
                  <item.icon size={13} />
                  <span>{item.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Scrollable Document Body */}
          <div style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflowY: 'auto',
            padding: '28px 32px 40px',
            scrollBehavior: 'smooth'
          }}>
            
            {/* Hero Header Card */}
            <div style={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F2EB 100%)',
              border: '1px solid var(--border-color, #E2DFD4)',
              borderRadius: '14px',
              padding: '22px 24px',
              marginBottom: '26px',
              boxShadow: '0 4px 18px rgba(40, 50, 40, 0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: 'var(--bg-subtle-badge-green, #DCEADC)',
                  color: 'var(--accent-olive, #215421)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}>
                  <Sparkles size={12} />
                  {currentSection.badge}
                </span>

                <div style={{ display: 'flex', gap: '14px', fontSize: '11.5px', color: 'var(--text-muted, #788378)' }}>
                  <span><strong>Updated:</strong> {currentSection.lastUpdated}</span>
                  <span>&bull;</span>
                  <span><strong>Jurisdiction:</strong> Global / India</span>
                </div>
              </div>

              <h1 style={{
                fontFamily: 'Newsreader, Georgia, serif',
                fontSize: '28px',
                fontWeight: 600,
                color: 'var(--text-headline, #202B20)',
                margin: '0 0 6px',
                lineHeight: 1.2
              }}>
                {currentSection.title}
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--text-body, #4A564A)', margin: 0, maxWidth: '720px', lineHeight: 1.5 }}>
                {currentSection.subtitle}
              </p>
            </div>

            {/* ============================================================ */}
            {/* ETHICS TAB: Emergency Hotlines & Clinical Safeguards */}
            {/* ============================================================ */}
            {activeTab === 'ethics' && (
              <div style={{ marginBottom: '28px' }}>
                {/* Crisis Banner */}
                <div style={{
                  background: '#FFF9E6',
                  border: '1.5px solid #F5C253',
                  borderRadius: '12px',
                  padding: '18px 20px',
                  marginBottom: '24px',
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'flex-start',
                  boxShadow: '0 4px 16px rgba(245, 194, 83, 0.15)'
                }}>
                  <AlertTriangle size={24} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#92400E', marginBottom: '4px' }}>
                      24/7 Clinical Emergency & Crisis Assistance Notice
                    </div>
                    <div style={{ fontSize: '13px', color: '#78350F', lineHeight: 1.55 }}>
                      Zenphoria provides structured modular psycho-education and emotional health consultations. 
                      <strong> We are not an emergency psychiatric hospital triage service.</strong> If you or an individual you know is experiencing acute psychiatric distress or immediate danger, please utilize the toll-free emergency crisis hotlines below:
                    </div>
                  </div>
                </div>

                {/* Emergency Contact Cards Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '12px',
                  marginBottom: '28px'
                }}>
                  {EMERGENCY_CONTACTS.map((item, idx) => (
                    <div 
                      key={idx}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EAE6DB',
                        padding: '14px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#2B372B' }}>
                            {item.region}
                          </span>
                          <span style={{ 
                            fontSize: '10px', 
                            fontWeight: 700, 
                            backgroundColor: '#F3EFE6', 
                            color: '#7D5E42', 
                            padding: '2px 7px', 
                            borderRadius: '4px' 
                          }}>
                            {item.tag}
                          </span>
                        </div>
                        <p style={{ fontSize: '11.5px', color: '#6E7A6E', margin: '0 0 10px', lineHeight: 1.4 }}>
                          {item.desc}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F0ECE1', paddingTop: '10px' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 700, color: '#1E5128' }}>
                          {item.number}
                        </span>
                        <a 
                          href={item.action} 
                          className="btn btn-primary"
                          style={{ fontSize: '11.5px', padding: '5px 12px', borderRadius: '6px', gap: '4px', textDecoration: 'none' }}
                        >
                          <Phone size={12} /> Dial Now
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* PRIVACY TAB: Data Rights Grid Highlight */}
            {/* ============================================================ */}
            {activeTab === 'privacy' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                marginBottom: '26px'
              }}>
                {[
                  { title: "Zero Data Selling", desc: "Never monetized or traded to external commercial advertisers.", badge: "Guaranteed" },
                  { title: "AES-256 Storage", desc: "Intake notes & booking records encrypted at rest & in transit.", badge: "TLS 1.3" },
                  { title: "Right to Erasure", desc: "Permanent purge of your demographic records upon request.", badge: "DPDP / GDPR" },
                  { title: "Meet Encryption", desc: "Video consultations with Google enterprise peer security.", badge: "Encrypted" }
                ].map((pill, i) => (
                  <div key={i} style={{
                    background: '#FFFFFF',
                    border: '1px solid #E4DFD5',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#2B372B' }}>{pill.title}</span>
                      <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#215421', backgroundColor: '#DCEADC', padding: '1px 6px', borderRadius: '4px' }}>{pill.badge}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#6A786A', lineHeight: 1.4 }}>{pill.desc}</div>
                  </div>
                ))}
              </div>
            )}

            {/* ============================================================ */}
            {/* STANDARD CLAUSES ACCORDION / CARDS LIST (Ethics, Privacy, Terms) */}
            {/* ============================================================ */}
            {currentSection.clauses && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredClauses.length === 0 ? (
                  <div style={{
                    padding: '36px 20px',
                    textAlign: 'center',
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px dashed var(--border-color, #E2DFD4)'
                  }}>
                    <HelpCircle size={28} color="#8A968A" style={{ marginBottom: '8px' }} />
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#2B372B' }}>No clauses match '{searchQuery}'</div>
                    <div style={{ fontSize: '13px', color: '#788378', marginTop: '4px' }}>Try searching for general keywords like 'confidentiality', 'reschedule', or 'meet'.</div>
                  </div>
                ) : (
                  filteredClauses.map((clause, idx) => (
                    <div 
                      key={idx}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '14px',
                        border: '1px solid var(--border-color, #E2DFD4)',
                        overflow: 'hidden',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                      }}
                    >
                      {/* Clause Card Header */}
                      <div style={{
                        padding: '16px 20px',
                        backgroundColor: '#FCFBF8',
                        borderBottom: '1px solid #EFECE4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            fontFamily: 'monospace',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#556555',
                            backgroundColor: '#EDE8DC',
                            padding: '3px 8px',
                            borderRadius: '6px'
                          }}>
                            § {clause.number}
                          </span>
                          <h3 style={{
                            fontSize: '15.5px',
                            fontWeight: 700,
                            color: 'var(--text-headline, #202B20)',
                            margin: 0
                          }}>
                            {clause.title}
                          </h3>
                        </div>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#566956',
                          backgroundColor: '#EAE5D9',
                          padding: '3px 9px',
                          borderRadius: '6px'
                        }}>
                          {clause.badge}
                        </span>
                      </div>

                      {/* Clause Details */}
                      <div style={{ padding: '18px 22px' }}>
                        <div style={{
                          fontSize: '12.5px',
                          fontWeight: 600,
                          color: '#6E7C6E',
                          marginBottom: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em'
                        }}>
                          Summary: {clause.summary}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {clause.details.map((paragraph, pIdx) => (
                            <p 
                              key={pIdx} 
                              style={{ 
                                fontSize: '13.5px', 
                                lineHeight: 1.65, 
                                color: 'var(--text-body, #4A564A)', 
                                margin: 0 
                              }}
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ============================================================ */}
            {/* SUPPORT TAB: Interactive Support Center & FAQs */}
            {/* ============================================================ */}
            {activeTab === 'support' && (
              <div>
                {/* Support Desk Action Card */}
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color, #E2DFD4)',
                  padding: '24px 26px',
                  marginBottom: '28px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: '#DCEADC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#215421'
                      }}>
                        <Headphones size={20} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#202B20' }}>
                          Zenphoria Client Care & Helpdesk
                        </h3>
                        <div style={{ fontSize: '12px', color: '#6A786A' }}>
                          Operating Mon–Sat (9:00 AM – 8:00 PM IST) &bull; Response Time: 2–4 Hours
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <WhatsAppRedirectButton 
                        clientName="Support Client"
                        customMessage="Hi Zenphoria Client Support Desk, I have an inquiry regarding my consultation."
                      />
                    </div>
                  </div>

                  {/* Direct Email Cards */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '10px',
                    marginBottom: '20px',
                    padding: '14px',
                    backgroundColor: '#FAF8F3',
                    borderRadius: '10px',
                    border: '1px solid #EDE8DC'
                  }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#788878', textTransform: 'uppercase', fontWeight: 700 }}>
                        Official Client Desk:
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '3px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#2B372B' }}>
                          consultation@ww.thezenphoria.com
                        </span>
                        <button 
                          type="button" 
                          onClick={() => handleCopyEmail('consultation@ww.thezenphoria.com')}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#566956' }}
                          title="Copy email"
                        >
                          {copiedEmail === 'consultation@ww.thezenphoria.com' ? <Check size={14} color="#215421" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '11px', color: '#788878', textTransform: 'uppercase', fontWeight: 700 }}>
                        Administration & Inquiries:
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '3px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#2B372B' }}>
                          zenphoria88@gmail.com
                        </span>
                        <button 
                          type="button" 
                          onClick={() => handleCopyEmail('zenphoria88@gmail.com')}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#566956' }}
                          title="Copy email"
                        >
                          {copiedEmail === 'zenphoria88@gmail.com' ? <Check size={14} color="#215421" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Support Ticket Submission Form */}
                  {supportSubmitted ? (
                    <div style={{
                      backgroundColor: '#E2F0E2',
                      border: '1.5px solid #A8DCA8',
                      borderRadius: '10px',
                      padding: '18px',
                      textAlign: 'center',
                      color: '#1A4D1A'
                    }}>
                      <CheckCircle2 size={32} color="#215421" style={{ margin: '0 auto 8px' }} />
                      <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>
                        Inquiry Successfully Logged
                      </div>
                      <p style={{ fontSize: '13px', margin: 0 }}>
                        Your support request has been queued. Our clinical administration team will review and reply directly to your email within 2-4 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSupportSubmit}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '12px' }}>Your Full Name</label>
                          <input 
                            type="text"
                            className="form-input"
                            placeholder="e.g. Maya Lin"
                            value={supportForm.name}
                            onChange={(e) => setSupportForm({ ...supportForm, name: e.target.value })}
                            required
                            style={{ fontSize: '13px', padding: '9px 12px' }}
                          />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '12px' }}>Your Email Address</label>
                          <input 
                            type="email"
                            className="form-input"
                            placeholder="maya@example.com"
                            value={supportForm.email}
                            onChange={(e) => setSupportForm({ ...supportForm, email: e.target.value })}
                            required
                            style={{ fontSize: '13px', padding: '9px 12px' }}
                          />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '12px' }}>Booking Reference (Optional)</label>
                          <input 
                            type="text"
                            className="form-input"
                            placeholder="e.g. sch_89ad3f"
                            value={supportForm.bookingId}
                            onChange={(e) => setSupportForm({ ...supportForm, bookingId: e.target.value })}
                            style={{ fontSize: '13px', padding: '9px 12px' }}
                          />
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: '12px' }}>
                        <label className="form-label" style={{ fontSize: '12px' }}>Inquiry Category</label>
                        <select
                          className="form-select"
                          value={supportForm.category}
                          onChange={(e) => setSupportForm({ ...supportForm, category: e.target.value })}
                          style={{ fontSize: '13px', padding: '9px 12px' }}
                        >
                          <option value="Scheduling & Rescheduling">Scheduling & Rescheduling (24h Notice)</option>
                          <option value="Google Meet Video Link Access">Google Meet Video Link Access</option>
                          <option value="Invoicing & Corporate Receipts">Invoicing & Corporate Receipts</option>
                          <option value="Practitioner Verification">Practitioner Verification & Credentials</option>
                          <option value="General Clinical Inquiry">General Clinical Inquiry</option>
                        </select>
                      </div>

                      <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label className="form-label" style={{ fontSize: '12px' }}>Message Details</label>
                        <textarea 
                          className="form-textarea"
                          rows={3}
                          placeholder="Describe your inquiry with any relevant details..."
                          value={supportForm.message}
                          onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                          required
                          style={{ fontSize: '13px', padding: '9px 12px' }}
                        />
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ fontSize: '13.5px', padding: '10px 22px' }}>
                        <Send size={15} />
                        <span>Dispatch Support Ticket</span>
                      </button>
                    </form>
                  )}
                </div>

                {/* Frequently Asked Questions */}
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#202B20', marginBottom: '14px' }}>
                  Frequently Asked Questions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {SUPPORT_FAQS.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div 
                        key={idx}
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '12px',
                          border: '1px solid #E4DFD5',
                          overflow: 'hidden'
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          style={{
                            width: '100%',
                            padding: '14px 18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: isOpen ? '#FAF8F3' : '#FFFFFF',
                            border: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#2B372B'
                          }}
                        >
                          <span>{faq.question}</span>
                          <ChevronDown 
                            size={16} 
                            style={{ 
                              transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', 
                              transition: 'transform 0.2s ease', 
                              color: '#6E7C6E' 
                            }} 
                          />
                        </button>
                        {isOpen && (
                          <div style={{ padding: '14px 18px', fontSize: '13.5px', lineHeight: 1.6, color: '#4E574E', borderTop: '1px solid #F0ECE1' }}>
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* CAREERS TAB: Clinical Fellowship & Position Openings */}
            {/* ============================================================ */}
            {activeTab === 'careers' && (
              <div>
                {/* Fellowship Philosophy Banner */}
                <div style={{
                  background: 'linear-gradient(135deg, #1E281E 0%, #2D3D2D 100%)',
                  borderRadius: '14px',
                  padding: '22px 24px',
                  color: '#FAF8F5',
                  marginBottom: '24px',
                  boxShadow: '0 4px 16px rgba(30, 40, 30, 0.2)'
                }}>
                  <div style={{ fontSize: '11px', color: '#D4AF37', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Clinical Collective Philosophy
                  </div>
                  <h3 style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '22px', fontWeight: 600, margin: '0 0 8px', color: '#FAF8F5' }}>
                    Practice at the Intersection of Clinical Rigor & Elegant Technology
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#D0DDD0', margin: 0, lineHeight: 1.55 }}>
                    Zenphoria removes administrative fatigue, insurance overhead, and scheduling friction so practitioners can focus entirely on impactful, structured client consultations and evidence-based psychological education.
                  </p>
                </div>

                {/* Open Positions Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {CAREER_POSITIONS.map((pos) => (
                    <div 
                      key={pos.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '14px',
                        border: '1px solid var(--border-color, #E2DFD4)',
                        padding: '22px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                        <div>
                          <span style={{
                            fontSize: '10.5px',
                            fontWeight: 700,
                            backgroundColor: '#DCEADC',
                            color: '#215421',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em'
                          }}>
                            {pos.badge}
                          </span>
                          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#202B20', margin: '6px 0 2px' }}>
                            {pos.title}
                          </h3>
                          <div style={{ fontSize: '12.5px', color: '#788878' }}>
                            {pos.department} &bull; {pos.type} &bull; {pos.commitment}
                          </div>
                        </div>

                        <a
                          href={`mailto:careers@thezenphoria.com?subject=Clinical%20Fellowship%20Application%20-%20${encodeURIComponent(pos.title)}`}
                          className="btn btn-primary"
                          style={{ fontSize: '12.5px', padding: '8px 16px', borderRadius: '8px', gap: '6px', textDecoration: 'none' }}
                        >
                          <Mail size={14} />
                          <span>Apply for Role &rarr;</span>
                        </a>
                      </div>

                      <p style={{ fontSize: '13.5px', lineHeight: 1.55, color: '#4E574E', margin: '0 0 14px' }}>
                        {pos.description}
                      </p>

                      {/* Requirements */}
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#2B372B', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Candidate Qualifications:
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#556255', lineHeight: 1.5 }}>
                          {pos.requirements.map((req, rIdx) => (
                            <li key={rIdx} style={{ marginBottom: '4px' }}>{req}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Perks */}
                      <div style={{
                        backgroundColor: '#F9F8F4',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        border: '1px solid #EBE8DF'
                      }}>
                        <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#2B372B', marginBottom: '4px' }}>
                          Fellowship Perks:
                        </div>
                        <div style={{ fontSize: '12.5px', color: '#6A786A', lineHeight: 1.45 }}>
                          {pos.perks.join(' • ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <footer style={{
            padding: '14px 28px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid var(--border-color, #E8E5DC)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: 'var(--text-muted, #788378)',
            flexShrink: 0
          }}>
            <div>
              &copy; 2026 Zenphoria Institutional Governance. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '14px' }}>
              <button 
                onClick={() => setActiveTab('support')} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-olive)', fontWeight: 600, fontSize: '12px' }}
              >
                Contact Helpdesk
              </button>
              <span>&bull;</span>
              <button 
                onClick={onClose} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-body)', fontWeight: 600, fontSize: '12px' }}
              >
                Close Portal
              </button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
