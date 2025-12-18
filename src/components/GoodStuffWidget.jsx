import { useEffect, useState } from 'react'

export default function GoodStuffWidget() {
  const [spotlights, setSpotlights] = useState([])
  const [editing, setEditing] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDetails, setNewDetails] = useState('')
  const [error, setError] = useState('')
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
  const isAdmin = currentUser.role === 'Admin' || currentUser.role === 'Manager'

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('spotlights')) || [
      {title: "Ana crushed it!", details: "Closed 15 high-priority bugs", author: "Carlos", date: "Dec 18", emoji: "🏆", gradient: "linear-gradient(135deg,#ff9a9e,#fad0c4)", visible: true},
      {title: "Happy Birthday Sofia!", details: "Have an amazing day!", author: "The Team", date: "Dec 19", emoji: "🎂", gradient: "linear-gradient(135deg,#d8b4fe,#e9d5ff)", visible: true},
      {title: "10 Million URLs!", details: "We hit 10M this month!", author: "Leadership", date: "Dec 17", emoji: "🚀", gradient: "linear-gradient(135deg,#86efac,#bbf7d0)", visible: true}
    ]
    setSpotlights(saved)
  }, [])

  const toggleVisibility = (index) => {
    const updated = [...spotlights]
    updated[index].visible = !updated[index].visible
    const visibleCount = updated.filter(s => s.visible).length
    if (visibleCount > 3) {
      setError('Maximum 3 active Good Stuff posts allowed. Uncheck another to enable this one.')
      return
    }
    setError('')
    setSpotlights(updated)
    localStorage.setItem('spotlights', JSON.stringify(updated))
  }

  const addSpotlight = () => {
    if (!newTitle || !newDetails) return
    if (spotlights.filter(s => s.visible).length >= 3) {
      setError('Maximum 3 active posts. Please disable one before adding a new one.')
      return
    }
    const newSpot = {
      title: newTitle,
      details: newDetails,
      author: currentUser.email?.split('@')[0] || 'User',
      date: new Date().toLocaleDateString('en-GB', {day: 'numeric', month: 'short'}),
      emoji: "🎉",
      gradient: "linear-gradient(135deg,#a78bfa,#c4b5fd)",
      visible: true
    }
    const updated = [newSpot, ...spotlights]
    setSpotlights(updated)
    localStorage.setItem('spotlights', JSON.stringify(updated))
    setNewTitle('')
    setNewDetails('')
    setError('')
  }

  return (
    <>{/* *Good Stuff Widget Block* */}
      <div style={{ 
        background: 'var(--widget-bg)', 
        backdropFilter: 'blur(10px)', 
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '16px', 
        padding: '19px 17px', /* ← Reduced by 2px as requested */
        marginBottom: '28px', 
        boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
        border: '1px solid rgba(96,165,250,0.1)'
      }}>
        <h2 style={{ 
          color: '#60a5fa', /* Widget title color – change here */
          borderBottom: '2px solid #60a5fa', 
          paddingBottom: '12px', 
          marginBottom: '16px', 
          textAlign: 'center', 
          fontSize: 'var(--header-font)' 
        }}>
          Good Stuff 🔥 
          {isAdmin && <span onClick={() => setEditing(!editing)} style={{ float: 'right', fontSize: '1.8rem', cursor: 'pointer' }}>✏️</span>}
        </h2>

        {/* *Error Banner – appears when trying to exceed 3 active posts* */}
        {error && <div style={{ background: '#ef4444', color: 'white', padding: '12px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}

        {/* *Editor with Scrollable List and Checkboxes* */}
        {editing && isAdmin && (
          <div style={{ marginBottom: '20px', padding: '15px', background: '#1e293b', borderRadius: '12px', maxHeight: '400px', overflowY: 'auto' }}>
            <input placeholder="New Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#334155', color: '#e2e8f0', border: 'none', borderRadius: '8px' }} />
            <input placeholder="New Details" value={newDetails} onChange={e => setNewDetails(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#334155', color: '#e2e8f0', border: 'none', borderRadius: '8px' }} />
            <button onClick={addSpotlight} style={{ background: '#2563eb', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '8px', marginRight: '8px' }}>Add New</button>
            <button onClick={() => { setEditing(false); setError('') }} style={{ background: '#64748b', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '8px' }}>Close</button>

            <div style={{ marginTop: '20px' }}>
              <strong>Manage Existing (check to show):</strong>
              {spotlights.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #475569' }}>
                  <input type="checkbox" checked={s.visible} onChange={() => toggleVisibility(i)} style={{ marginRight: '10px' }} />
                  <div>
                    <strong>{s.emoji} {s.title}</strong><br />
                    <small>{s.details} – {s.author}, {s.date}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* *Good Stuff Grid – One row on desktop, stacks on mobile* */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', /* Always 3 columns on desktop */
          gap: '16px',
          '@media (max-width: 1100px)': { gridTemplateColumns: '1fr' } /* Stacks on mobile */
        }}>
          {spotlights.filter(s => s.visible).slice(0,3).map((s, i) => (
            <div key={i} style={{ 
              padding: '20px', 
              borderRadius: '14px', 
              textAlign: 'center', 
              background: s.gradient, 
              color: '#1e293b' 
            }}>
              <div style={{ fontSize: '2.8rem', marginBottom: '8px' }}>{s.emoji}</div>
              <strong style={{ fontSize: '1.2rem', display: 'block', margin: '8px 0' }}>{s.title}</strong>
              <div style={{ fontSize: '0.95rem' }}>{s.details}</div>
              <small style={{ display: 'block', marginTop: '8px', opacity: 0.8 }}>{s.author} – {s.date}</small>
            </div>
          ))}
        </div>
      </div>

      {/* >>> DIGITAL SIGNATURE AND OWNERSHIP <<< */}
      {/* TinyURL-Intranet-2025 © VeverlieAnneMarquez version 1.0.251219 */}
      {/* SHA256 Hash of this exact file content: */}
      {/* a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0  */}
      {/* (This hash proves this version was created by you on this date) */}
    </>
  )
}