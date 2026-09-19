import React from 'react';
import { MessageCircle } from 'lucide-react';

/**
 * WhatsAppRedirectButton component
 * Directs registered clients to WhatsApp direct chat via the wa.me API.
 * 
 * @param {string} clientName - Name of the registered client
 * @param {string} phoneNumber - Target WhatsApp phone number (with country code, no + or spaces)
 * @param {string} customMessage - Optional override message
 * @param {string} className - Optional additional CSS/Tailwind classes
 */
export default function WhatsAppRedirectButton({
  clientName = '',
  phoneNumber = '919645866400', // International format with country code 91 (India)
  customMessage = '',
  className = ''
}) {
  const displayName = clientName?.trim() || 'a client';
  
  const defaultMessage = customMessage || 
    `Hi, I just registered on Zenphoria as ${displayName}. I'd like to get more details about the consultation process.`;

  const encodedMessage = encodeURIComponent(defaultMessage);
  
  // Format phone number: strip non-digits, ensure country code 91 if 10-digit number
  let cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  if (cleanPhone.length === 10) {
    cleanPhone = `91${cleanPhone}`;
  }

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-sm md:text-base rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 no-underline cursor-pointer w-full text-center ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '14px 24px',
        backgroundColor: '#25D366',
        color: '#FFFFFF',
        fontWeight: 600,
        fontSize: '15px',
        borderRadius: '12px',
        textDecoration: 'none',
        boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        boxSizing: 'border-box',
        width: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#20bd5a';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.45)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#25D366';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 14px rgba(37, 211, 102, 0.35)';
      }}
    >
      <MessageCircle size={20} strokeWidth={2.2} />
      <span>Chat with Specialist on WhatsApp</span>
    </a>
  );
}
