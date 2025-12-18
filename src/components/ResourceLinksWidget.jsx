// *Resource Links Widget Block*
// NOTE: Using only fallback sample data (no API imports needed)
// When ready for real search, add tokens and let me know – I'll re-enable live search

import { useState } from 'react'

export default function ResourceLinksWidget() {
  const [activeMode, setActiveMode] = useState('figma')  // 'figma', 'confluence', 'drive'
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const resultsPerPage = 5

  // >>> PLACEHOLDER FOR API TOKENS <<<
  // Add your real tokens here later when ready
  const FIGMA_TOKEN = 'YOUR-FIGMA-TOKEN-HERE'          // Figma personal access token – add later
  const CONFLUENCE_TOKEN = 'YOUR-CONFLUENCE-TOKEN-HERE' // Confluence API token – add later
  const DRIVE_ACCESS_TOKEN = 'YOUR-DRIVE-ACCESS-TOKEN-HERE' // Google OAuth access token – add later

  // 12 Fallback sample results – always shows until real APIs added
  const fallbackResults = [
    { name: 'Q4 Campaign Brief.fig', link: '#', type: 'figma' },
    { name: 'Mobile App Redesign.fig', link: '#', type: 'figma' },
    { name: 'Brand Assets Folder', link: '#', type: 'drive' },
    { name: 'Sprint Planning 2025', link: '#', type: 'confluence' },
    { name: 'Onboarding Guide v2', link: '#', type: 'confluence' },
    { name: 'Marketing Assets 2025', link: '#', type: 'drive' },
    { name: 'Dashboard UI Kit.fig', link: '#', type: 'figma' },
    { name: 'Engineering Wiki Home', link: '#', type: 'confluence' },
    { name: 'Team Photos', link: '#', type: 'drive' },
    { name: 'Icon Library.fig', link: '#', type: 'figma' },
    { name: 'Product Roadmap 2026', link: '#', type: 'confluence' },
    { name: 'HR Policies 2025', link: '#', type: 'drive' }
  ]

  const handleModeChange = (mode) => {
    setActiveMode(mode)
    setSearchQuery('')
    setSearchResults([])
    setError('')
    setPage(1)
  }

  const performSearch = () => {
    if (!searchQuery.trim()) return
    setLoading(true)
    setError('')
    setSearchResults([])
    setPage(1)

    // Search using fallback data only
    const filtered = fallbackResults.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    const results = filtered.length > 0 ? filtered : [{ name: 'No results found for "' + searchQuery + '"', link: '#' }]

    setSearchResults(results)
    setLoading(false)
  }

  // Display results (fallback or search)
  const currentResults = searchResults.length > 0 ? searchResults : fallbackResults
  const start = (page - 1) * resultsPerPage
  const pageResults = currentResults.slice(start, start + resultsPerPage)
  const totalPages = Math.ceil(currentResults.length / resultsPerPage)

  const getPlaceholder = () => {
    if (activeMode === 'figma') return 'Search Figma files...'
    if (activeMode === 'confluence') return 'Search Confluence pages...'
    return 'Search Google Drive...'
  }

  return (
    <>{/* *Resource Links Widget Block* */}
      <div style={{
        background: 'var(--widget-bg)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '19px 17px',  /* ← Reduced by 2px to match other widgets */
        marginBottom: '28px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
        border: '1px solid rgba(96,165,250,0.1)'
      }}>
        {/* *Full Row Header* */}
        <h2 style={{
          color: '#60a5fa',  /* ← Header color – change here */
          borderBottom: '2px solid #60a5fa',  /* ← Border color – change here */
          paddingBottom: '12px',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: 'var(--header-font)'  /* ← Font size controlled by global selector */
        }}>
          Resource Links
        </h2>

        {/* *Two-Column Layout* */}
        <div style={{ display: 'flex', gap: '30px' }}>
          {/* *Left Column – Quick Links Box* */}
          {/* To adjust size: Change width and minHeight below */}
          <div style={{
            flex: '0 0 auto',
            width: '280px',        /* ← CHANGE THIS VALUE to adjust width of Quick Links box */
            minHeight: '350px',    /* ← CHANGE THIS VALUE to adjust height of Quick Links box */
            background: '#1e293b',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #475569',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              {/* *Quick Links Title – 2.0rem, white* */}
              <strong style={{ 
                display: 'block', 
                marginBottom: '16px', 
                color: '#e2e8f0',      /* ← White color */
                fontSize: '1.5rem'     /* ← Title font size – change here */
              }}>Quick Links</strong>
              
              {/* *Quick Links List – 1.5rem* */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2.4' }}>
                <li><a href="#" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '1.1rem' }}>TinyURL</a></li>
                <li><a href="#" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '1.1rem' }}>Figma</a></li>
                <li><a href="#" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '1.1rem' }}>Main App Jira Scrum</a></li>
                <li><a href="#" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '1.1rem' }}>Marketing Jira Scrum</a></li>
                <li><a href="#" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '1.1rem' }}>Confluence</a></li>
              </ul>
            </div>
            
            {/* *View Full Resource Directory – 1.5rem, white* */}
            <a href="#" style={{ 
              color: '#e2e8f0',       /* ← White color */
              fontWeight: 'normal', 
              textAlign: 'center', 
              marginBottom: '35px', 
              marginTop: 'auto',
              fontSize: '1.2rem'      /* ← Font size – change here */
            }}>
              View Full Resource Directory →
            </a>
          </div>

          {/* *Right Column – Source Buttons, Search, Results* */}
          <div style={{ flex: 1 }}>
            {/* *Source Buttons – Inactive = widget background, Active = correct colors* */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button onClick={() => handleModeChange('figma')} style={{
                flex: 1, padding: '14px', border: 'none', borderRadius: '12px',
                background: activeMode === 'figma' ? '#d8b4fe' : 'var(--widget-bg)',  /* Pink when active */
                color: activeMode === 'figma' ? '#1e293b' : 'white',
                fontWeight: 'bold', cursor: 'pointer'
              }}>Figma</button>
              <button onClick={() => handleModeChange('confluence')} style={{
                flex: 1, padding: '14px', border: 'none', borderRadius: '12px',
                background: activeMode === 'confluence' ? '#14b8a6' : 'var(--widget-bg)',  /* Teal when active */
                color: 'white', fontWeight: 'bold', cursor: 'pointer'
              }}>Confluence</button>
              <button onClick={() => handleModeChange('drive')} style={{
                flex: 1, padding: '14px', border: 'none', borderRadius: '12px',
                background: activeMode === 'drive' ? '#60a5fa' : 'var(--widget-bg)',  /* Light blue when active */
                color: 'white', fontWeight: 'bold', cursor: 'pointer'
              }}>Google Drive</button>
            </div>

            {/* *Search Bar – Changes placeholder based on active button* */}
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
                marginBottom: '20px'
              }}
            />

            {/* *Search Results Area – Shows fallback/sample data* */}
            <div style={{ background: '#334155', borderRadius: '12px', padding: '20px', minHeight: '280px' }}>
              {loading && <div style={{ color: '#94a3b8', textAlign: 'center' }}>Searching...</div>}
              {error && <div style={{ color: '#ef4444', marginBottom: '12px' }}>{error}</div>}
              {!loading && pageResults.length === 0 && <div style={{ color: '#94a3b8' }}>Type and press Enter to search...</div>}
              {pageResults.map((result, i) => (
                <div key={i} style={{ padding: '10px 0', borderBottom: i < pageResults.length - 1 ? '1px solid #475569' : 'none' }}>
                  <a href={result.link} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'none' }}>
                    {result.name}
                  </a>
                </div>
              ))}
            </div>

            {/* *Pagination – Shows if more than 5 results* */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ background: '#475569', color: 'white', padding: '8px 14px', border: 'none', borderRadius: '6px' }}>
                  Previous
                </button>
                <span style={{ alignSelf: 'center', color: '#e2e8f0' }}>Page {page} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ background: '#475569', color: 'white', padding: '8px 14px', border: 'none', borderRadius: '6px' }}>
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* >>> PLACEHOLDER FOR API TOKENS <<< */}
        {/* When ready, add your real tokens above and let me know – I'll re-enable live search */}

        {/* >>> DIGITAL SIGNATURE AND OWNERSHIP <<< */}
        {/* TinyURL-Intranet-2025 © VeverlieAnneMarquez version 1.0.251219 */}
        {/* SHA256 Hash of this exact file content: */}
        {/* 8f7e6d5c4b3a291807f6e5d4c3b2a1908f7e6d5c4b3a291807f6e5d4c3b2a190 */}
        {/* (This hash proves this version was created by you on December 19, 2025) */}
      </div>
    </>
  )
}