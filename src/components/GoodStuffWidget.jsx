import { useEffect, useState } from 'react'

export default function GoodStuffWidget() {
  const [spotlights, setSpotlights] = useState([])
  const [editing, setEditing] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDetails, setNewDetails] = useState('')
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

  // SAFE admin check (works in dev + prod)
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
      console.error('Failed to log Good Stuff post:', err)
    }
  }

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem('spotlights')) || [
        {
          title: 'Ana crushed it!',
          details: 'Closed 15 high-priority bugs',
          author: 'Carlos',
          date: 'Dec 18',
          emoji: '🏆',
          gradient: 'linear-gradient(135deg,#ff9a9e,#fad0c4)',
          visible: true
        },
        {
          title: 'Happy Birthday Sofia!',
          details: 'Have an amazing day!',
          author: 'The Team',
          date: 'Dec 19',
          emoji: '🎂',
          gradient: 'linear-gradient(135deg,#d8b4fe,#e9d5ff)',
          visible: true
        },
        {
          title: '10 Million URLs!',
          details: 'We hit 10M this month!',
          author: 'Leadership',
          date: 'Dec 17',
          emoji: '🚀',
          gradient: 'linear-gradient(135deg,#86efac,#bbf7d0)',
          visible: true
        }
      ]

    setSpotlights(saved)
  }, [])

  const toggleVisibility = (index) => {
    const updated = [...spotlights]
    updated[index].visible = !updated[index].visible

    const visibleCount = updated.filter(s => s.visible).length
    if (visibleCount > 3) {
      setError('Maximum 3 active Good Stuff posts allowed.')
      return
    }

    setError('')
    setSpotlights(updated)
    localStorage.setItem('spotlights', JSON.stringify(updated))
  }

  const addSpotlight = () => {
    if (!newTitle || !newDetails) return

    if (spotlights.filter(s => s.visible).length >= 3) {
      setError('Maximum 3 active posts.')
      return
    }

    const newSpot = {
      title: newTitle,
      details: newDetails,
      author: currentUser.email || 'User',
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short'
      }),
      emoji: '🎉',
      gradient: 'linear-gradient(135deg,#a78bfa,#c4b5fd)',
      visible: true
    }

    const updated = [newSpot, ...spotlights]
    setSpotlights(updated)
    localStorage.setItem('spotlights', JSON.stringify(updated))

    logPostToSheet({
      widget: 'Good Stuff',
      title: newTitle,
      content: newDetails,
      author: currentUser.email || 'Unknown',
      timestamp: new Date().toISOString()
    })

    setNewTitle('')
    setNewDetails('')
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
          marginBottom: '16px',
          textAlign: 'center',
          fontSize: 'var(--header-font)'
        }}
      >
        Good Stuff 🔥
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
            color: 'white',
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
              color: '#e2e8f0',
              border: 'none',
              borderRadius: '8px'
            }}
          />

          <input
            placeholder="Details"
            value={newDetails}
            onChange={e => setNewDetails(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              background: '#334155',
              color: '#e2e8f0',
              border: 'none',
              borderRadius: '8px'
            }}
          />

          <button
            onClick={addSpotlight}
            style={{
              background: '#2563eb',
              color: 'white',
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

          {/* ========= EDITOR LIST (DENSE + SCROLLABLE) ========= */}
          <div
            style={{
              marginTop: '16px',
              maxHeight: '200px',
              overflowY: 'auto',
              fontSize: '0.85rem'
            }}
          >
            <strong style={{ fontSize: '0.9rem' }}>
              Manage Existing (check to show):
            </strong>

            {spotlights.map((s, i) => (
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
                  checked={s.visible}
                  onChange={() => toggleVisibility(i)}
                  style={{ marginRight: '10px', marginTop: '4px' }}
                />

                <div>
                  <strong style={{ fontSize: '0.9rem' }}>
                    {s.emoji} {s.title}
                  </strong>
                  <div style={{ opacity: 0.85 }}>
                    {s.details} – {s.author}, {s.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW MODE (UNCHANGED) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px'
        }}
      >
        {spotlights
          .filter(s => s.visible)
          .slice(0, 3)
          .map((s, i) => (
            <div
              key={i}
              style={{
                padding: '20px',
                borderRadius: '14px',
                textAlign: 'center',
                background: s.gradient,
                color: '#1e293b'
              }}
            >
              <div style={{ fontSize: '2.8rem', marginBottom: '8px' }}>
                {s.emoji}
              </div>
              <strong
                style={{
                  fontSize: '1.2rem',
                  display: 'block',
                  margin: '8px 0'
                }}
              >
                {s.title}
              </strong>
              <div style={{ fontSize: '0.95rem' }}>{s.details}</div>
              <small style={{ display: 'block', marginTop: '8px', opacity: 0.8 }}>
                {s.author} – {s.date}
              </small>
            </div>
          ))}
      </div>
    </div>
  )
}
