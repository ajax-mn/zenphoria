import React, { useState } from 'react';
import { Search, ArrowUpRight } from 'lucide-react';
import { ARTICLES_DATA } from '../data/zenphoriaData';

export default function JournalPage({ onSelectArticle }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState('All Topics');

  const topics = ['All Topics', 'Clinical Frameworks', 'Mindfulness', 'Cognitive Load'];

  const featuredArticle = ARTICLES_DATA.find(a => a.id === 'architecture-of-empathy') || ARTICLES_DATA[0];

  const filteredArticles = ARTICLES_DATA.filter((art) => {
    if (art.id === featuredArticle.id) return false; // Show in recent publications
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.topic.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTopic = activeTopic === 'All Topics' || art.topic === activeTopic;

    return matchesSearch && matchesTopic;
  });

  return (
    <div className="page-content">
      {/* Header */}
      <section style={{ marginBottom: '28px' }}>
        <h1 className="page-title" style={{ fontSize: '32px', marginBottom: '12px' }}>
          Journal & Resources
        </h1>
        <p className="page-subtitle" style={{ marginBottom: '24px' }}>
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
      {(!searchQuery || featuredArticle.title.toLowerCase().includes(searchQuery.toLowerCase())) && (
        <div 
          className="featured-journal-card"
          onClick={() => onSelectArticle(featuredArticle)}
        >
          <img 
            src={featuredArticle.image} 
            alt={featuredArticle.title} 
          />
          <div className="featured-journal-overlay">
            <span className="featured-badge">{featuredArticle.category}</span>
            <h2 className="featured-journal-title">
              {featuredArticle.title}
            </h2>
          </div>
        </div>
      )}

      {/* Recent Publications */}
      <section>
        <h2 className="page-title" style={{ fontSize: '26px', marginBottom: '20px' }}>
          Recent Publications
        </h2>

        {filteredArticles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            No articles found matching your search.
          </div>
        ) : (
          <div>
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
