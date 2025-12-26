/**
 * =========================================================
 * OutOfOfficeWidget
 * =========================================================
 * Data Source: Apps Script (leaves endpoint)
 * Owner: TinyURL Intranet
 * =========================================================
 */

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/apiConfig';

export default function OutOfOfficeWidget() {
  const [mode, setMode] = useState('approved');
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * =========================================================
   * Fetch leaves
   * =========================================================
   */
  useEffect(() => {
    async function fetchLeaves() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE_URL}/api/google?endpoint=leaves`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch leave data');
        }

        const data = await response.json();

        setApprovedLeaves(data.approved || []);
        setPendingLeaves(data.pending || []);
      } catch (err) {
        console.error('OutOfOfficeWidget error:', err);
        setError('Failed to load leave data.');
      } finally {
        setLoading(false);
      }
    }

    fetchLeaves();
  }, []);

  /**
   * =========================================================
   * Render helpers
   * =========================================================
   */
  function renderLeaveItem(leave, index) {
    const fromDate = new Date(`${leave.from}T00:00:00`);
    const toDate = new Date(`${leave.to}T00:00:00`);

    if (isNaN(fromDate) || isNaN(toDate)) {
      return (
        <div key={index} style={{ marginTop: '12px' }}>
          <strong>{leave.name}</strong>
          <div style={{ color: 'red' }}>Invalid date</div>
        </div>
      );
    }

    const diffDays =
      Math.round((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

    return (
      <div
        key={index}
        style={{
          marginTop: '12px',
          paddingLeft: '12px',
          borderLeft: '3px solid #60a5fa'
        }}
      >
        <strong>{leave.name}</strong>
        <div style={{ color: '#cbd5f5' }}>
          {fromDate.toLocaleDateString()} –{' '}
          {toDate.toLocaleDateString()} ({diffDays} days)
        </div>
      </div>
    );
  }

  /**
   * =========================================================
   * Render
   * =========================================================
   */
  return (
    <div
      style={{
        background: '#1e293b',
        padding: '20px',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        marginBottom: '28px'
      }}
    >
      <h2
        style={{
          color: '#60a5fa',
          textAlign: 'center',
          borderBottom: '2px solid #60a5fa',
          paddingBottom: '10px'
        }}
      >
        Out of Office
      </h2>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '12px'
        }}
      >
        <button onClick={() => setMode('approved')}>Approved</button>
        <button onClick={() => setMode('pending')}>Pending</button>
      </div>

      {/* States */}
      {loading && <p style={{ textAlign: 'center' }}>Loading…</p>}
      {error && (
        <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
      )}

      {/* Data */}
      {!loading &&
        !error &&
        (mode === 'approved' ? approvedLeaves : pendingLeaves).map(
          renderLeaveItem
        )}

      {/* =====================================================
          WATERMARK / SIGNATURE
          ===================================================== */}
      <div style={{ display: 'none' }}>
 {/* TinyURL-Intranet-2025 © VeverlieAnneMarquez */}
      {/* Version: 1.0.251224 */}
      {/* SHA256 Hash of this exact file content: */}
      {/* <<< GENERATE AFTER FINAL APPROVAL >>> */}      </div>
    </div>
  );
}
    

