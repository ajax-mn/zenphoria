import React from 'react';
import { Fingerprint, CircleDot, Users, Monitor, BookOpen, Calendar } from 'lucide-react';
import { ZENPHORIA_PILLARS } from '../data/zenphoriaData';

const iconMap = {
  Fingerprint: Fingerprint,
  CircleDot: CircleDot,
  Users: Users,
  Monitor: Monitor,
  BookOpen: BookOpen
};

export default function PillarsPage({ onNavigate, onOpenBooking }) {
  return (
    <div className="page-wrapper">
      {/* Framework Header */}
      <section className="section-header-center">
        <span className="section-overline">Our Framework</span>
        <h1 className="page-title">The Five Pillars</h1>
        <p className="page-subtitle max-width-sub">
          A structured approach to psychological wellness, designed for the modern professional seeking deeper self-understanding and emotional mastery.
        </p>
      </section>

      {/* Pillars Grid */}
      <div className="pillars-grid">
        {ZENPHORIA_PILLARS.map((pillar) => {
          const IconComponent = iconMap[pillar.icon] || CircleDot;
          return (
            <div key={pillar.id} className="pillar-card">
              <div className="pillar-header">
                <div className="pillar-badge-icon">
                  <IconComponent size={20} />
                </div>
                <h2 className="pillar-title">{pillar.title}</h2>
              </div>
              <p className="pillar-desc">{pillar.subtitle}</p>

              <div className="pillar-tags-grid">
                {pillar.tags.map((tag, idx) => (
                  <div key={idx} className="pillar-tag-box">
                    <div className="pillar-tag-title">{tag.title}</div>
                    <div className="pillar-tag-sub">{tag.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Begin Your Journey Box */}
      <section className="journey-cta-section">
        <div className="journey-cta-box">
          <h2 className="journey-cta-title">Begin Your Journey</h2>
          <p className="journey-cta-desc">
            Expand these pillars in depth through our structured sessions.
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
