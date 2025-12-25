/* =========================================================
   Block Name: OutOfOfficeWidget
   Purpose:
   - Displays approved and pending leaves
   - Allows managers/admins to approve or decline
   - Secure: NO Google Apps Script URL in frontend
   - Uses backend proxy for all requests
========================================================= */

import { useEffect, useState } from 'react';

/* =========================================================
   Block Name: Frontend API Config Import
   Purpose:
   - Backend proxy base URL ONLY
========================================================= */

import { API_BASE_URL } from "../config/apiConfig";


export default function OutOfOfficeWidget() {
  /* =============================
     State Management Block
  ============================== */
  const [mode, setMode] = useState('approved');
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('viewer');
  const [actionLoading, setActionLoading] = useState({});

  /* =========================================================
     Initial Load Block
     Purpose:
     - Reads user role
     - Fetches leave data via backend
  ========================================================= */
  useEffect(() => {
    const currentUser =
      JSON.parse(localStorage.getItem('currentUser')) || { role: 'admin' };
fetchAllLeaves
    setUserRole(currentUser.role);
    fetchAllLeaves();
  }, []);

  /* =========================================================
     Fetch Leave Data Block
  ========================================================= */

const fetchAllLeaves = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await fetch(
      `${API_BASE_URL}/api/google?endpoint=leaves`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch leaves');
    }

    const data = await response.json();

    // ✅ THIS IS THE IMPORTANT PART
    setApprovedLeaves(data.approved || []);
    setPendingLeaves(data.pending || []);
  } catch (err) {
    console.error('OutOfOfficeWidget error:', err);
    setError('Failed to load leave data.');
  } finally {
    setLoading(false);
  }
};




  /* =========================================================
     Update Leave Status Block
  ========================================================= */
  const updateLeaveStatus = async (rowId, newStatus) => {
    setActionLoading(prev => ({ ...prev, [rowId]: true }));

    try {
      const response = await fetch(`${API_BASE_URL}/api/google/leaves/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rowId, newStatus })
      });

      const data = await response.json();
      if (!data.success) throw new Error();

      fetchAllLeaves();
      alert(`✅ Status updated to ${newStatus}`);
    } catch {
      alert('❌ Failed to update leave status.');
    } finally {
      setActionLoading(prev => ({ ...prev, [rowId]: false }));
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

  /* =========================================================
     Render Leave Item Block
  ========================================================= */
  const renderLeaveItem = (leave) => (
    <div
      key={leave.rowId}
      style={{
        background: 'rgba(30, 41, 59, 0.5)',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '10px',
        borderLeft: `3px solid ${
          mode === 'approved' ? '#2563eb' : '#fbbf24'
        }`
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 'bold', color: '#e2e8f0' }}>
            {leave.name}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            {leave.leaveType} • {formatDate(leave.startDate)} –{' '}
            {formatDate(leave.endDate)} ({leave.days} days)
          </div>
        </div>

        {mode === 'pending' &&
          (userRole === 'admin' || userRole === 'manager') && (
            <select
              disabled={actionLoading[leave.rowId]}
              onChange={(e) =>
                updateLeaveStatus(leave.rowId, e.target.value)
              }
              value={leave.currentStatus}
              style={{
                background: '#334155',
                color: 'white',
                borderRadius: '4px'
              }}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approve</option>
              <option value="HO Pending">HO Pending</option>
              <option value="Declined">Decline</option>
            </select>
          )}
      </div>
    </div>
  );

  /* =========================================================
     Render Block
  ========================================================= */
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

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button onClick={() => setMode('approved')}>Approved</button>
        <button onClick={() => setMode('pending')}>Pending</button>
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {loading && <p style={{ textAlign: 'center' }}>Loading…</p>}

      {!loading &&
        (mode === 'approved' ? approvedLeaves : pendingLeaves).map(
          renderLeaveItem
        )}

      {/* =====================================================
         DIGITAL SIGNATURE AND OWNERSHIP
      ====================================================== */}
      {/* TinyURL-Intranet-2025 © VeverlieAnneMarquez */}
      {/* Version: 1.0.251224 */}
      {/* SHA256 Hash of this exact file content: */}
      {/* <<< GENERATE AFTER FINAL APPROVAL >>> */}
    </div>
  );
}
