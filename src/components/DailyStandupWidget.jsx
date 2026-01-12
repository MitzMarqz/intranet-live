/**
 * =========================================================
 * Block Name: DailyStandupWidget
 * =========================================================
 *
 * Purpose:
 * - Collect daily standup input
 * - Post plain text message to Google Chat
 * - Keep logic simple and reliable
 *
 * =========================================================
 */

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/apiConfig';

export default function DailyStandupWidget() {
  const [submittedBy, setSubmittedBy] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  /**
   * Auto-fill name from localStorage login (UNCHANGED)
   */
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('currentUser'));
      if (storedUser?.name) setSubmittedBy(storedUser.name);
      else if (storedUser?.email) setSubmittedBy(storedUser.email);
    } catch {
      console.warn('Unable to read currentUser');
    }
  }, []);

  /**
   * Submit to Google Chat
   */
  const submitStandup = async () => {
    if (!submittedBy.trim()) {
      setStatus('⚠️ Unable to determine your name.');
      return;
    }

    if (!message.trim()) {
      setStatus('⚠️ Please enter your standup update.');
      return;
    }

    setStatus('Sending…');

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/standup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submittedBy,
          message
        })
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      // 🔍 AUDIT LOG: Daily standup submitted
      fetch('/api/google?endpoint=users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'audit',
          actor: submittedBy,
          event: 'daily_standup_submitted'
        })
      }).catch(() => {}); // never block the UI


      setMessage('');
      setStatus('✅ Standup posted to Google Chat');
    } catch (err) {
      console.error('DailyStandupWidget error:', err);
      setStatus('❌ Failed to post standup. Please try again.');
    }
  };

  return (
    <div
      style={{
        background: 'var(--widget-bg)',
        padding: '22px',
        borderRadius: '18px',
        marginBottom: '28px'
      }}
    >
      {/* Header — World Clock style */}
      <div
        style={{
          color: '#7aa7ff',
          textAlign: 'center',
          fontSize: '1.6rem',
          fontWeight: 600,
          marginBottom: '12px'
        }}
      >
        Daily Standup
      </div>

      <div
        style={{
          height: '3px',
          background: '#7aa7ff',
          borderRadius: '2px',
          marginBottom: '18px'
        }}
      />

      {/* Name */}
      <input
        type="text"
        value={submittedBy}
        onChange={(e) => setSubmittedBy(e.target.value)}
        placeholder="Your name"
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '12px',
          border: 'none',
          marginBottom: '12px',
          fontSize: '1rem'
        }}
      />

      {/* Message */}
      <textarea
        placeholder="Yesterday • Today • Blockers"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          width: '100%',
          height: '120px',
          borderRadius: '12px',
          padding: '14px',
          fontSize: '1rem',
          border: 'none',
          marginBottom: '16px'
        }}
      />

      <button
        onClick={submitStandup}
        style={{
          width: '100%',
          padding: '14px',
          background: '#7aa7ff',
          color: '#1e293b',
          border: 'none',
          borderRadius: '12px',
          fontWeight: 600,
          cursor: 'pointer'
        }}
      >
        Submit to Google Space
      </button>

      {status && (
        <p
          style={{
            textAlign: 'center',
            marginTop: '12px',
            color: status.startsWith('❌') ? '#ef4444' : '#94a3b8'
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
}