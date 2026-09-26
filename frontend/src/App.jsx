import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import NavDrawer from './components/NavDrawer';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import ArticleModal from './components/ArticleModal';

import HomePage from './pages/HomePage';
import PillarsPage from './pages/PillarsPage';
import AssessmentPage from './pages/AssessmentPage';
import JournalPage from './pages/JournalPage';
import AdminPage from './pages/AdminPage';
import { api } from './services/api';

export default function App() {
  const getInitialPage = () => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
    if (path === 'admin') return 'admin';
    if (path === 'pillars') return 'pillars';
    if (path === 'assessment' || path === 'consultation') return 'assessment';
    if (path === 'journal') return 'journal';
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [activeArticle, setActiveArticle] = useState(null);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    const targetPath = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ page }, '', targetPath);
    }
  };

  // Listen to browser back / forward buttons
  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
      if (['home', 'pillars', 'assessment', 'journal', 'admin'].includes(path)) {
        setCurrentPage(path);
      } else if (path === '') {
        setCurrentPage('home');
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Silently warm up the backend server on initial site visit
  useEffect(() => {
    api.warmup();
  }, []);

  const handleOpenBooking = (initialData = null) => {
    setBookingData(initialData);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setBookingData(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            onNavigate={handleNavigate} 
            onOpenBooking={handleOpenBooking}
            onSelectArticle={setActiveArticle}
          />
        );
      case 'pillars':
        return (
          <PillarsPage 
            onNavigate={handleNavigate} 
            onOpenBooking={handleOpenBooking}
          />
        );
      case 'assessment':
        return (
          <AssessmentPage 
            onNavigate={handleNavigate} 
            onOpenBooking={handleOpenBooking}
          />
        );
      case 'journal':
        return (
          <JournalPage 
            onSelectArticle={setActiveArticle}
          />
        );
      case 'admin':
        return (
          <AdminPage 
            onNavigate={handleNavigate}
          />
        );
      default:
        return (
          <HomePage 
            onNavigate={handleNavigate} 
            onOpenBooking={handleOpenBooking}
            onSelectArticle={setActiveArticle}
          />
        );
    }
  };

  return (
    <div className="site-wrapper">
      {/* Responsive Header */}
      <Header 
        onOpenMenu={() => setIsMenuOpen(true)}
        onGoHome={() => handleNavigate('home')}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenBooking={handleOpenBooking}
      />

      {/* Main Responsive Content */}
      <main className="main-content">
        {renderPage()}
      </main>

      {/* Responsive Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Navigation Drawer for Mobile */}
      <NavDrawer 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenBooking={handleOpenBooking}
      />

      {/* Direct Booking Modal */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={handleCloseBooking}
        initialData={bookingData}
      />

      {/* Article Reader Modal */}
      <ArticleModal 
        article={activeArticle} 
        onClose={() => setActiveArticle(null)} 
      />
    </div>
  );
}
