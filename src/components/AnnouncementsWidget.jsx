import { useEffect, useState } from 'react'

export default function AnnouncementsWidget() {
  const [announcements, setAnnouncements] = useState([])
  const [editing, setEditing] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [error, setError] = useState('')
  
  let currentUser = {}
  
  try {
    const raw = localStorage.getItem('currentUser')
    currentUser = raw ? JSON.parse(raw) : {}
  
  } catch (err) {
    console.warn('Invalid currentUser in localStorage, clearing it')
    localStorage.removeItem('currentUser')
    currentUser = {}
  }
  
  const role = String(currentUser.role || '').toLowerCase()

  
  const canEdit =
  role === 'admin' || role === 'manager'



  /**
   * =========================================================
   * Send published post to backend (Google Sheets logging)
   * =========================================================
   */
  const logPostToSheet = async (payload) => {
    try {
      await fetch('/api/google?endpoint=logPost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    } catch (err) {
      console.error('Failed to log announcement:', err)
    }
  }

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem('announcements')) || [
        {
          title: 'New Q4 Goals Released',
          content: 'All hands on deck for 2026 planning!',
          date: '18 Dec 2025',
          visible: true
        },
        {
          title: 'Town Hall Friday',
          content: 'Join us at 3PM UTC',
          date: '17 Dec 2025',
          visible: true
        }
      ]

    setAnnouncements(saved)
  }, [])

  const toggleVisibility = (index) => {
    const updated = [...announcements]
    updated[index].visible = !updated[index].visible

    if (updated.filter(a => a.visible).length > 3) {
      setError('Maximum 3 active announcements allowed.')
      return
    }

    setError('')
    setAnnouncements(updated)
    localStorage.setItem('announcements', JSON.stringify(updated))
  }

  const saveAnnouncement = () => {
    if (!newTitle || !newContent) return

    if (announcements.filter(a => a.visible).length >= 3) {
      setError('Disable one announcement before adding.')
      return
    }

    const newAnn = {
      title: newTitle,
      content: newContent,
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      visible: true
    }

    const updated = [newAnn, ...announcements]
    setAnnouncements(updated)
    localStorage.setItem('announcements', JSON.stringify(updated))

    logPostToSheet({
      widget: 'Announcements',
      title: newTitle,
      content: newContent,
      author: currentUser.email || 'Unknown',
      timestamp: new Date().toISOString()
    })

    setNewTitle('')
    setNewContent('')
    setError('')
  }

  return (
    <div
      style={{
        background: 'var(--widget-bg)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '19px 17px',
        marginBottom: '28px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
        border: '1px solid rgba(96,165,250,0.1)'
      }}
    >
      <h2
        style={{
          color: '#60a5fa',
          borderBottom: '2px solid #60a5fa',
          paddingBottom: '12px',
          textAlign: 'center',
          fontSize: 'var(--header-font)'
        }}
      >
        Latest Announcements
        {canEdit && (
          <span
            onClick={() => setEditing(!editing)}
            style={{ float: 'right', fontSize: '1.8rem', cursor: 'pointer' }}
          >
            ✏️
          </span>
        )}
      </h2>

      {error && (
        <div
          style={{
            background: '#ef4444',
            color: '#60a5fa',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            textAlign: 'center'
          }}
        >
          {error}
        </div>
      )}

      {editing && canEdit && (
        <div
          style={{
            marginBottom: '20px',
            padding: '15px',
            background: '#1e293b',
            borderRadius: '12px',
            maxHeight: '400px',
            overflowY: 'auto'
          }}
        >
          <input
            placeholder="Title"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              background: '#334155',
              color: '#60a5fa',
              border: 'none',
              borderRadius: '8px'
            }}
          />

          <textarea
            placeholder="Content"
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            style={{
              width: '100%',
              height: '80px',
              padding: '10px',
              background: '#334155',
              color: '#e2e8f0',
              border: 'none',
              borderRadius: '8px'
            }}
          />

          <button
            onClick={saveAnnouncement}
            style={{
              background: '#2563eb',
              color: '#60a5fa',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '8px',
              marginRight: '8px'
            }}
          >
            Publish
          </button>

          <button
            onClick={() => {
              setEditing(false)
              setError('')
            }}
            style={{
              background: '#64748b',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '8px'
            }}
          >
            Close
          </button>

          {/* ========= EDITOR LIST (MATCHES GOOD STUFF DENSITY) ========= */}
          <div
            style={{
              marginTop: '16px',
              maxHeight: '50px',
              overflowY: 'auto',
              fontSize: '0.85rem'
            }}
          >
            <strong style={{ fontSize: '0.9rem' }}>
              Manage Existing (check to show):
            </strong>

            {announcements.map((a, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: '6px 0',
                  borderBottom: '1px solid #475569'
                }}
              >
                <input
                  type="checkbox"
                  checked={a.visible}
                  onChange={() => toggleVisibility(i)}
                  style={{ marginRight: '10px', marginTop: '4px' }}
                />

                <div>
                  <strong style={{ fontSize: '0.9rem' }}>
                    {a.title}
                  </strong>
                  <div style={{ opacity: 0.85 }}>
                    {a.content} – {a.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW MODE — unchanged */}
      <div>
        {announcements
          .filter(a => a.visible)
          .slice(0, 3)
          .map((a, i) => (
            <div
              key={i}
              style={{
                background: '#2d3748',
                padding: '16px',
                margin: '12px 0',
                borderRadius: '12px'
              }}
            >
              <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '6px' }}>
                {a.title}
              </strong>
              <p style={{ margin: '8px 0' }}>{a.content}</p>
              <small style={{ color: '#94a3b8' }}>{a.date}</small>
            </div>
          ))}
      </div>
    </div>
  )
}
