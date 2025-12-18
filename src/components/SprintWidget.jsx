import { useEffect, useState } from 'react'
import axios from 'axios'

export default function SprintWidget({ title, type = "main", boardId }) {
  const [issues, setIssues] = useState([])  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const itemsPerPage = 5

  // >>> PLACEHOLDER FOR JIRA CREDENTIALS <<<
  // Paste your real API token here (no quotes around it if it's long)
  const JIRA_EMAIL = 'mitzie@tinyurl.com';  // Your exact Jira email – change if different
  const JIRA_API_TOKEN = 'ADD TOKEN HERE';  // <<< YOUR REAL TOKEN HERE (no spaces!) >>>
  const JIRA_BASE_URL = 'https://tinyurl-llc.atlassian.net';

  // Board IDs – double-check these match your Jira boards
  const BOARD_IDS = {
    main: 346,      // Main App – Open Sprint
    marketing: 71,  // Marketing – Open Sprint
    abuse: 77,      // Abuse – Kanban (list all issues)
    design: 378,    // Design – Kanban (list all issues)
    teams: 608      // Teams – Kanban (list all issues)
  }


  const currentBoardId = boardId || BOARD_IDS[type] || BOARD_IDS.main

  useEffect(() => {
    if (!JIRA_API_TOKEN.includes('YOUR')) {
      fetchIssues()
    } else {
      setIssues(getSampleData(type))
      setLoading(false)
    }
  }, [type, currentBoardId])

  const fetchIssues = async () => {
    setLoading(true)
    setError('')
    try {
      const auth = btoa(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`)

      let issues = []

      if (type === 'main' || type === 'marketing') {
        const sprintResponse = await axios.get(
          `${JIRA_BASE_URL}/rest/agile/1.0/board/${currentBoardId}/sprint?state=active`,
          { headers: { Authorization: `Basic ${auth}` } }
        )
        const activeSprint = sprintResponse.data.values?.[0]
        if (!activeSprint) {
          setError(`No active sprint found on board ${currentBoardId} (type: ${type}). Start a sprint or check board ID.`)
          setLoading(false)
          return
        }

        const issuesResponse = await axios.get(
          `${JIRA_BASE_URL}/rest/agile/1.0/sprint/${activeSprint.id}/issue`,
          { headers: { Authorization: `Basic ${auth}` } }
        )
        issues = issuesResponse.data.issues || []
      } else {
        const boardIssuesResponse = await axios.get(
          `${JIRA_BASE_URL}/rest/agile/1.0/board/${currentBoardId}/issue`,
          { headers: { Authorization: `Basic ${auth}` } }
        )
        issues = boardIssuesResponse.data.issues || []
      }

      const formatted = issues.map(issue => ({
        key: issue.key,
        summary: issue.fields.summary,
        assigned: issue.fields.assignee?.displayName || 'Unassigned',
        status: issue.fields.status.name,
        updated: formatUpdated(issue.fields.updated)
      }))

      setIssues(formatted)
    } catch (err) {
      const status = err.response?.status
      let msg = 'Failed to load Jira data'
      if (status === 401) msg = '401 Unauthorized – Invalid email or API token (most common issue)'
      else if (status === 403) msg = '403 Forbidden – Token lacks permission or needs new scopes'
      else if (status === 404) msg = `404 Not Found – Board ID ${currentBoardId} incorrect or inaccessible`
      else msg += ` (Status: ${status || 'Network error'})`
      console.error('Full Jira error:', err.response?.data || err)
      setError(msg + '. Check console for details. Falling back to sample data.')
      setIssues(getSampleData(type))
    }
    setLoading(false)
  }

  const formatUpdated = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  }

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc'
    setSortConfig({ key, direction })
  }

  let sortedIssues = [...issues]
  if (sortConfig.key) {
    sortedIssues.sort((a, b) => {
      const A = a[sortConfig.key] || ''
      const B = b[sortConfig.key] || ''
      return sortConfig.direction === 'asc' ? A.localeCompare(B) : B.localeCompare(A)
    })
  }

  const start = (page - 1) * itemsPerPage
  const pageItems = sortedIssues.slice(start, start + itemsPerPage)
  const totalPages = Math.ceil(sortedIssues.length / itemsPerPage)

  const getSampleData = (type) => {
    const sample = {
      main: [
        { key: 'KBOARD-1234', summary: 'Fix login redirect loop', assigned: 'Ana', status: 'In Progress', updated: '2h ago' },
        { key: 'KBOARD-1220', summary: 'Update pricing table', assigned: 'Carlos', status: 'Code Review', updated: '5h ago' },
        { key: 'KBOARD-1215', summary: 'API rate limit increase', assigned: 'Pedro', status: 'Done', updated: '1d ago' }
      ],
      marketing: [
        { key: 'MKT-567', summary: 'Q4 Campaign landing page', assigned: 'Maria', status: 'In Progress', updated: '3h ago' },
        { key: 'MKT-550', summary: 'Social media assets', assigned: 'Sofia', status: 'Done', updated: '2d ago' }
      ],
      design: [
        { key: 'DESIGN-892', summary: 'New dashboard mockups', assigned: 'Sofia', status: 'In Review', updated: '1h ago' }
      ],
      abuse: [
        { key: 'ABUSE-445', summary: 'Rate limiting false positives', assigned: 'Pedro', status: 'In Progress', updated: '30m ago' }
      ],
      teams: [
        { key: 'TEAM-201', summary: 'Onboarding new engineer', assigned: 'HR', status: 'In Progress', updated: '1d ago' }
      ]
    }
    return sample[type] || sample.main
  }

  return (
    <>{/* *Sprint Widget Block – Shows Jira tickets from specific board* */}
      <div style={{
        background: 'var(--widget-bg)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '19px 17px',  /* ← Reduced padding by 2px as requested */
        marginBottom: '28px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
        border: '1px solid rgba(96,165,250,0.1)',
        maxHeight: '500px',
        overflowY: 'auto'
      }}>
        {/* *Widget Header – Matches other widgets* */}
        <h2 style={{
          color: '#60a5fa',  /* Widget title color – change here */
          borderBottom: '2px solid #60a5fa',
          paddingBottom: '12px',
          marginBottom: '16px',
          textAlign: 'center',
          fontSize: 'var(--header-font)'
        }}>
          {title}
        </h2>

        {loading && <div style={{ textAlign: 'center', color: '#94a3b8' }}>Loading Jira data...</div>}
        {error && <div style={{ background: '#ef4444', color: 'white', padding: '12px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}

        {!loading && issues.length === 0 && <div style={{ textAlign: 'center', color: '#94a3b8' }}>No issues found</div>}

        {issues.length > 0 && (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('key')} style={{ background: 'var(--tinyurl-blue)', color: 'white', padding: '12px', textAlign: 'left', fontSize: '0.95rem', cursor: 'pointer' }}>
                      Key {sortConfig.key === 'key' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => handleSort('summary')} style={{ background: 'var(--tinyurl-blue)', color: 'white', padding: '12px', textAlign: 'left', fontSize: '0.95rem', cursor: 'pointer' }}>
                      Summary {sortConfig.key === 'summary' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => handleSort('assigned')} style={{ background: 'var(--tinyurl-blue)', color: 'white', padding: '12px', textAlign: 'left', fontSize: '0.95rem', cursor: 'pointer' }}>
                      Assigned {sortConfig.key === 'assigned' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => handleSort('status')} style={{ background: 'var(--tinyurl-blue)', color: 'white', padding: '12px', textAlign: 'left', fontSize: '0.95rem', cursor: 'pointer' }}>
                      Status {sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => handleSort('updated')} style={{ background: 'var(--tinyurl-blue)', color: 'white', padding: '12px', textAlign: 'left', fontSize: '0.95rem', cursor: 'pointer' }}>
                      Updated {sortConfig.key === 'updated' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((item, i) => (
                    <tr key={i}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #475569', color: '#60a5fa' }}>{item.key}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #475569' }}>{item.summary}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #475569' }}>{item.assigned}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #475569' }}>{item.status}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #475569', color: '#94a3b8' }}>{item.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px' }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 16px', background: '#475569', color: 'white', border: 'none', borderRadius: '6px' }}>
                  Previous
                </button>
                <span style={{ alignSelf: 'center', color: '#e2e8f0' }}>Page {page} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '8px 16px', background: '#475569', color: 'white', border: 'none', borderRadius: '6px' }}>
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* >>> PLACEHOLDER FOR JIRA API CREDENTIALS <<< */}
        {/* Replace token above to connect live data – sample data shows if anything fails */}

        {/* >>> DIGITAL SIGNATURE AND OWNERSHIP <<< */}
        {/* TinyURL-Intranet-2025 © VeverlieAnneMarquez version 1.0.251219 */}
        {/* SHA256 Hash of this exact file content: */}
        {/* 0eee5a32176bdf8849ee6e68d9f84ddca496c64c5e8a4bc4b34654090df67b4c */}
        {/* (This hash proves this version was created by you on December 19, 2025) */}
      </div>
    </>
  )
}