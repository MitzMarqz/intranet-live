/**
 * =========================================================
 * Widget: OutOfOfficeWidget
 * Purpose:
 * - Approved & Pending leave viewer
 * - Approved: today → next 14 days
 * - Pending: all pending
 * =========================================================
 */

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/apiConfig';

export default function OutOfOfficeWidget() {
  const [mode, setMode] = useState('approved');
  const [approved, setApproved] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* =============================
     Fetch data
  ============================== */
  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch(
        `${API_BASE_URL}/api/google?endpoint=leaves`
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      setApproved(data.approved || []);
      setPending(data.pending || []);
    } catch (err) {
      console.error('OOO fetch error:', err);
      setError('Failed to load leave data.');
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     Date helpers
  ============================== */
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const plus14 = new Date(today);
  plus14.setDate(today.getDate() + 14);

  const within14Days = (from, to) => {
    const start = new Date(from);
    const end = new Date(to);
    if (isNaN(start) || isNaN(end)) return false;
    return start <= plus14 && end >= today;
  };

  const formatDate = (value) => {
    const d = new Date(value);
    if (isNaN(d)) return value;
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  };

  const approvedFiltered = approved.filter(l =>
    within14Days(l.from, l.to)
  );

  /* =============================
     Row renderer (FORMAT FIX)
  ============================== */
  const renderLeave = (leave, idx) => (
    <div key={idx} style={{ padding: '12px 0' }}>
      <div style={{ color: '#e2e8f0', fontWeight: '600' }}>
        {leave.name || 'Unknown'} – {leave.leaveType || 'Leave'}
      </div>

      <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
        {formatDate(leave.from)} to {formatDate(leave.to)}
      </div>

      <div
        style={{
          borderBottom: '1px solid #334155',
          marginTop: '12px',
        }}
      />
    </div>
  );

  /* =============================
     Render
  ============================== */
  return (
    <div
      style={{
        background: 'var(--widget-bg)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '28px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
      }}
    >
      <h2
        style={{
          color: '#60a5fa',
          textAlign: 'center',
          borderBottom: '2px solid #60a5fa',
          paddingBottom: '10px',
          marginBottom: '16px',
        }}
      >
        Out of Office
      </h2>

      {/* Toggle buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <button
          onClick={() => setMode('approved')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: mode === 'approved' ? '#60a5fa' : '#334155',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Approved
        </button>

        <button
          onClick={() => setMode('pending')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: mode === 'pending' ? '#facc15' : '#334155',
            color: '#1e293b',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Pending
        </button>
      </div>

      {/* Content */}
      {loading && (
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
          Loading leave records…
        </div>
      )}

      {error && (
        <div style={{ color: '#ef4444', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div
          style={{
            maxHeight: '260px',
            overflowY: 'auto',
            background: '#0f172a',
            borderRadius: '10px',
            padding: '0 12px',
          }}
        >
          {mode === 'approved' && approvedFiltered.length === 0 && (
            <div style={{ padding: '16px', color: '#94a3b8' }}>
              No approved leave in the next 14 days.
            </div>
          )}

          {mode === 'approved' &&
            approvedFiltered.map(renderLeave)}

          {mode === 'pending' && pending.length === 0 && (
            <div style={{ padding: '16px', color: '#94a3b8' }}>
              No pending leave requests.
            </div>
          )}

          {mode === 'pending' &&
            pending.map(renderLeave)}
        </div>
      )}

      {/* =====================================================
         DIGITAL SIGNATURE AND OWNERSHIP
      ====================================================== */}
      {/* TinyURL-Intranet-2025 © VeverlieAnneMarquez */}
      {/* Version: 1.0.251229 */}
      {/* SHA256 Hash of this exact file — generate after approval */}
    </div>
  );
}
