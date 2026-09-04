import React from 'react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-main-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <div className="footer-brand-title">Zenphoria</div>
            <p className="footer-brand-desc">
              Psychological education for the modern era, bridging clinical expertise with accessible wisdom.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="footer-nav-section">
            <div className="footer-section-title">Navigation</div>
            <ul className="footer-links-list">
              <li><span className="footer-link" onClick={() => onNavigate('home')}>Home</span></li>
              <li><span className="footer-link" onClick={() => onNavigate('pillars')}>The Five Pillars</span></li>
              <li><span className="footer-link" onClick={() => onNavigate('assessment')}>Sessions & Consultation</span></li>
              <li><span className="footer-link" onClick={() => onNavigate('journal')}>Journal & Resources</span></li>
            </ul>
          </div>

          {/* Methodology */}
          <div className="footer-nav-section">
            <div className="footer-section-title">Focus Areas</div>
            <ul className="footer-links-list">
              <li><span className="footer-link" onClick={() => onNavigate('assessment')}>Stress & Anxiety</span></li>
              <li><span className="footer-link" onClick={() => onNavigate('assessment')}>Relational Dynamics</span></li>
              <li><span className="footer-link" onClick={() => onNavigate('assessment')}>Personal Growth</span></li>
              <li><span className="footer-link" onClick={() => onNavigate('assessment')}>General Consultation</span></li>
            </ul>
          </div>

          {/* Legal & Support */}
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
      </div>
    </footer>
  );
}
