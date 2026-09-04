import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import NavDrawer from './components/NavDrawer';
import Footer from './components/Footer';
import WaitingListModal from './components/WaitingListModal';
import ArticleModal from './components/ArticleModal';

import HomePage from './pages/HomePage';
import PillarsPage from './pages/PillarsPage';
import AssessmentPage from './pages/AssessmentPage';
import JournalPage from './pages/JournalPage';

import { Smartphone, Monitor, Sparkles } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWaitingListOpen, setIsWaitingListOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState(null);
  const [viewMode, setViewMode] = useState('mobile'); // 'mobile' or 'desktop'

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            onNavigate={setCurrentPage} 
            onOpenWaitingList={() => setIsWaitingListOpen(true)}
            onSelectArticle={setActiveArticle}
          />
        );
      case 'pillars':
        return (
          <PillarsPage 
            onNavigate={setCurrentPage} 
            onOpenWaitingList={() => setIsWaitingListOpen(true)}
          />
        );
      case 'assessment':
        return (
          <AssessmentPage 
            onNavigate={setCurrentPage} 
            onOpenWaitingList={() => setIsWaitingListOpen(true)}
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
            onOpenWaitingList={() => setIsWaitingListOpen(true)}
            onSelectArticle={setActiveArticle}
          />
        );
    }
  };

  return (
    <div className="app-container">
      {/* Top Preview Control Bar */}
      <div className="device-bar">
        <div className="device-bar-left">
          <div className="device-bar-title">
            <Sparkles size={15} color="#A7D2A7" />
            <span>ZENPHORIA</span>
          </div>

          <div className="device-bar-nav">
            <button 
              className={`device-bar-btn ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => setCurrentPage('home')}
            >
              1. Home
            </button>
            <button 
              className={`device-bar-btn ${currentPage === 'pillars' ? 'active' : ''}`}
              onClick={() => setCurrentPage('pillars')}
            >
              2. Five Pillars
            </button>
            <button 
              className={`device-bar-btn ${currentPage === 'assessment' ? 'active' : ''}`}
              onClick={() => setCurrentPage('assessment')}
            >
              3. Focus Quiz
            </button>
            <button 
              className={`device-bar-btn ${currentPage === 'journal' ? 'active' : ''}`}
              onClick={() => setCurrentPage('journal')}
            >
              4. Journal
            </button>
          </div>
        </div>

        <div className="view-mode-toggle">
          <button 
            className={`view-mode-btn ${viewMode === 'mobile' ? 'active' : ''}`}
            onClick={() => setViewMode('mobile')}
            title="Mobile device mock frame (matches screenshots)"
          >
            <Smartphone size={14} />
            <span>Mobile</span>
          </button>
          <button 
            className={`view-mode-btn ${viewMode === 'desktop' ? 'active' : ''}`}
            onClick={() => setViewMode('desktop')}
            title="Full Responsive View"
          >
            <Monitor size={14} />
            <span>Desktop</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className={`main-viewport-wrapper ${viewMode === 'mobile' ? 'mobile-mode' : 'desktop-mode'}`}>
        <div className={viewMode === 'mobile' ? 'mobile-frame' : 'desktop-frame'}>
          <Header 
            onOpenMenu={() => setIsMenuOpen(true)}
            onGoHome={() => setCurrentPage('home')}
          />

          <main>
            {renderPage()}
          </main>

          <Footer onNavigate={setCurrentPage} />
        </div>
      </div>

      {/* Navigation Drawer */}
      <NavDrawer 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onOpenWaitingList={() => setIsWaitingListOpen(true)}
      />

      {/* Waiting List Interactive Modal */}
      <WaitingListModal 
        isOpen={isWaitingListOpen} 
        onClose={() => setIsWaitingListOpen(false)} 
      />

      {/* Article Reader Modal */}
      <ArticleModal 
        article={activeArticle} 
        onClose={() => setActiveArticle(null)} 
      />
    </div>
  );
}
