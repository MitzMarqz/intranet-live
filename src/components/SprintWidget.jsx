/**
 * =========================================================
 * Block Name: SprintWidget
 * Purpose:
 * - Displays Sprint / Board issues from Jira
 * - Supports sorting, pagination, and filtering
 * - Secure: NO Jira credentials in frontend
 * - Uses backend proxy ONLY
 * =========================================================
 */

import { useEffect, useState, useMemo } from 'react';
import { API_BASE_URL } from '../config/apiConfig';

export default function SprintWidget({
  title = 'Sprint Board',
  boardId,
  type = 'scrum'
}) {
  /* =============================
     State Management
  ============================== */
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  const resultsPerPage = 5;

  /* =============================
     Sorting State
  ============================== */
  const [sortConfig, setSortConfig] = useState({
    key: 'key',
    direction: 'asc'
  });

  /* =========================================================
     Data Fetch (SECURE)
  ========================================================= */
  useEffect(() => {
    fetchSprintIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, type]);

  const fetchSprintIssues = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/jira/issues?boardId=${boardId}&type=${type}`
      );

      if (!response.ok) {
        throw new Error(`Server error (${response.status})`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to load sprint data');
      }

      setIssues(data.issues || []);
      setPage(1);
    } catch (err) {
      console.error('SprintWidget fetch error:', err);

      setError('⚠️ Jira unavailable — displaying SAMPLE sprint data only.');

      // Fallback data is intentionally fake and for UI continuity only
      setIssues(getSampleData(type));
      setPage(1);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     Sorting Logic
  ========================================================= */
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedIssues = useMemo(() => {
    let sorted = [...issues];

    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const A = a[sortConfig.key];
        const B = b[sortConfig.key];

        if (typeof A === 'number' && typeof B === 'number') {
          return sortConfig.direction === 'asc' ? A - B : B - A;
        }

        return sortConfig.direction === 'asc'
          ? String(A).localeCompare(String(B))
          : String(B).localeCompare(String(A));
      });
    }

    return sorted;
  }, [issues, sortConfig]);

  /* =========================================================
     Pagination
  ========================================================= */
  const start = (page - 1) * resultsPerPage;
  const pageResults = sortedIssues.slice(start, start + resultsPerPage);
  const totalPages = Math.ceil(sortedIssues.length / resultsPerPage);

  /* =========================================================
     Sample Data (OFFLINE / ERROR MODE)
  ========================================================= */
  function getSampleData(boardType) {
    return [
      {
        key: 'SP-101',
        summary: `Sample ${boardType} issue A`,
        status: 'In Progress',
        assignee: 'Jane Doe'
      },
      {
        key: 'SP-102',
        summary: `Sample ${boardType} issue B`,
        status: 'To Do',
        assignee: 'John Smith'
      },
      {
        key: 'SP-103',
        summary: `Sample ${boardType} issue C`,
        status: 'Done',
        assignee: 'Alex Lee'
      }
    ];
  }

  /* =========================================================
     Render
  ========================================================= */
  return (
    <div
      style={{
        background: 'var(--widget-bg)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '28px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.7)'
      }}
    >
      <h2
        style={{
          color: '#60a5fa',
          borderBottom: '2px solid #60a5fa',
          paddingBottom: '12px',
          marginBottom: '16px',
          textAlign: 'center'
        }}
      >
        {title}
      </h2>

      {loading && (
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
          Loading sprint data…
        </div>
      )}

      {error && (
        <div
          style={{
            background: '#ef4444',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '12px'
          }}
        >
          {error}
        </div>
      )}

      {!loading && pageResults.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['key', 'summary', 'status', 'assignee'].map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  style={{
                    cursor: 'pointer',
                    padding: '12px',
                    background: 'var(--tinyurl-blue)',
                    color: 'white'
                  }}
                >
                  {col.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageResults.map((item) => (
              <tr key={item.key}>
                <td style={{ padding: '12px', color: '#60a5fa' }}>
                  {item.key}
                </td>
                <td style={{ padding: '12px' }}>{item.summary}</td>
                <td style={{ padding: '12px' }}>{item.status}</td>
                <td style={{ padding: '12px' }}>{item.assignee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))}>
            Prev
          </button>

          <span style={{ margin: '0 12px' }}>
            Page {page} of {totalPages}
          </span>

          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
            Next
          </button>
        </div>
      )}

      {/* =====================================================
          DIGITAL SIGNATURE AND OWNERSHIP
      ====================================================== */}
      <div style={{ display: 'none' }}>
        {/* TinyURL-Intranet-2025 © VeverlieAnneMarquez */}
        {/* Version: 1.0.251224 */}
        {/* SHA256 Hash of this exact file content: */}
        {/* <<< GENERATE AFTER FINAL APPROVAL >>> */}
      </div>
    </div>
  );
}
