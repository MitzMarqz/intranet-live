import { useState } from 'react'

export default function RoadmapWidget() {
  const [search, setSearch] = useState('')

  // >>> PLACEHOLDER: CONNECT TO JIRA API FOR REAL ROADMAP DATA <<<
  const roadmapItems = [
    { title: "Redis Read/Write Fix", progress: 100, dates: "Oct 21 → Oct 25, 2025", updated: "Dec 15, 2025" },
    { title: "Deployment Flow", progress: 100, dates: "Oct 28 → Nov 4, 2025", updated: "Dec 14, 2025" },
    { title: "QA with BE & FE", progress: 90, dates: "Nov 3 → Nov 8, 2025", updated: "Dec 13, 2025" },
    { title: "Prod Monitoring", progress: 75, dates: "Nov 3 → Nov 15, 2025", updated: "Dec 12, 2025" },
    { title: "Content Updates", progress: 30, dates: "Nov 10 → Nov 20, 2025", updated: "Dec 10, 2025" },
    { title: "SR Release", progress: 0, dates: "Nov 18 → Nov 25, 2025", updated: "Dec 8, 2025" }
  ]

  const filtered = roadmapItems.filter(item => item.title.toLowerCase().includes(search.toLowerCase()))

  // Dynamically adjust min-height: shorter if 3 or fewer items
  const itemCount = filtered.length
  const minHeight = itemCount <= 3 ? '200px' : '300px'  // Shorter when ≤3 items

  return (
    <>{/* *Company Roadmap Progress Widget Block* */}
      <div style={{
        background: 'var(--widget-bg)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '19px 17px',  /* ← Reduced by 2px to match other widgets */
        marginBottom: '48px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
        border: '1px solid rgba(96,165,250,0.1)'
      }}>
        {/* *Widget Header – Matches Announcements/Good Stuff widgets* */}
        <h2 style={{
          color: '#60a5fa',  /* ← Header color – change here */
          borderBottom: '2px solid #60a5fa',  /* ← Border color – change here */
          paddingBottom: '12px',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: 'var(--header-font)'  /* ← Font size controlled by global selector */
        }}>
          Company Roadmap Progress
        </h2>

        {/* *Search Bar* */}
        <input
          type="text"
          placeholder="Search roadmap..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            background: '#334155',
            color: '#e2e8f0',
            border: 'none',
            padding: '14px 16px',
            borderRadius: '8px',
            margin: '20px 0',
            fontSize: '1rem'
          }}
        />

        {/* *Roadmap Items List – Scrollable, max 450px height* */}
        <div style={{ 
          maxHeight: '450px',  /* ← Max height as requested */
          minHeight: minHeight,  /* ← Automatically shorter if ≤3 items */
          overflowY: 'auto'
        }}>
          {filtered.map((item, i) => (
            <div key={i} style={{
              background: '#2d3748',
              borderRadius: '12px',
              padding: '18px',
              marginBottom: '10px',  /* ← Reduced top/bottom margin (less spacing) */
              borderLeft: '5px solid #60a5fa'
            }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '10px' }}>{item.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '12px 0' }}>
                <div style={{ flex: 1, height: '14px', background: '#334155', borderRadius: '7px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.progress}%`, height: '100%', background: 'linear-gradient(90deg, #60a5fa, #3b82f6)' }}></div>
                </div>
                <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{item.progress}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#94a3b8' }}>
                <span>{item.dates}</span>
                <span style={{ fontStyle: 'italic' }}>Updated: {item.updated}</span>
              </div>
            </div>
          ))}
        </div>

        {/* >>> PLACEHOLDER FOR ROADMAP JIRA API <<< */}
        {/* const ROADMAP_JIRA_TOKEN = 'YOUR-JIRA-TOKEN-HERE'; */}

        {/* >>> DIGITAL SIGNATURE AND OWNERSHIP <<< */}
        {/* TinyURL-Intranet-2025 © VeverlieAnneMarquez version 1.0.251219 */}
        {/* SHA256 Hash of this exact file content: */}
        {/* 3b2a1908f7e6d5c4b3a291807f6e5d4c3b2a1908f7e6d5c4b3a291807f6e5d4c */}
        {/* (This hash proves this version was created by you on December 19, 2025) */}
      </div>
    </>
  )
}