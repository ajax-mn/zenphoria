import React from 'react';
import { Menu, Calendar } from 'lucide-react';

export default function Header({ onOpenMenu, onGoHome, currentPage, onNavigate, onOpenBooking }) {
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'pillars', label: 'The Five Pillars' },
    { id: 'assessment', label: 'Consultation' },
    { id: 'journal', label: 'Journal & Resources' },
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Brand Logo */}
        <div 
          className="site-logo" 
          onClick={onGoHome}
          role="button"
          tabIndex={0}
        >
          <span>Zenphoria</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav-links">
          {navLinks.map((link) => (
            <button
              key={link.id}
              className={`desktop-nav-link ${currentPage === link.id ? 'active' : ''}`}
              onClick={() => onNavigate(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Header Right Actions */}
        <div className="header-right">
          <button 
            className="btn btn-primary header-cta-btn"
            onClick={onOpenBooking}
          >
            <Calendar size={15} />
            <span>Book Now</span>
          </button>

          {/* Mobile Hamburger Menu Button */}
          <button 
            className="mobile-menu-btn" 
            onClick={onOpenMenu}
            aria-label="Toggle Navigation Menu"
          >
            <Menu size={24} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </header>
  );
}
