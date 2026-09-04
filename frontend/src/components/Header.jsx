import React from 'react';
import { Menu } from 'lucide-react';

export default function Header({ onOpenMenu, onGoHome }) {
  return (
    <header className="site-header">
      <div 
        className="site-logo" 
        onClick={onGoHome}
        role="button"
        tabIndex={0}
      >
        <span>Zenphoria</span>
      </div>
      
      <button 
        className="site-nav-btn" 
        onClick={onOpenMenu}
        aria-label="Toggle Navigation Menu"
      >
        <Menu size={22} strokeWidth={1.8} />
      </button>
    </header>
  );
}
