import React, { useState } from 'react';
import { Lightbulb, Heart, TrendingUp, Flower2, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { ASSESSMENT_OPTIONS } from '../data/zenphoriaData';

export default function AssessmentPage({ onNavigate, onOpenWaitingList }) {
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
        return <Lightbulb size={20} color="#4A564A" />;
      case 'heart':
        return <Heart size={20} color="#7D5E42" />;
      case 'trending':
        return <TrendingUp size={20} color="#3E4C3E" />;
      case 'leaf':
        return <Flower2 size={20} color="#385443" />;
      default:
        return <Lightbulb size={20} />;
    }
  };

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
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
      <div className="page-content">
        <div style={{ textAlign: 'center', padding: '40px 10px' }}>
          <div style={{ display: 'inline-flex', padding: '18px', background: '#E2E9E2', borderRadius: '50%', color: '#3A4B3A', marginBottom: '20px' }}>
            <CheckCircle2 size={48} />
          </div>
          <span className="section-overline">Consultation Tailored</span>
          <h1 className="page-title" style={{ fontSize: '32px', marginBottom: '12px' }}>
            Profile Registered
          </h1>
          <p className="page-subtitle" style={{ maxWidth: '420px', margin: '0 auto 28px' }}>
            Your consultation preference for <strong>{ASSESSMENT_OPTIONS.find(o => o.id === selectedFocus)?.title}</strong> has been structured.
          </p>

          <div className="btn-group-hero" style={{ maxWidth: '300px', margin: '0 auto' }}>
            <button className="btn btn-primary" onClick={onOpenWaitingList}>
              Join Priority Intake
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
    );
  }

  return (
    <div className="page-content">
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
          <h1 className="page-title" style={{ fontSize: '30px', marginBottom: '10px' }}>
            What would you like to focus on?
          </h1>
          <p className="page-subtitle" style={{ marginBottom: '24px' }}>
            Select your primary area of interest to help us tailor your session.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
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
          <h1 className="page-title" style={{ fontSize: '30px', marginBottom: '10px' }}>
            Preferred Format & Cadence
          </h1>
          <p className="page-subtitle" style={{ marginBottom: '24px' }}>
            How would you prefer your structured consultation series to unfold?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {[
              { id: 'weekly', title: 'Weekly 1-on-1 Intensive', desc: '50-minute clinical sessions with ongoing framework integration.' },
              { id: 'biweekly', title: 'Bi-Weekly Modular Cadence', desc: 'Balanced rhythm allowing deep real-world behavioral application.' },
              { id: 'intensive', title: 'Executive Retreat / Single Deep Dive', desc: 'Concentrated exploration of high-impact focus topics.' }
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
          <h1 className="page-title" style={{ fontSize: '30px', marginBottom: '10px' }}>
            Session Notes & Context
          </h1>
          <p className="page-subtitle" style={{ marginBottom: '24px' }}>
            Optional background or specific outcomes you are looking to cultivate.
          </p>

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label">Personal Reflection or Specific Questions</label>
            <textarea
              className="form-textarea"
              rows={5}
              placeholder="e.g. Seeking cognitive clarity regarding leadership transitions, managing emotional fatigue, or cultivating emotional boundaries..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </section>
      )}

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        {step > 1 && (
          <button className="btn btn-outline" style={{ flex: '0 0 100px' }} onClick={handleBack}>
            <ArrowLeft size={16} /> Back
          </button>
        )}
        <button 
          className="btn btn-primary" 
          style={{ flex: 1 }}
          onClick={handleContinue}
        >
          <span>Continue</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
