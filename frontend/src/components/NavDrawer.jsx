import React from 'react';
import { X, ArrowRight, Compass, Layers, BookOpen, UserCheck, Calendar, ShieldCheck } from 'lucide-react';

export default function NavDrawer({ isOpen, onClose, currentPage, onNavigate, onOpenBooking }) {
  if (!isOpen) return null;

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'pillars', label: 'The Five Pillars', icon: Layers },
    { id: 'assessment', label: 'Step Consultation', icon: UserCheck },
    { id: 'journal', label: 'Journal & Resources', icon: BookOpen },
    { id: 'admin', label: 'Admin Portal', icon: ShieldCheck },
  ];


  return (
    <div className="nav-drawer-overlay" onClick={onClose}>
      <div className="nav-drawer" onClick={(e) => e.stopPropagation()}>
        <div>
          <div className="nav-drawer-header">
            <span className="site-logo">Zenphoria</span>
            <button className="site-nav-btn" onClick={onClose} aria-label="Close menu">
              <X size={22} />
            </button>
          </div>

          <div className="nav-drawer-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-drawer-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={18} opacity={isActive ? 1 : 0.6} />
                    {item.label}
                  </span>
                  <ArrowRight size={16} opacity={isActive ? 1 : 0.4} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="nav-drawer-footer">
          <button 
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onOpenBooking();
            }}
          >
            <Calendar size={16} /> Book Now
          </button>
          <div style={{ marginTop: '14px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
            Psychological education for the modern era.
          </div>
        </div>
      </div>
    </div>
  );
}
