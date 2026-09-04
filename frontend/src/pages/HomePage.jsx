import React from 'react';
import { ArrowRight, Brain, Layers, Compass, Calendar } from 'lucide-react';
import { METHODOLOGY_CARDS, ARTICLES_DATA } from '../data/zenphoriaData';

export default function HomePage({ onNavigate, onOpenBooking, onSelectArticle }) {
  const featuredArticle = ARTICLES_DATA.find(a => a.id === 'architecture-of-anxiety') || ARTICLES_DATA[0];

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-content">
            <h1 className="hero-title">
              Start by understanding yourself.
            </h1>
            <p className="hero-subtitle">
              A modern clinical approach to psychological wellness, bridging the gap between rigorous academia and empathetic care. Begin your journey to profound clarity.
            </p>

            <div className="hero-btn-group">
              <button className="btn btn-primary" onClick={onOpenBooking}>
                <Calendar size={16} />
                <span>Book Now</span>
              </button>
              <button className="btn btn-outline" onClick={() => onNavigate('pillars')}>
                Explore Method
              </button>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80" 
              alt="Warm calming consultation space" 
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="section-container">
        <div className="section-header">
          <span className="section-overline">Methodology</span>
          <h2 className="section-title">
            The Pillars of Psychological Wellness
          </h2>
          <p className="section-subtitle">
            Our foundational approach to cultivating mental clarity and emotional resilience.
          </p>
        </div>

        <div className="methodology-grid">
          {METHODOLOGY_CARDS.map((card) => {
            return (
              <div 
                key={card.id} 
                className="wellness-card"
                onClick={() => onNavigate('pillars')}
              >
                <div className="wellness-card-icon-wrap">
                  {card.id === 'cognitive-mapping' && <Brain size={22} />}
                  {card.id === 'emotional-regulation' && <Layers size={22} />}
                  {card.id === 'behavioral-alignment' && <Compass size={22} />}
                </div>
                <h3 className="wellness-card-title">{card.title}</h3>
                <p className="wellness-card-desc">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Readings Section */}
      <section className="section-container">
        <div className="section-header">
          <h2 className="section-title">
            Recent Readings
          </h2>
        </div>

        <div className="recent-readings-grid">
          {/* Featured Reading Card */}
          <div 
            className="home-read-card featured-reading-card"
            onClick={() => onSelectArticle(featuredArticle)}
          >
            <div className="home-read-img-wrap">
              <img 
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80" 
                alt="Hands holding journal" 
                className="home-read-img"
              />
              <span className="featured-badge home-featured-badge">
                Clinical Insight
              </span>
            </div>
            <div className="home-read-body">
              <h3 className="wellness-card-title" style={{ fontSize: '22px', lineHeight: 1.25 }}>
                The Architecture of Anxiety: A Structural Approach
              </h3>
              <p className="wellness-card-desc" style={{ marginTop: '8px', marginBottom: '12px' }}>
                Examining the foundational triggers of modern anxiety through a clinical lens, moving beyond symptom management to radical repair.
              </p>
              <div className="home-read-item-meta">
                8 Min Read — Dr. E. Frazier
              </div>
            </div>
          </div>

          {/* List of other articles */}
          <div className="readings-sidebar">
            <div 
              className="home-read-list-item"
              onClick={() => onSelectArticle(ARTICLES_DATA.find(a => a.id === 'nervous-system-burnout') || ARTICLES_DATA[1])}
            >
              <div className="home-read-item-title">Reclaiming the Attentional Span</div>
              <div className="home-read-item-desc">Strategies for focus in a hyper-stimulating environment.</div>
              <div className="home-read-item-meta">4 Min Read • Clinical Practice</div>
            </div>

            <div 
              className="home-read-list-item"
              onClick={() => onSelectArticle(ARTICLES_DATA.find(a => a.id === 'introspection-paradox') || ARTICLES_DATA[3])}
            >
              <div className="home-read-item-title">The Myth of Perfect Resilience</div>
              <div className="home-read-item-desc">Why true psychological strength requires vulnerability.</div>
              <div className="home-read-item-meta">6 Min Read • Mindfulness</div>
            </div>

            <div 
              className="home-read-list-item"
              onClick={() => onSelectArticle(ARTICLES_DATA.find(a => a.id === 'psychological-safety-remote') || ARTICLES_DATA[2])}
            >
              <div className="home-read-item-title">Constructing Psychological Safety in Remote Teams</div>
              <div className="home-read-item-desc">Maintaining interpersonal trust and authentic communication.</div>
              <div className="home-read-item-meta">8 Min Read • Team Science</div>
            </div>

            <div 
              className="view-all-link"
              onClick={() => onNavigate('journal')}
            >
              <span>View All Journal Entries</span>
              <ArrowRight size={15} />
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Begin Card */}
      <section className="journey-cta-section">
        <div className="journey-cta-box">
          <h2 className="journey-cta-title">Ready to begin?</h2>
          <p className="journey-cta-desc">
            Take the first step towards clinical clarity and emotional well-being. Schedule a preliminary consultation to discuss your specific needs.
          </p>
          <div className="cta-btn-row">
            <button className="btn btn-primary" onClick={onOpenBooking}>
              <Calendar size={16} />
              <span>Book Now</span>
            </button>
            <button className="btn btn-outline" onClick={() => onNavigate('assessment')}>
              View Availability
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
