import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Sunset, 
  Moon, 
  Sunrise, 
  SlidersHorizontal,
  Check
} from 'lucide-react';

const TIME_PRESETS = [
  { id: 'morning', label: 'Morning', range: '09:00 AM – 12:00 PM', icon: Sunrise },
  { id: 'afternoon', label: 'Afternoon', range: '12:00 PM – 03:00 PM', icon: Sun },
  { id: 'late_afternoon', label: 'Late Afternoon', range: '03:00 PM – 06:00 PM', icon: Sunset },
  { id: 'evening', label: 'Evening', range: '06:00 PM – 09:00 PM', icon: Moon },
  { id: 'custom', label: 'Custom Range', range: 'Choose times', icon: SlidersHorizontal }
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function DateTimePicker({ value, onChange, onISOChange }) {
  const today = useMemo(() => new Date(), []);
  
  // Parse existing value or initialize with tomorrow as default suggested date
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    // Default to tomorrow
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });

  const [selectedTimeSlot, setSelectedTimeSlot] = useState('morning');
  const [customStartTime, setCustomStartTime] = useState('10:00');
  const [customEndTime, setCustomEndTime] = useState('11:30');
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);

  // Map preset slot IDs to 24h start times for ISO datetime generation
  const SLOT_START_TIMES = {
    morning: '09:00',
    afternoon: '12:00',
    late_afternoon: '15:00',
    evening: '18:00'
  };

  // Sync formatted value to parent
  const updateParent = (dateStr, slotId, customStart, customEnd) => {
    if (!dateStr) {
      onChange('');
      if (onISOChange) onISOChange('');
      return;
    }

    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dateFormatted = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    let timeFormatted = '';
    let startTime24h = '09:00'; // default fallback
    if (slotId === 'custom') {
      const formatTime = (t) => {
        if (!t) return '';
        const [h, m] = t.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        return `${String(displayH).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
      };
      timeFormatted = `${formatTime(customStart)} – ${formatTime(customEnd)}`;
      startTime24h = customStart || '10:00';
    } else {
      const preset = TIME_PRESETS.find(p => p.id === slotId);
      timeFormatted = preset ? preset.range : '';
      startTime24h = SLOT_START_TIMES[slotId] || '09:00';
    }

    const fullValue = `${dateFormatted} (${timeFormatted})`;
    onChange(fullValue);

    // Emit ISO 8601 datetime for API consumption
    if (onISOChange) {
      const isoStr = `${dateStr}T${startTime24h}:00`;
      onISOChange(isoStr);
    }
  };

  // Trigger initial value on mount and keep parent in sync
  React.useEffect(() => {
    updateParent(selectedDate, selectedTimeSlot, customStartTime, customEndTime);
  }, [selectedDate, selectedTimeSlot, customStartTime, customEndTime]);

  const handleSelectDate = (dateStr) => {
    setSelectedDate(dateStr);
    updateParent(dateStr, selectedTimeSlot, customStartTime, customEndTime);
  };

  const handleSelectSlot = (slotId) => {
    setSelectedTimeSlot(slotId);
    updateParent(selectedDate, slotId, customStartTime, customEndTime);
  };

  const handleCustomTimeChange = (start, end) => {
    setCustomStartTime(start);
    setCustomEndTime(end);
    if (selectedTimeSlot === 'custom') {
      updateParent(selectedDate, 'custom', start, end);
    }
  };

  // Calendar generation logic
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Navigation handlers
  const canGoPrev = useMemo(() => {
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    return currentMonthDate > currentMonthStart;
  }, [currentMonthDate, today]);

  const handlePrevMonth = (e) => {
    e.preventDefault();
    if (!canGoPrev) return;
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.preventDefault();
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const isDateDisabled = (day) => {
    const checkDate = new Date(year, month, day);
    const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return checkDate < todayZero;
  };

  const isDateSelected = (day) => {
    if (!selectedDate) return false;
    const [sYear, sMonth, sDay] = selectedDate.split('-').map(Number);
    return sYear === year && sMonth === month + 1 && sDay === day;
  };

  const isToday = (day) => {
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  // Quick select helper
  const handleQuickSelect = (daysFromToday) => {
    const target = new Date();
    target.setDate(today.getDate() + daysFromToday);
    const dateStr = target.toISOString().split('T')[0];
    setCurrentMonthDate(new Date(target.getFullYear(), target.getMonth(), 1));
    handleSelectDate(dateStr);
  };

  return (
    <div className="datetime-picker-container" style={{
      background: 'var(--bg-card, #F2EFE8)',
      borderRadius: 'var(--radius-md, 14px)',
      border: '1px solid var(--border-color, #E2DFD4)',
      padding: '16px',
      marginBottom: '8px'
    }}>
      {/* Quick Date Chips */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '8px' 
        }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-headline, #2B372B)' }}>
            1. Select Preferred Date
          </span>
          <button
            type="button"
            onClick={() => setIsCalendarExpanded(!isCalendarExpanded)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-sage, #566956)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '2px 6px',
              borderRadius: '6px'
            }}
          >
            {isCalendarExpanded ? 'Compact View' : 'Show Calendar'}
          </button>
        </div>

        {/* Quick Date Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {[
            { label: 'Today', days: 0 },
            { label: 'Tomorrow', days: 1 },
            { label: 'In 2 Days', days: 2 },
            { label: 'Next Week', days: 7 }
          ].map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => handleQuickSelect(chip.days)}
              style={{
                fontSize: '12px',
                padding: '5px 10px',
                borderRadius: '9999px',
                border: '1px solid var(--border-color, #E2DFD4)',
                background: 'rgba(255, 255, 255, 0.7)',
                color: 'var(--text-body, #4E574E)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-sage)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Calendar Box */}
      {isCalendarExpanded ? (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle, #EBE8DE)',
          padding: '12px 14px',
          marginBottom: '18px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
        }}>
          {/* Month Header & Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
            paddingBottom: '8px',
            borderBottom: '1px solid #F0ECE1'
          }}>
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={!canGoPrev}
              aria-label="Previous month"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: '1px solid var(--border-color, #E2DFD4)',
                background: canGoPrev ? 'var(--bg-primary, #F9F8F3)' : '#F5F5F5',
                color: canGoPrev ? 'var(--text-headline)' : '#C0C0C0',
                cursor: canGoPrev ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s ease'
              }}
            >
              <ChevronLeft size={16} />
            </button>

            <div style={{
              fontWeight: 700,
              fontSize: '14px',
              color: 'var(--text-headline, #2B372B)',
              letterSpacing: '0.2px'
            }}>
              {MONTH_NAMES[month]} {year}
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Next month"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: '1px solid var(--border-color, #E2DFD4)',
                background: 'var(--bg-primary, #F9F8F3)',
                color: 'var(--text-headline)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Weekday Names */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            textAlign: 'center',
            gap: '4px',
            marginBottom: '6px'
          }}>
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-muted, #788378)',
                padding: '2px 0'
              }}>
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px'
          }}>
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} style={{ height: '32px' }} />
            ))}

            {/* Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const disabled = isDateDisabled(day);
              const selected = isDateSelected(day);
              const current = isToday(day);

              const dayString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelectDate(dayString)}
                  style={{
                    height: '32px',
                    borderRadius: '8px',
                    border: selected ? '1px solid var(--accent-olive, #3D483D)' : current ? '1px dashed var(--accent-sage, #566956)' : '1px solid transparent',
                    background: selected 
                      ? 'var(--btn-primary-bg, #445144)' 
                      : current 
                        ? 'var(--bg-subtle-badge-green, #DCE5DC)' 
                        : 'transparent',
                    color: selected 
                      ? '#FFFFFF' 
                      : disabled 
                        ? '#C8C4B8' 
                        : 'var(--text-headline, #2B372B)',
                    fontWeight: selected || current ? 700 : 500,
                    fontSize: '12.5px',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                    position: 'relative'
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Compact Date Picker Input */
        <div style={{ marginBottom: '16px' }}>
          <input
            type="date"
            className="form-input"
            min={today.toISOString().split('T')[0]}
            value={selectedDate}
            onChange={(e) => handleSelectDate(e.target.value)}
            style={{ fontSize: '13.5px', padding: '10px 14px' }}
          />
        </div>
      )}

      {/* 2. Select Time Range Window */}
      <div>
        <label style={{ 
          fontSize: '13px', 
          fontWeight: 600, 
          color: 'var(--text-headline, #2B372B)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          marginBottom: '8px' 
        }}>
          <Clock size={15} color="var(--accent-sage)" />
          <span>2. Select Time Range</span>
        </label>

        {/* Time Window Slots Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '8px',
          marginBottom: '10px'
        }}>
          {TIME_PRESETS.map((slot) => {
            const Icon = slot.icon;
            const isSelected = selectedTimeSlot === slot.id;

            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => handleSelectSlot(slot.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: isSelected ? '1.5px solid var(--accent-olive, #3D483D)' : '1px solid var(--border-color, #E2DFD4)',
                  background: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 3px 10px rgba(68, 81, 68, 0.08)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Icon size={14} color={isSelected ? 'var(--accent-olive)' : 'var(--text-muted)'} />
                    <span style={{ 
                      fontSize: '12px', 
                      fontWeight: 700, 
                      color: isSelected ? 'var(--text-headline)' : 'var(--text-body)' 
                    }}>
                      {slot.label}
                    </span>
                  </div>
                  {isSelected && <Check size={12} color="var(--accent-olive)" strokeWidth={3} />}
                </div>
                <span style={{ 
                  fontSize: '11px', 
                  color: isSelected ? 'var(--accent-sage)' : 'var(--text-muted)',
                  fontWeight: 500 
                }}>
                  {slot.range}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom Time Range Selector (if selected) */}
        {selectedTimeSlot === 'custom' && (
          <div style={{
            background: '#FFFFFF',
            padding: '12px 14px',
            borderRadius: '10px',
            border: '1px solid var(--border-color, #E2DFD4)',
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: 1, minWidth: '110px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                Start Time
              </span>
              <input
                type="time"
                value={customStartTime}
                onChange={(e) => handleCustomTimeChange(e.target.value, customEndTime)}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color, #E2DFD4)',
                  fontSize: '13px',
                  background: 'var(--bg-primary)'
                }}
              />
            </div>

            <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '16px' }}>to</span>

            <div style={{ flex: 1, minWidth: '110px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                End Time
              </span>
              <input
                type="time"
                value={customEndTime}
                onChange={(e) => handleCustomTimeChange(customStartTime, e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color, #E2DFD4)',
                  fontSize: '13px',
                  background: 'var(--bg-primary)'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Selected Slot Confirmation Badge */}
      {value && (
        <div style={{
          marginTop: '12px',
          padding: '8px 12px',
          background: 'var(--bg-subtle-badge-green, #DCE5DC)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12.5px',
          color: 'var(--accent-olive, #3D483D)',
          fontWeight: 600
        }}>
          <CalendarIcon size={14} />
          <span>Selected: {value}</span>
        </div>
      )}
    </div>
  );
}
