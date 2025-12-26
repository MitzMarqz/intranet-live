import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SprintWidget({ title, type = "main" }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const itemsPerPage = 5;

  // Fetch issues from backend
  const fetchIssues = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`/api/jira/issues/${type}`);
      const formatted = response.data.map(issue => ({
        ...issue,
        updated: formatUpdated(issue.updated)
      }));
      setIssues(formatted);
    } catch (err) {
      console.error(err);
      setError('Failed to load Jira issues. Showing sample data.');
      setIssues(getSampleData(type));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [type]);

  const formatUpdated = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMins = Math.floor((now - date) / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const sortedIssues = [...issues].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const A = a[sortConfig.key] || '';
    const B = b[sortConfig.key] || '';
    return sortConfig.direction === 'asc' ? A.localeCompare(B) : B.localeCompare(A);
  });

  const pageItems = sortedIssues.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(sortedIssues.length / itemsPerPage);

  const getSampleData = (type) => ({
    main: [
      { key: 'KBOARD-1234', summary: 'Fix login redirect loop', assigned: 'Ana', status: 'In Progress', updated: '2h ago' },
      { key: 'KBOARD-1220', summary: 'Update pricing table', assigned: 'Carlos', status: 'Code Review', updated: '5h ago' }
    ],
    marketing: [
      { key: 'MKT-567', summary: 'Q4 Campaign landing page', assigned: 'Maria', status: 'In Progress', updated: '3h ago' }
    ],
    abuse: [
      { key: 'ABUSE-445', summary: 'Rate limiting false positives', assigned: 'Pedro', status: 'In Progress', updated: '30m ago' }
    ],
    design: [
      { key: 'DESIGN-892', summary: 'New dashboard mockups', assigned: 'Sofia', status: 'In Review', updated: '1h ago' }
    ],
    teams: [
      { key: 'TEAM-201', summary: 'Onboarding new engineer', assigned: 'HR', status: 'In Progress', updated: '1d ago' }
    ]
  }[type] || []);

  return (
    <div style={{ padding: 20, background: '#1e293b', borderRadius: 16, color: '#fff' }}>
      <h2 style={{ color: '#60a5fa', marginBottom: 16 }}>{title}</h2>
      {loading && <p>Loading Jira data...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {issues.length > 0 && (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['key', 'summary', 'assigned', 'status', 'updated'].map(k => (
                  <th key={k} onClick={() => handleSort(k)} style={{ cursor: 'pointer', padding: 8 }}>
                    {k.toUpperCase()} {sortConfig.key === k ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageItems.map(issue => (
                <tr key={issue.key}>
                  <td>{issue.key}</td>
                  <td>{issue.summary}</td>
                  <td>{issue.assigned}</td>
                  <td>{issue.status}</td>
                  <td>{issue.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div style={{ marginTop: 16 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
              <span> Page {page} of {totalPages} </span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
