import React, { useState, useEffect } from 'react';
import { Search, ArrowUpRight, Sparkles, Loader2, BookOpen } from 'lucide-react';
import { ARTICLES_DATA } from '../data/zenphoriaData';
import { api } from '../services/api';

export default function JournalPage({ onSelectArticle }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState('All Topics');
  const [articlesList, setArticlesList] = useState(ARTICLES_DATA);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSearchTriggered, setAiSearchTriggered] = useState(false);

  const topics = ['All Topics', 'Clinical Frameworks', 'Mindfulness', 'Cognitive Load'];

  // Load articles on mount or topic change
  useEffect(() => {
    let isMounted = true;
    api.getArticles(activeTopic, '').then(res => {
      if (isMounted && res && Array.isArray(res) && res.length > 0) {
        setArticlesList(res);
      }
    });
    return () => { isMounted = false; };
  }, [activeTopic]);

  // Execute AI search on user submit or manual trigger
  const handleAiSearch = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsAiLoading(true);
    setAiSearchTriggered(true);
    try {
      const res = await api.getArticles(activeTopic, searchQuery, true);
      if (res && Array.isArray(res) && res.length > 0) {
        setArticlesList(res);
      }
    } catch (err) {
      console.warn('AI search error:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const featuredArticle = articlesList.find(a => a.id === 'architecture-of-empathy') || articlesList[0];

  const filteredArticles = articlesList.filter((art) => {
    if (!art) return false;
    if (art.id === featuredArticle?.id && !searchQuery) return false; // Show in featured if no active search
    
    const s = searchQuery.toLowerCase().trim();
    const matchesSearch = !s ||
      (art.title && art.title.toLowerCase().includes(s)) || 
      (art.excerpt && art.excerpt.toLowerCase().includes(s)) ||
      (art.topic && art.topic.toLowerCase().includes(s));
    
    const matchesTopic = activeTopic === 'All Topics' || (art.topic && art.topic.toLowerCase() === activeTopic.toLowerCase());

    return matchesSearch && matchesTopic;
  });

  return (
    <div className="page-wrapper">
      {/* Header */}
      <section className="section-header-center">
        <h1 className="page-title">Journal & Resources</h1>
        <p className="page-subtitle max-width-sub">
          Explore our curated collection of clinical insights, psychological frameworks, and mindful practices designed for the modern professional.
        </p>

        {/* Search Input with AI Trigger */}
        <form onSubmit={handleAiSearch} className="journal-search-wrap" style={{ position: 'relative' }}>
          <Search size={18} className="journal-search-icon" />
          <input
            type="text"
            className="journal-search-input"
            placeholder="Search clinical topics, psychology research, or ask AI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery.trim().length > 0 && (
            <button
              type="submit"
              disabled={isAiLoading}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.9rem',
                borderRadius: '9999px',
                backgroundColor: '#344034',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {isAiLoading ? (
                <>
                  <Loader2 size={13} className="spin-animate" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={13} style={{ color: '#A3D9A5' }} />
                  <span>AI Search</span>
                </>
              )}
            </button>
          )}
        </form>

        {/* Filter Pills */}
        <div className="topic-pills-row">
          {topics.map((t) => (
            <button
              key={t}
              className={`topic-pill ${activeTopic === t ? 'active' : ''}`}
              onClick={() => setActiveTopic(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Insight Card */}
      {featuredArticle && (!searchQuery || (featuredArticle.title && featuredArticle.title.toLowerCase().includes(searchQuery.toLowerCase()))) && activeTopic === 'All Topics' && (
        <div 
          className="featured-journal-card"
          onClick={() => onSelectArticle(featuredArticle)}
        >
          <img 
            src={featuredArticle.image} 
            alt={featuredArticle.title} 
            className="featured-journal-img"
          />
          <div className="featured-journal-overlay">
            <span className="featured-badge">{featuredArticle.category}</span>
            <h2 className="featured-journal-title">
              {featuredArticle.title}
            </h2>
            <p className="featured-journal-excerpt">
              {featuredArticle.excerpt}
            </p>
          </div>
        </div>
      )}

      {/* Recent Publications */}
      <section className="section-container" style={{ marginTop: '36px' }}>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="section-title">
            {aiSearchTriggered && searchQuery ? 'Search & AI Synthesized Research' : 'Recent Publications'}
          </h2>
          {isAiLoading && (
            <span style={{ fontSize: '0.85rem', color: '#566956', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Loader2 size={14} className="spin-animate" />
              Analyzing clinical literature...
            </span>
          )}
        </div>

        {filteredArticles.length === 0 ? (
          <div className="empty-state-box" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <BookOpen size={32} style={{ margin: '0 auto 1rem auto', color: '#788378' }} />
            <p style={{ fontWeight: 600, fontSize: '1.05rem', color: '#2B372B' }}>No clinical articles found</p>
            <p style={{ color: '#788378', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Click <strong>AI Search</strong> above to synthesize new clinical research papers for "{searchQuery}".
            </p>
          </div>
        ) : (
          <div className="publications-grid">
            {filteredArticles.map((art) => (
              <div 
                key={art.id} 
                className="publication-card"
                onClick={() => onSelectArticle(art)}
              >
                <div className="publication-img-wrap">
                  <img src={art.image} alt={art.title} />
                  {art.is_ai_generated && (
                    <span style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(32, 40, 32, 0.85)',
                      backdropFilter: 'blur(8px)',
                      color: '#B4E6B4',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      letterSpacing: '0.03em',
                    }}>
                      <Sparkles size={11} />
                      AI SYNTHESIS
                    </span>
                  )}
                </div>
                <div className="publication-body">
                  <div className="publication-meta">
                    {art.category} • {art.readTime}
                  </div>
                  <h3 className="publication-title">
                    {art.title}
                  </h3>
                  <p className="publication-excerpt">
                    {art.excerpt}
                  </p>
                  <div className="publication-read-link">
                    <span>Read</span>
                    <ArrowUpRight size={15} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

