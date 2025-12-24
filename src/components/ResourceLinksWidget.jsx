// *Resource Links Widget Block*

import { useState } from 'react'
import { API_BASE_URL } from '../config/apiConfig' // ✅ backend-safe config

export default function ResourceLinksWidget() {
  // Renamed from activeMode to activePlatform for clarity
  const [activePlatform, setActivePlatform] = useState('drive')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const resultsPerPage = 5

  const handleModeChange = (mode) => {
    setActivePlatform(mode)
    setSearchQuery('')
    setSearchResults([])
    setError('')
    setPage(1)
  }

  const performSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError('')
    setSearchResults([])
    setPage(1)

    if (activePlatform === 'figma' || activePlatform === 'confluence') {
      setError(`Search for ${activePlatform} is not implemented yet. Select Google Drive.`)
      setLoading(false)
      return
    }

    try {
      /**
       * =====================================================
       * IMPORTANT CHANGE (SECURITY + ARCHITECTURE)
       * -----------------------------------------------------
       * OLD: Frontend → Google Apps Script (direct)
       * NEW: Frontend → Backend → Google Apps Script
       * =====================================================
       */
      const response = await fetch(
        `${API_BASE_URL}/api/google?endpoint=resources&query=${encodeURIComponent(searchQuery)}`
      )

      if (!response.ok) {
        throw new Error('Request failed')
      }

      const data = await response.json()

      // Preserve original expected structure
      setSearchResults(data.files || data || [])
    } catch (err) {
      console.error('ResourceLinksWidget search error:', err)
      setError('Network error during search. Check browser console.')
    } finally {
      setLoading(false)
    }
  }

  // Pagination logic (unchanged)
  const currentResults = searchResults
  const start = (page - 1) * resultsPerPage
  const pageResults = currentResults.slice(start, start + resultsPerPage)
  const totalPages = Math.ceil(currentResults.length / resultsPerPage)

  const getPlaceholder = () => {
    if (activePlatform === 'figma') return 'Search Figma files...'
    if (activePlatform === 'confluence') return 'Search Confluence pages...'
    return 'Search Google Drive...'
  }

  return (
    <>
      {/* *Resource Links Widget Block* */}
      <div
        style={{
          background: 'var(--widget-bg)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '19px 17px',
          marginBottom: '28px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
          border: '1px solid rgba(96,165,250,0.1)',
        }}
      >
        {/* *Full Row Header* */}
        <h2
          style={{
            color: '#60a5fa',
            borderBottom: '2px solid #60a5fa',
            paddingBottom: '12px',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: 'var(--header-font)',
          }}
        >
          Resource Links
        </h2>

        {/* *Two-Column Layout* */}
        <div style={{ display: 'flex', gap: '30px' }}>
          {/* *Left Column – Quick Links Box* */}
          <div
            style={{
              flex: '0 0 auto',
              width: '280px',
              minHeight: '350px',
              background: '#1e293b',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #475569',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <strong
                style={{
                  display: 'block',
                  marginBottom: '16px',
                  color: '#e2e8f0',
                  fontSize: '1.5rem',
                }}
              >
                Quick Links
              </strong>

              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  lineHeight: '2.4',
                }}
              >
                <li><a href="#" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '1.1rem' }}>TinyURL</a></li>
                <li><a href="#" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '1.1rem' }}>Figma</a></li>
                <li><a href="#" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '1.1rem' }}>Main App Jira Scrum</a></li>
                <li><a href="#" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '1.1rem' }}>Marketing Jira Scrum</a></li>
                <li><a href="#" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '1.1rem' }}>Confluence</a></li>
              </ul>
            </div>

            <a
              href="#"
              style={{
                color: '#e2e8f0',
                textAlign: 'center',
                marginBottom: '35px',
                fontSize: '1.2rem',
              }}
            >
              View Full Resource Directory →
            </a>
          </div>

          {/* *Right Column – Controls & Results* */}
          <div style={{ flex: 1 }}>
            {/* *Source Buttons* */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button onClick={() => handleModeChange('figma')} style={{
                flex: 1, padding: '14px', border: 'none', borderRadius: '12px',
                background: activePlatform === 'figma' ? '#d8b4fe' : 'var(--widget-bg)',
                color: activePlatform === 'figma' ? '#1e293b' : 'white',
                fontWeight: 'bold', cursor: 'pointer'
              }}>Figma</button>

              <button onClick={() => handleModeChange('confluence')} style={{
                flex: 1, padding: '14px', border: 'none', borderRadius: '12px',
                background: activePlatform === 'confluence' ? '#14b8a6' : 'var(--widget-bg)',
                color: 'white', fontWeight: 'bold', cursor: 'pointer'
              }}>Confluence</button>

              <button onClick={() => handleModeChange('drive')} style={{
                flex: 1, padding: '14px', border: 'none', borderRadius: '12px',
                background: activePlatform === 'drive' ? '#60a5fa' : 'var(--widget-bg)',
                color: 'white', fontWeight: 'bold', cursor: 'pointer'
              }}>Google Drive</button>
            </div>

            {/* *Search Bar* */}
            <input
              type="text"
              placeholder={getPlaceholder()}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && performSearch()}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '12px',
                border: 'none',
                background: '#ffffff',
                color: '#1e293b',
                fontSize: '1rem',
                marginBottom: '20px',
              }}
            />

            {/* *Search Results Area* */}
            <div style={{ background: '#334155', borderRadius: '12px', padding: '20px', minHeight: '280px', maxHeight: '350px', overflowY: 'auto' }}>
              {loading && <div style={{ color: '#94a3b8', textAlign: 'center' }}>Searching...</div>}
              {error && <div style={{ color: '#ef4444', marginBottom: '12px' }}>{error}</div>}
              {!loading && pageResults.length === 0 && <div style={{ color: '#94a3b8' }}>Type and press Enter to search...</div>}
              {pageResults.map((result, i) => (
                <div key={result.id || i} style={{ padding: '10px 0', borderBottom: i < pageResults.length - 1 ? '1px solid #475569' : 'none' }}>
                  <a href={result.url} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'none' }}>
                    {result.name}
                  </a>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem', marginLeft: '10px' }}>
                    ({result.type})
                  </span>
                </div>
              ))}
            </div>

            {/* *Pagination* */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ background: '#475569', color: 'white', padding: '8px 14px', border: 'none', borderRadius: '6px' }}>
                  Previous
                </button>
                <span style={{ alignSelf: 'center', color: '#e2e8f0' }}>
                  Page {page} of {totalPages}
                </span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  style={{ background: '#475569', color: 'white', padding: '8px 14px', border: 'none', borderRadius: '6px' }}>
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// =====================================================
//      DIGITAL SIGNATURE AND OWNERSHIP
// =====================================================
// TinyURL-Intranet-2025 © VeverlieAnneMarquez
// Version: 1.0.251224
// SHA256 Hash of this exact file content:
// <<< GENERATE AFTER FINAL APPROVAL >>>
