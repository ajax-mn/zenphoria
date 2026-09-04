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

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [activeArticle, setActiveArticle] = useState(null);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

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
            onNavigate={setCurrentPage} 
            onOpenBooking={handleOpenBooking}
            onSelectArticle={setActiveArticle}
          />
        );
      case 'pillars':
        return (
          <PillarsPage 
            onNavigate={setCurrentPage} 
            onOpenBooking={handleOpenBooking}
          />
        );
      case 'assessment':
        return (
          <AssessmentPage 
            onNavigate={setCurrentPage} 
            onOpenBooking={handleOpenBooking}
          />
        );
      case 'journal':
        return (
          <JournalPage 
            onSelectArticle={setActiveArticle}
          />
        );
      default:
        return (
          <HomePage 
            onNavigate={setCurrentPage} 
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
        onGoHome={() => setCurrentPage('home')}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onOpenBooking={handleOpenBooking}
      />

      {/* Main Responsive Content */}
      <main className="main-content">
        {renderPage()}
      </main>

      {/* Responsive Footer */}
      <Footer onNavigate={setCurrentPage} />

      {/* Navigation Drawer for Mobile */}
      <NavDrawer 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
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
