import React from 'react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-brand-title">Zenphoria</div>
      <p className="footer-brand-desc">
        Psychological education for the modern era, bridging clinical expertise with accessible wisdom.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="footer-nav-section">
          <div className="footer-section-title">Navigation</div>
          <ul className="footer-links-list">
            <li><span className="footer-link" onClick={() => onNavigate('assessment')}>Sessions</span></li>
            <li><span className="footer-link" onClick={() => onNavigate('home')}>Master's</span></li>
            <li><span className="footer-link" onClick={() => onNavigate('pillars')}>Pillars</span></li>
            <li><span className="footer-link" onClick={() => onNavigate('journal')}>Journal</span></li>
          </ul>
        </div>

        <div className="footer-nav-section">
          <div className="footer-section-title">Legal & Support</div>
          <ul className="footer-links-list">
            <li><span className="footer-link">Ethics</span></li>
            <li><span className="footer-link">Privacy Policy</span></li>
            <li><span className="footer-link">Terms of Service</span></li>
            <li><span className="footer-link">Contact Support</span></li>
            <li><span className="footer-link">Careers</span></li>
          </ul>
        </div>
      </div>

      <div className="footer-copyright">
        © 2024 Zenphoria. All rights reserved. Psychological education for the modern era.
      </div>
    </footer>
  );
}
