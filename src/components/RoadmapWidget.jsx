import { useEffect, useMemo, useState } from 'react'

/* ===================================
 * PLACEHOLDERS — VISUAL ONLY
 * =================================== */
const TABLE_FONT_SIZE = '0.9rem'
const HEADER_FONT_SIZE = '1.2rem'

/* COLORS — MATCH SPRINT / TEAMS */
const WIDGET_BG = 'var(--widget-bg)'
const WIDGET_HEADER_COLOR = '#e5e7eb'
const DIVIDER_COLOR = 'rgba(255,255,255,0.18)'
const ROW_DIVIDER = 'rgba(255,255,255,0.08)'
const TABLE_HEADER_BG = 'rgba(6, 172, 249, 0.85)'
const TABLE_HEADER_TEXT = '#e5e7eb'
const KEY_TEXT_COLOR = '#60a5fa'

/* LAYOUT */
const TABLE_BODY_HEIGHT = 360
const SUMMARY_MAX_WIDTH = 240
const PROGRESS_HEIGHT = 6
const marginTop = 28        // 👈 spacing from Teams widget
const marginBottom = 8

/* ===================================
 * HELPERS (UNCHANGED)
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

function calculateProgressFromChildren(children = []) {
  if (!children.length) return 0
  const valid = children.filter(c => c.statusCategory !== 'Cancelled')
  if (!valid.length) return 0
  const done = valid.filter(c => c.statusCategory === 'Done').length
  return Math.round((done / valid.length) * 100)
}

/* ===================================
 * RoadmapWidget
 * =================================== */
export default function RoadmapWidget() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState({ key: 'key', dir: 'asc' })

  const PER_PAGE = 5

  /* ===============================
   * Fetch (UNCHANGED)
   * =============================== */
  useEffect(() => {
    let alive = true

    async function load() {
      try {
        setLoading(true)
        const res = await fetch('/api/jira/roadmap')
        const data = await res.json()
        if (!alive) return

        if (!data?.success) throw new Error()
        setIssues(data.issues || [])
        setError('')
      } catch {
        setError('Failed to load roadmap data.')
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => (alive = false)
  }, [])

  /* ===============================
   * Search + Sort (UNCHANGED)
   * =============================== */
  const filtered = useMemo(() => {
    return issues.filter(i =>
      i.key.toLowerCase().includes(search.toLowerCase()) ||
      i.summary.toLowerCase().includes(search.toLowerCase())
    )
  }, [issues, search])

  const sorted = useMemo(() => {
    const arr = [...filtered]
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
  }, [filtered, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE))
  const pageItems = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function toggleSort(key) {
    setPage(1)
    setSort(s =>
      s.key === key
        ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' }
    )
  }

  /* ===============================
   * Render
   * =============================== */
  return (
    <div
      style={{
        background: WIDGET_BG,
        borderRadius: 16,
        padding: 22,
        marginTop,
        marginBottom: '28px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div
        style={{
          fontSize: HEADER_FONT_SIZE,
          marginBottom: 12,
          fontWeight: 600,
          color: WIDGET_HEADER_COLOR
        }}
      >
        Business Roadmap
      </div>

      <div
        style={{
          height: 2,
          background: DIVIDER_COLOR,
          marginBottom: 14
        }}
      />

      <input
        placeholder="Search epics…"
        value={search}
        onChange={e => {
          setPage(1)
          setSearch(e.target.value)
        }}
        style={{
          marginBottom: 14,
          padding: 8,
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'transparent',
          color: '#fff'
        }}
      />

      {loading && <div>Loading…</div>}
      {error && <div style={{ color: '#f87171' }}>{error}</div>}

      {!loading && !error && (
        <>
          {/* Scrollable table */}
          <div style={{ overflowY: 'auto', maxHeight: TABLE_BODY_HEIGHT }}>
            <table style={{ width: '100%', fontSize: TABLE_FONT_SIZE }}>
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
                  <th style={{ padding: '14px 10px' }}>Assignee</th>
                  <th style={{ padding: '14px 10px' }} onClick={() => toggleSort('updated')}>Updated</th>
                  <th style={{ padding: '14px 10px' }}>Progress</th>
                </tr>
              </thead>

              <tbody>
                {pageItems.map(i => {
                  const backendPercent = i.progress?.percentage
                  const backendColor = i.progress?.color

                  const percent = typeof backendPercent === 'number'
                    ? backendPercent
                    : calculateProgressFromChildren(i.children)

                  let barColor = percent === 100 ? '#22c55e' : '#3b82f6'
                  if (backendColor === 'green') barColor = '#22c55e'
                  if (backendColor === 'yellow') barColor = '#eab308'

                  return (
                    <tr key={i.key} style={{ borderBottom: `1px solid ${ROW_DIVIDER}` }}>
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

                      <td
                        style={{
                          maxWidth: SUMMARY_MAX_WIDTH,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          padding: '12px 10px'
                        }}
                        title={i.summary}
                      >
                        {i.summary}
                      </td>

                      <td style={{ padding: '12px 10px' }}>
                        {i.assignee || 'Unassigned'}
                      </td>

                      <td style={{ padding: '12px 10px' }}>
                        {timeAgo(i.updated)}
                      </td>

                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ fontSize: '0.7rem', marginBottom: 4 }}>
                          {percent}%
                        </div>
                        <div
                          style={{
                            height: PROGRESS_HEIGHT,
                            background: 'rgba(255,255,255,0.15)',
                            borderRadius: 6
                          }}
                        >
                          <div
                            style={{
                              width: `${percent}%`,
                              height: '100%',
                              borderRadius: 6,
                              background: barColor
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Fixed pagination */}
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
