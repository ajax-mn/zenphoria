import React, { useState } from 'react';
import { Search, ArrowUpRight } from 'lucide-react';
import { ARTICLES_DATA } from '../data/zenphoriaData';

export default function JournalPage({ onSelectArticle }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState('All Topics');

  const topics = ['All Topics', 'Clinical Frameworks', 'Mindfulness', 'Cognitive Load'];

  const featuredArticle = ARTICLES_DATA.find(a => a.id === 'architecture-of-empathy') || ARTICLES_DATA[0];

  const filteredArticles = ARTICLES_DATA.filter((art) => {
    if (art.id === featuredArticle.id && !searchQuery) return false; // Show in featured if no active search
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.topic.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTopic = activeTopic === 'All Topics' || art.topic === activeTopic;

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

        {/* Search Input */}
        <div className="journal-search-wrap">
          <Search size={18} className="journal-search-icon" />
          <input
            type="text"
            className="journal-search-input"
            placeholder="Search articles, topics, or authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

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
      {(!searchQuery || featuredArticle.title.toLowerCase().includes(searchQuery.toLowerCase())) && activeTopic === 'All Topics' && (
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
        <div className="section-header">
          <h2 className="section-title">
            Recent Publications
          </h2>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="empty-state-box">
            No articles found matching your criteria.
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
