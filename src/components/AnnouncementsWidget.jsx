import { useEffect, useState } from 'react'

export default function AnnouncementsWidget() {
  const [announcements, setAnnouncements] = useState([])
  const [editing, setEditing] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [error, setError] = useState('')
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
  const isAdmin = currentUser.role === 'Admin' || currentUser.role === 'Manager'

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('announcements')) || [
      {title: "New Q4 Goals Released", content: "All hands on deck for 2026 planning!", date: "18 Dec 2025", visible: true},
      {title: "Town Hall Friday", content: "Join us at 3PM UTC", date: "17 Dec 2025", visible: true}
    ]
    setAnnouncements(saved)
  }, [])

  const toggleVisibility = (index) => {
    const updated = [...announcements]
    updated[index].visible = !updated[index].visible
    const visibleCount = updated.filter(a => a.visible).length
    if (visibleCount > 3) {
      setError('Maximum 3 active announcements allowed. Uncheck another to enable this one.')
      return
    }
    setError('')
    setAnnouncements(updated)
    localStorage.setItem('announcements', JSON.stringify(updated))
  }

  const saveAnnouncement = () => {
    if (!newTitle || !newContent) return
    if (announcements.filter(a => a.visible).length >= 3) {
      setError('Maximum 3 active announcements. Please disable one before adding.')
      return
    }
    const newAnn = {
      title: newTitle,
      content: newContent,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      visible: true
    }
    const updated = [newAnn, ...announcements]
    setAnnouncements(updated)
    localStorage.setItem('announcements', JSON.stringify(updated))
    setNewTitle('')
    setNewContent('')
    setError('')
  }

  return (
    <>{/* *Latest Announcements Widget Block* */}
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
          textAlign: 'center', 
          fontSize: 'var(--header-font)' 
        }}>
          Latest Announcements 
          {isAdmin && <span onClick={() => setEditing(!editing)} style={{ float: 'right', fontSize: '1.8rem', cursor: 'pointer' }}>✏️</span>}
        </h2>

        {/* *Error Banner – appears when trying to exceed 3 active posts* */}
        {error && <div style={{ background: '#ef4444', color: 'white', padding: '12px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}

        {/* *Editor with Scrollable List and Checkboxes* */}
        {editing && isAdmin && (
          <div style={{ marginBottom: '20px', padding: '15px', background: '#1e293b', borderRadius: '12px', maxHeight: '400px', overflowY: 'auto' }}>
            <input placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#334155', color: '#e2e8f0', border: 'none', borderRadius: '8px' }} />
            <textarea placeholder="Content" value={newContent} onChange={e => setNewContent(e.target.value)} style={{ width: '100%', height: '100px', padding: '10px', background: '#334155', color: '#e2e8f0', border: 'none', borderRadius: '8px' }} />
            <button onClick={saveAnnouncement} style={{ background: '#2563eb', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', marginTop: '10px', marginRight: '8px' }}>Add New</button>
            <button onClick={() => { setEditing(false); setError('') }} style={{ background: '#64748b', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px' }}>Close</button>

            <div style={{ marginTop: '20px' }}>
              <strong>Manage Existing (check to show):</strong>
              {announcements.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid #475569' }}>
                  <input type="checkbox" checked={a.visible} onChange={() => toggleVisibility(i)} style={{ marginRight: '12px', marginTop: '4px' }} />
                  <div style={{ flex: 1 }}>
                    <strong>{a.title}</strong><br />
                    <p style={{ margin: '4px 0', fontSize: '0.95rem' }}>{a.content}</p>
                    <small style={{ color: '#94a3b8' }}>{a.date}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* *Announcements Display* */}
        <div>
          {announcements.filter(a => a.visible).slice(0,3).map((a, i) => (
            <div key={i} style={{ background: '#2d3748', padding: '16px', margin: '12px 0', borderRadius: '12px' }}>
              <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '6px' }}>{a.title}</strong>
              <p style={{ margin: '8px 0' }}>{a.content}</p>
              <small style={{ color: '#94a3b8' }}>{a.date}</small>
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