/**
 * =========================================================
 * Block Name: DailyStandupWidget
 * =========================================================
 *
 * Purpose:
 * - Collect daily standup input
 * - Auto-fill submitter name from login
 * - Post plain text message to Google Chat
 *
 * =========================================================
 */

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/apiConfig';

export default function DailyStandupWidget() {
  /**
   * =========================================================
   * State
   * =========================================================
   */
  const [submittedBy, setSubmittedBy] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  /**
   * =========================================================
   * Auto-fill Name from Login
   * =========================================================
   */
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('currentUser'));

      if (storedUser?.name) {
        setSubmittedBy(storedUser.name);
      } else if (storedUser?.email) {
        setSubmittedBy(storedUser.email);
      }
    } catch (err) {
      console.warn('DailyStandupWidget: Unable to read currentUser');
    }
  }, []);

  /**
   * =========================================================
   * Submit Handler
   * =========================================================
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

      setMessage('');
      setStatus('✅ Standup posted to Google Chat');
    } catch (err) {
      console.error('DailyStandupWidget error:', err);
      setStatus('❌ Failed to post standup. Please try again.');
    }
  };

  /**
   * =========================================================
   * Render
   * =========================================================
   */
  return (
    <div
      style={{
        background: 'var(--widget-bg)',
        padding: '20px',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        marginBottom: '28px'
      }}
    >
      {/* *Daily Standup Widget Block* */}
      <h2
        style={{
          color: '#60a5fa',
          textAlign: 'center',
          borderBottom: '2px solid #60a5fa',
          paddingBottom: '10px',
          marginBottom: '16px',
          fontSize: '1.5rem'
        }}
      >
        Daily Standup
      </h2>

      {/* *Auto-filled Submitter Name* */}
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
          fontSize: '1rem',
          opacity: 0.95
        }}
      />

      {/* *Standup Text* */}
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
          background: '#60a5fa',
          color: '#1e293b',
          border: 'none',
          borderRadius: '12px',
          fontWeight: 'bold',
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

      {/* =====================================================
         DIGITAL SIGNATURE AND OWNERSHIP
      ====================================================== */}
      {/* TinyURL-Intranet-2025 © VeverlieAnneMarquez */}
      {/* Version: 1.2.251226 */}
      {/* SHA256 Hash of this exact file content: */}
      {/* <<< GENERATE AFTER FINAL APPROVAL >>> */}
    </div>
  );
}
