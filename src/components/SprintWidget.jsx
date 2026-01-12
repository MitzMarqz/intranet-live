import { useEffect, useMemo, useState } from 'react'

/* ===================================
 * PLACEHOLDERS — SAFE TO ADJUST LATER
 * =================================== */
const SUMMARY_MAX_WIDTH = 420
const TABLE_FONT_SIZE = '0.9rem'
const HEADER_FONT_SIZE = '1.2rem'

/* COLORS */
const WIDGET_BG = 'var(--widget-bg)'
const WIDGET_HEADER_COLOR = '#e5e7eb'        // 👈 widget title font color
const DIVIDER_COLOR = 'rgba(255,255,255,0.18)'
const ROW_DIVIDER = 'rgba(255,255,255,0.08)'
const TABLE_HEADER_BG = 'rgba(6, 172, 249, 0.85)' // 👈 table header background
const TABLE_HEADER_TEXT = '#e5e7eb'
const KEY_TEXT_COLOR = '#60a5fa'             // 👈 Jira key color

/* LAYOUT */
const TABLE_BODY_HEIGHT = 360                // 👈 scrollable area height
const marginBottom = 8
const marginTop = 0

/* ===================================
 * Helpers
 * =================================== */
function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const min = Math.floor(diffMs / 60000)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day < 30) return `${day}d ago`
  const mo = Math.floor(day / 30)
  return `${mo}mo ago`
}

function sortByKeyNumeric(a, b, dir) {
  const na = parseInt(a.key.split('-')[1], 10)
  const nb = parseInt(b.key.split('-')[1], 10)
  return dir === 'asc' ? na - nb : nb - na
}

/* ===================================
 * SprintWidget
 * =================================== */
export default function SprintWidget({
  title,
  endpoint,
  fullWidth = true
}) {
  const [issues, setIssues] = useState([])
  const [expandedKey, setExpandedKey] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState({ key: 'updated', dir: 'desc' })

  const PER_PAGE = 6

  /* ===============================
   * Fetch
   * =============================== */
  useEffect(() => {
    let alive = true

    async function load() {
      try {
        setLoading(true)
        const res = await fetch(endpoint)
        const data = await res.json()
        if (!alive) return

        if (!data?.success) throw new Error('Failed to load sprint data')
        setIssues(data.issues || [])
        setError('')
      } catch {
        setError('Failed to load Jira data.')
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => (alive = false)
  }, [endpoint])

  /* ===============================
   * Sorting
   * =============================== */
  const sortedIssues = useMemo(() => {
    const arr = [...issues]
    if (sort.key === 'key') {
      return arr.sort((a, b) => sortByKeyNumeric(a, b, sort.dir))
    }
    return arr.sort((a, b) => {
      const A = a[sort.key] || ''
      const B = b[sort.key] || ''
      return sort.dir === 'asc'
        ? String(A).localeCompare(String(B))
        : String(B).localeCompare(String(A))
    })
  }, [issues, sort])

  const totalPages = Math.max(1, Math.ceil(sortedIssues.length / PER_PAGE))
  const pageItems = sortedIssues.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  )

  function toggleSort(key) {
    setPage(1)
    setSort(s =>
      s.key === key
        ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' }
    )
  }

  function toggleSummary(key) {
    setExpandedKey(k => (k === key ? null : key))
  }

  /* ===============================
   * Render
   * =============================== */
  return (
    <div
      style={{
        width: '100%',
        gridColumn: fullWidth ? '1 / -1' : 'span 1',
        background: WIDGET_BG,
        borderRadius: 16,
        padding: 22,
        marginBottom,
        marginTop,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Widget Header */}
      <div
        style={{
          fontSize: HEADER_FONT_SIZE,
          marginBottom: 12,
          fontWeight: 600,
          color: WIDGET_HEADER_COLOR
        }}
      >
        {title}
      </div>

      <div
        style={{
          height: 2,
          background: DIVIDER_COLOR,
          marginBottom: 14
        }}
      />

      {loading && <div>Loading…</div>}

      {error && (
        <div
          style={{
            background: '#ef4444',
            color: 'white',
            padding: 12,
            borderRadius: 10,
            marginBottom: 12,
            textAlign: 'center'
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Scrollable Table Area */}
          <div
            style={{
              overflowY: 'auto',
              maxHeight: TABLE_BODY_HEIGHT
            }}
          >
            <table
              style={{
                width: '100%',
                fontSize: TABLE_FONT_SIZE,
                borderCollapse: 'collapse'
              }}
            >
              <thead
                style={{
                  position: 'sticky',
                  top: 0,
                  background: TABLE_HEADER_BG,
                  color: TABLE_HEADER_TEXT,
                  zIndex: 1
                }}
              >
                <tr>
                  <th style={{ padding: '14px 10px' }} onClick={() => toggleSort('key')}>Key</th>
                  <th style={{ padding: '14px 10px' }}>Summary</th>
                  <th style={{ padding: '14px 10px' }} onClick={() => toggleSort('assignee')}>Assigned</th>
                  <th style={{ padding: '14px 10px' }} onClick={() => toggleSort('status')}>Status</th>
                  <th style={{ padding: '14px 10px' }} onClick={() => toggleSort('updated')}>Updated</th>
                </tr>
              </thead>

              <tbody>
                {pageItems.map(i => {
                  const expanded = expandedKey === i.key

                  return (
                    <tr
                      key={i.key}
                      style={{
                        borderBottom: `1px solid ${ROW_DIVIDER}`,
                        height: expanded ? 'auto' : 64
                      }}
                    >
                      {/* Key */}
                      <td style={{ padding: '12px 10px', color: KEY_TEXT_COLOR }}>
                        <a
                          href={i.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: KEY_TEXT_COLOR }}
                        >
                          {i.key}
                        </a>
                      </td>

                      {/* Summary */}
                      <td
                        style={{
                          maxWidth: SUMMARY_MAX_WIDTH,
                          padding: '12px 10px',
                          verticalAlign: 'top',
                          cursor: 'pointer'
                        }}
                        title={i.summary}
                        onClick={() => toggleSummary(i.key)}
                      >
                        <div
                          style={{
                            whiteSpace: 'normal',
                            display: expanded ? 'block' : '-webkit-box',
                            WebkitLineClamp: expanded ? 'unset' : 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: '1.45em'
                          }}
                        >
                          {i.summary}
                        </div>
                      </td>

                      <td style={{ padding: '12px 10px' }}>
                        {i.assignee || '—'}
                      </td>

                      <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                        {i.status}
                      </td>

                      <td style={{ padding: '12px 10px', opacity: 0.7 }}>
                        {timeAgo(i.updated)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Fixed Pagination */}
          <div
            style={{
              marginTop: 14,
              paddingTop: 10,
              borderTop: `1px solid ${ROW_DIVIDER}`,
              textAlign: 'center'
            }}
          >
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </button>

            <span style={{ margin: '0 12px' }}>
              Page {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}
