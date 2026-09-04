import React, { useState } from 'react';
import { Lightbulb, Heart, TrendingUp, Flower2, CheckCircle2, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { ASSESSMENT_OPTIONS } from '../data/zenphoriaData';
import { api } from '../services/api';

export default function AssessmentPage({ onNavigate, onOpenBooking }) {
  const [step, setStep] = useState(1);
  const [selectedFocus, setSelectedFocus] = useState('stress-anxiety');
  const [frequency, setFrequency] = useState('biweekly');
  const [notes, setNotes] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const getStepProgress = () => {
    if (step === 1) return 33;
    if (step === 2) return 66;
    return 100;
  };

  const getStepLabel = () => {
    if (step === 1) return 'Focus';
    if (step === 2) return 'Format';
    return 'Confirm';
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'brain':
        return <Lightbulb size={22} color="#4A564A" />;
      case 'heart':
        return <Heart size={22} color="#7D5E42" />;
      case 'trending':
        return <TrendingUp size={22} color="#3E4C3E" />;
      case 'leaf':
        return <Flower2 size={22} color="#385443" />;
      default:
        return <Lightbulb size={22} />;
    }
  };

  const handleContinue = async () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      await api.submitConsultation({
        focus_area: selectedFocus,
        cadence: frequency,
        notes: notes
      });
      setIsCompleted(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (isCompleted) {
    return (
      <div className="page-wrapper">
        <div className="assessment-container">
          <div className="assessment-completion-card">
            <div className="completion-icon-badge">
              <CheckCircle2 size={48} />
            </div>
            <span className="section-overline">Consultation Tailored</span>
            <h1 className="page-title" style={{ fontSize: '32px', marginBottom: '12px' }}>
              Profile Registered
            </h1>
            <p className="page-subtitle" style={{ maxWidth: '480px', margin: '0 auto 28px' }}>
              Your consultation preference for <strong>{ASSESSMENT_OPTIONS.find(o => o.id === selectedFocus)?.title}</strong> has been structured.
            </p>

            <div className="cta-btn-row" style={{ maxWidth: '440px', margin: '0 auto' }}>
              <button 
                className="btn btn-primary" 
                onClick={() => onOpenBooking({
                  focusArea: ASSESSMENT_OPTIONS.find(o => o.id === selectedFocus)?.title || 'Stress & Anxiety',
                  cadence: frequency === 'weekly' ? 'Weekly 1-on-1 Intensive' : frequency === 'intensive' ? 'Executive Single Deep Dive' : 'Bi-Weekly Modular Cadence',
                  notes: notes
                })}
              >
                <Sparkles size={16} />
                <span>Book Now</span>
              </button>
              <button className="btn btn-outline" onClick={() => { setIsCompleted(false); setStep(1); }}>
                Modify Preferences
              </button>
              <button className="btn btn-outline" onClick={() => onNavigate('home')}>
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="assessment-container">
        {/* Step Tracker */}
        <div className="quiz-progress-bar">
          <div className="quiz-step-text-row">
            <span>STEP {step} OF 3</span>
            <span>{getStepLabel()}</span>
          </div>
          <div className="quiz-progress-track">
            <div className="quiz-progress-fill" style={{ width: `${getStepProgress()}%` }} />
          </div>
        </div>

        {step === 1 && (
          <section>
            <h1 className="page-title" style={{ fontSize: '32px', marginBottom: '10px' }}>
              What would you like to focus on?
            </h1>
            <p className="page-subtitle" style={{ marginBottom: '28px' }}>
              Select your primary area of interest to help us tailor your session.
            </p>

            <div className="assessment-options-grid">
              {ASSESSMENT_OPTIONS.map((opt) => {
                const isSelected = selectedFocus === opt.id;
                return (
                  <div
                    key={opt.id}
                    className={`step-card-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedFocus(opt.id)}
                  >
                    <div className={`step-card-icon ${opt.bgClass}`}>
                      {renderIcon(opt.iconType)}
                    </div>
                    <div className="step-card-title">{opt.title}</div>
                    <div className="step-card-desc">{opt.desc}</div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <h1 className="page-title" style={{ fontSize: '32px', marginBottom: '10px' }}>
              Preferred Format & Cadence
            </h1>
            <p className="page-subtitle" style={{ marginBottom: '28px' }}>
              How would you prefer your structured consultation series to unfold?
            </p>

            <div className="assessment-options-grid single-col">
              {[
                { id: 'weekly', title: 'Weekly 1-on-1 Intensive', desc: '50-minute clinical sessions with ongoing framework integration and personalized exercises.' },
                { id: 'biweekly', title: 'Bi-Weekly Modular Cadence', desc: 'Balanced rhythm allowing deep real-world behavioral application between sessions.' },
                { id: 'intensive', title: 'Executive Retreat / Single Deep Dive', desc: 'Concentrated exploration of high-impact focus topics and strategic clarity.' }
              ].map((fmt) => (
                <div
                  key={fmt.id}
                  className={`step-card-option ${frequency === fmt.id ? 'selected' : ''}`}
                  onClick={() => setFrequency(fmt.id)}
                >
                  <div className="step-card-title">{fmt.title}</div>
                  <div className="step-card-desc">{fmt.desc}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {step === 3 && (
          <section>
            <h1 className="page-title" style={{ fontSize: '32px', marginBottom: '10px' }}>
              Session Notes & Context
            </h1>
            <p className="page-subtitle" style={{ marginBottom: '28px' }}>
              Optional background or specific outcomes you are looking to cultivate.
            </p>

            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label className="form-label">Personal Reflection or Specific Goals</label>
              <textarea
                className="form-textarea"
                rows={5}
                placeholder="e.g. Seeking cognitive clarity regarding career transitions, managing emotional fatigue, or cultivating emotional boundaries..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </section>
        )}

        {/* Navigation Buttons */}
        <div className="quiz-actions-row">
          {step > 1 && (
            <button className="btn btn-outline quiz-back-btn" onClick={handleBack}>
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}
          <button 
            className="btn btn-primary quiz-continue-btn" 
            onClick={handleContinue}
          >
            <span>Continue</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
