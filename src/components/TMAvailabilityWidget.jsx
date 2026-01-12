import { useEffect, useState } from 'react';
import { GOOGLE_API } from '../config/apiConfig';

export default function TMAvailabilityWidget() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * =========================================================
   * DATA FETCH — UNCHANGED (KNOWN WORKING)
   * =========================================================
   * Uses local Google proxy with:
   * ?endpoint=availability
   */
  useEffect(() => {
    fetch(`${GOOGLE_API}?endpoint=availability`)
      .then(res => {
        if (!res.ok) throw new Error(`Backend Error ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.error) throw new Error(data.error);
        setAvailability(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('TMAvailabilityWidget error:', err);
        setError('❌ Failed to load availability');
      })
      .finally(() => setLoading(false));
  }, []);

  /**
   * =========================================================
   * MESSAGE → COLOR LOGIC (EXACT MATCH TO SPEC)
   * =========================================================
   */
  function getMessageColor(message = '') {
    if (message.includes('Available until')) return '#22c55e';      // green
    if (message.includes('Available again at')) return '#facc15';   // yellow
    if (message.includes('Available in')) return '#60a5fa';         // blue
    if (message.includes('Shift starts at')) return '#60a5fa';      // blue
    if (message.includes('On Leave')) return '#a855f7';             // purple
    if (message.includes('Offline')) return '#94a3b8';              // gray
    return '#94a3b8';
  }

  return (
    <div
      style={{
        background: '#1e293b',
        padding: '22px',
        borderRadius: '16px',
        marginBottom: '28px',
        color: '#e2e8f0'
      }}
    >
      {/* ============================
          Header (World Clock style)
         ============================ */}
      <div
        style={{
          color: '#7aa7ff',          // Header color
          textAlign: 'center',
          fontSize: '1.6rem',        // Title font size
          fontWeight: 600,
          marginBottom: '10px'
        }}
      >
        TM Availability
      </div>

      {/* Divider — matches World Clock */}
      <div
        style={{
          height: '3px',             // Divider thickness
          background: '#7aa7ff',     // Divider color
          borderRadius: '2px',
          marginBottom: '18px'
        }}
      />

      {/* Loading State */}
      {loading && (
        <p style={{ color: '#94a3b8', textAlign: 'center' }}>
          Syncing with Google...
        </p>
      )}

      {/* Error State */}
      {error && (
        <p style={{ color: '#ef4444', textAlign: 'center' }}>
          {error}
        </p>
      )}

      {/* Availability List */}
      {!loading && !error && availability.map((item, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0',
            borderBottom: '1px solid #334155'
          }}
        >
          {/* Nickname */}
          <div
            style={{
              fontSize: '1rem',       // Nickname font size
              fontWeight: 500,
              color: '#e2e8f0'
            }}
          >
            {item.nickname}
          </div>

          {/* Status */}
          <div
            style={{
              fontSize: '1rem',     // Status font size
              fontWeight: 500,
              color: getMessageColor(item.message)
            }}
          >
            {item.message}
          </div>
        </div>
      ))}
    </div>
  );
}

/* =====================================================
   DIGITAL SIGNATURE AND OWNERSHIP
===================================================== */
/* TinyURL-Intranet-2025 © VeverlieAnneMarquez */
/* Version: 1.1.260107 */
/* SHA256 Hash of this exact file content: */
/* <<< GENERATE AFTER FINAL APPROVAL >>> */
