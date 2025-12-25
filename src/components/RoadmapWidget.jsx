/* =========================================================
   Block Name: RoadmapWidget
   Purpose:
   - Displays Business Roadmap issues from Jira
   - Calculates progress from subtasks
   - Supports sorting
   - Secure: NO Jira credentials in frontend
   - Uses backend proxy ONLY
========================================================= */

import { useEffect, useState, useMemo } from 'react';

/* =========================================================
   Block Name: Frontend API Config Import
   Purpose:
   - Backend proxy base URL only
   - No secrets, no tokens
========================================================= */
import { API_BASE_URL } from '../config/apiConfig';

export default function RoadmapWidget() {
  /* =============================
     State Management Block
  ============================== */
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* =============================
     Sorting State
  ============================== */
  const [sortConfig, setSortConfig] = useState({
    key: 'summary',
    direction: 'asc'
  });

  /* =========================================================
     Data Fetch Block (SECURE)
     Purpose:
     - Calls backend proxy
     - Backend handles Jira auth & progress logic
  ========================================================= */
  useEffect(() => {
    fetchRoadmapIssues();
  }, []);

  const fetchRoadmapIssues = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/jira/roadmap`);

      if (!response.ok) {
        throw new Error(`Server error (${response.status})`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to load roadmap data');
      }

      setIssues(data.issues || []);
    } catch (err) {
  console.error('RoadmapWidget fetch error:', err);

      setError('⚠️ Jira unavailable — displaying SAMPLE data only.');

      // Fallback data is intentionally fake and for UI continuity only
      setIssues(getSampleData());
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     Sorting Logic Block
  ========================================================= */
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  /* =========================================================
     Sorted Issues Memo
  ========================================================= */
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
     Sample Data (Offline / Error Mode)
  ========================================================= */
  const getSampleData = () => ([
    {
      key: 'BR-101',
      summary: 'Launch Dark Mode Feature',
      status: 'In Progress',
      percentage: 66,
      url: '#'
    },
    {
      key: 'BR-102',
      summary: 'Migrate DB to AWS Aurora',
      status: 'Done',
      percentage: 100,
      url: '#'
    },
    {
      key: 'BR-103',
      summary: 'Redesign Homepage',
      status: 'Todo',
      percentage: 0,
      url: '#'
    }
  ]);

  /* =========================================================
     Progress Bar Renderer
  ========================================================= */
  const renderProgressBar = (percentage) => (
    <div style={{ width: '100%', background: '#475569', borderRadius: '4px' }}>
      <div
        style={{
          width: `${percentage}%`,
          background: percentage === 100 ? '#10b981' : '#2563eb',
          height: '10px',
          borderRadius: '4px'
        }}
      />
    </div>
  );

  /* =========================================================
     Render Block
  ========================================================= */
  return (
    <div style={{
      background: 'var(--widget-bg)',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '28px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
      maxHeight: '400px',
      overflowY: 'auto'
    }}>
      <h2 style={{
        color: '#60a5fa',
        borderBottom: '2px solid #60a5fa',
        paddingBottom: '12px',
        marginBottom: '16px',
        textAlign: 'center'
      }}>
        Business Roadmap
      </h2>

      {loading && <div style={{ textAlign: 'center', color: '#94a3b8' }}>Loading roadmap data…</div>}
      {error && <div style={{ background: '#ef4444', color: 'white', padding: '12px', borderRadius: '8px' }}>{error}</div>}

      {!loading && sortedIssues.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['key', 'summary', 'status', 'percentage'].map(col => (
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
            {sortedIssues.map(item => (
              <tr key={item.key}>
                <td style={{ padding: '12px', color: '#60a5fa' }}>
                  <a href={item.url} target="_blank" rel="noreferrer">{item.key}</a>
                </td>
                <td style={{ padding: '12px' }}>{item.summary}</td>
                <td style={{ padding: '12px' }}>{item.status}</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {renderProgressBar(item.percentage)}
                    <span style={{ width: '40px', textAlign: 'right' }}>
                      {item.percentage}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
