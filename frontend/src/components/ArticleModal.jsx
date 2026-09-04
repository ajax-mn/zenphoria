import React from 'react';
import { X, Clock, User, Bookmark, Share2 } from 'lucide-react';

export default function ArticleModal({ article, onClose }) {
  if (!article) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '640px', padding: 0, overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ position: 'relative', height: '240px', background: '#2E382E' }}>
          <img 
            src={article.image} 
            alt={article.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} 
          />
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            style={{ top: '16px', right: '16px', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '28px 24px 36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span className="section-overline" style={{ margin: 0, color: 'var(--accent-olive)' }}>
              {article.category || 'Clinical Framework'}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <Clock size={13} /> {article.readTime}
            </span>
          </div>

          <h2 className="page-title" style={{ fontSize: '26px', lineHeight: 1.25, marginBottom: '14px' }}>
            {article.title}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '22px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <User size={14} /> By {article.author || 'Zenphoria Clinical Staff'}
          </div>

          <div style={{ 
            fontSize: '15px', 
            lineHeight: 1.7, 
            color: 'var(--text-body)', 
            whiteSpace: 'pre-line',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '20px'
          }}>
            {article.content || article.excerpt}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>
              Done Reading
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
