import React from 'react';
import { ArrowRight, Brain, Layers, Compass, BookOpen } from 'lucide-react';
import { METHODOLOGY_CARDS, ARTICLES_DATA } from '../data/zenphoriaData';

export default function HomePage({ onNavigate, onOpenWaitingList, onSelectArticle }) {
  const featuredArticle = ARTICLES_DATA.find(a => a.id === 'architecture-of-anxiety') || ARTICLES_DATA[0];

  return (
    <div className="page-content">
      {/* Hero Section */}
      <section style={{ marginBottom: '40px' }}>
        <h1 className="page-title">
          Start by understanding yourself.
        </h1>
        <p className="page-subtitle">
          A modern clinical approach to psychological wellness, bridging the gap between rigorous academia and empathetic care. Begin your journey to profound clarity.
        </p>

        <div className="btn-group-hero">
          <button className="btn btn-primary" onClick={onOpenWaitingList}>
            Join Waiting List
          </button>
          <button className="btn btn-paused" disabled>
            Bookings Paused
          </button>
          <button className="btn btn-outline" onClick={() => onNavigate('pillars')}>
            Explore Method
          </button>
        </div>

        {/* Hero Image (Warm Scandinavian interior with armchair and serene art) */}
        <div className="hero-image-card">
          <img 
            src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80" 
            alt="Warm calming consultation space" 
          />
        </div>
      </section>

      {/* Methodology Section */}
      <section style={{ marginBottom: '44px' }}>
        <span className="section-overline">Methodology</span>
        <h2 className="page-title" style={{ fontSize: '28px' }}>
          The Pillars of Psychological Wellness
        </h2>
        <p className="page-subtitle" style={{ marginBottom: '20px' }}>
          Our foundational approach to cultivating mental clarity and emotional resilience.
        </p>

        <div className="cards-list">
          {METHODOLOGY_CARDS.map((card) => {
            return (
              <div 
                key={card.id} 
                className="wellness-card"
                onClick={() => onNavigate('pillars')}
              >
                <div className="wellness-card-icon-wrap">
                  {card.id === 'cognitive-mapping' && <Brain size={20} />}
                  {card.id === 'emotional-regulation' && <Layers size={20} />}
                  {card.id === 'behavioral-alignment' && <Compass size={20} />}
                </div>
                <h3 className="wellness-card-title">{card.title}</h3>
                <p className="wellness-card-desc">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Readings Section */}
      <section style={{ marginBottom: '48px' }}>
        <h2 className="page-title" style={{ fontSize: '28px', marginBottom: '18px' }}>
          Recent Readings
        </h2>

        {/* Featured Card */}
        <div 
          className="home-read-card"
          onClick={() => onSelectArticle(featuredArticle)}
        >
          <div style={{ position: 'relative' }}>
            <img 
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80" 
              alt="Hands holding journal" 
              className="home-read-img"
            />
            <span 
              className="featured-badge" 
              style={{ position: 'absolute', top: '12px', left: '12px', fontSize: '10px' }}
            >
              Clinical Insight
            </span>
          </div>
          <div className="home-read-body">
            <h3 className="wellness-card-title" style={{ fontSize: '20px', lineHeight: 1.25 }}>
              The Architecture of Anxiety: A Structural Approach
            </h3>
            <p className="wellness-card-desc" style={{ marginTop: '6px', marginBottom: '10px' }}>
              Examining the foundational triggers of modern anxiety through a clinical lens, moving beyond symptom management to radical repair.
            </p>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              8 Min Read — Dr. E. Frazier
            </div>
          </div>
        </div>

        {/* Article list */}
        <div style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '18px' }}>
          <div 
            className="home-read-list-item"
            onClick={() => onSelectArticle(ARTICLES_DATA.find(a => a.id === 'nervous-system-burnout') || ARTICLES_DATA[1])}
          >
            <div className="home-read-item-title">Reclaiming the Attentional Span</div>
            <div className="home-read-item-desc">Strategies for focus in a hyper-stimulating environment.</div>
            <div className="home-read-item-meta">4 Min Read</div>
          </div>

          <div 
            className="home-read-list-item"
            onClick={() => onSelectArticle(ARTICLES_DATA.find(a => a.id === 'introspection-paradox') || ARTICLES_DATA[3])}
          >
            <div className="home-read-item-title">The Myth of Perfect Resilience</div>
            <div className="home-read-item-desc">Why true psychological strength requires vulnerability.</div>
            <div className="home-read-item-meta">6 Min Read</div>
          </div>
        </div>

        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', color: 'var(--text-headline)' }}
          onClick={() => onNavigate('journal')}
        >
          <span>View All Journal Entries</span>
          <ArrowRight size={14} />
        </div>
      </section>

      {/* Ready to Begin Card */}
      <section className="journey-cta-box" style={{ marginTop: 0 }}>
        <h2 className="journey-cta-title">Ready to begin?</h2>
        <p className="journey-cta-desc">
          Take the first step towards clinical clarity and emotional well-being. Schedule a preliminary consultation to discuss your specific needs.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '340px', margin: '0 auto' }}>
          <button className="btn btn-primary" onClick={onOpenWaitingList}>
            Join Waiting List
          </button>
          <button className="btn btn-paused" disabled>
            Bookings Paused
          </button>
          <button className="btn btn-outline" onClick={() => onNavigate('assessment')}>
            View Availability
          </button>
        </div>
      </section>
    </div>
  );
}
