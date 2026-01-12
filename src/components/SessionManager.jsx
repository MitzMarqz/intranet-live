import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

/* ================= CONFIG ================= */
const MAX_IDLE_TIME = 4 * 60 * 60 * 1000 // 4 hours
const WARNING_TIME = 3 * 60 * 1000       // 3 minutes

export default function SessionManager() {
  const navigate = useNavigate()
  const location = useLocation()

  const [showWarning, setShowWarning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)

  /* ================= ROUTE GUARD ================= */
  const isAuthRoute =
    location.pathname === '/login' ||
    location.pathname === '/change-password'

  /* ================= HELPERS ================= */
  function getSafeUser() {
    try {
      const raw = sessionStorage.getItem('currentUser')
      if (!raw) return null
      const user = JSON.parse(raw)
      if (!user.email || !user.role) return null
      return user
    } catch {
      return null
    }
  }

  const logout = () => {
  // 🔐 AUDIT: session timeout logout
  fetch('/api/google?endpoint=users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'audit',
      actor: JSON.parse(sessionStorage.getItem('currentUser') || '{}')?.email,
      event: 'session_timeout_logout'
    })
  }).catch(() => {}) // never block logout

  sessionStorage.clear()
  navigate('/login', { replace: true })
}


  const resetActivity = () => {
    sessionStorage.setItem('lastActivity', Date.now())
    setSecondsLeft(0)
    setShowWarning(false)
  }

  /* ================= ACTIVITY TRACKING ================= */
  useEffect(() => {
    if (isAuthRoute) return

    const user = getSafeUser()
    if (!user) return

    const events = ['mousemove', 'keydown', 'scroll', 'click']
    events.forEach(e => window.addEventListener(e, resetActivity))

    if (!sessionStorage.getItem('lastActivity')) {
      sessionStorage.setItem('lastActivity', Date.now())
    }

    return () => {
      events.forEach(e => window.removeEventListener(e, resetActivity))
    }
  }, [isAuthRoute])

  /* ================= TIMER LOOP ================= */
  useEffect(() => {
    if (isAuthRoute) return

    const interval = setInterval(() => {
      const last = Number(sessionStorage.getItem('lastActivity'))
      if (!last) return

      const idle = Date.now() - last

      // ⏰ Hard timeout
      if (idle >= MAX_IDLE_TIME) {
        logout()
        return
      }

      // ⚠️ Warning window
      if (idle >= MAX_IDLE_TIME - WARNING_TIME) {
        const remaining = Math.ceil((MAX_IDLE_TIME - idle) / 1000)
        setSecondsLeft(remaining)
        setShowWarning(true)
      } else {
        setShowWarning(false)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isAuthRoute])

  if (!showWarning || isAuthRoute) return null

  /* ================= WARNING MODAL ================= */
  return (
    <div style={overlay}>
      <div style={modal}>
        <h3 style={{ color: '#60a5fa' }}>Session Expiring</h3>

        <p style={{ margin: '12px 0' }}>
          You’ll be logged out in <strong>{secondsLeft}</strong> seconds due to inactivity.
        </p>

        <div style={actions}>
          <button style={primaryBtn} onClick={resetActivity}>
            Stay Logged In
          </button>
          <button style={secondaryBtn} onClick={logout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  )
}

/* ================= STYLES ================= */
const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(2,4,16,0.85)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10000
}

const modal = {
  background: '#020617',
  padding: 28,
  borderRadius: 16,
  width: 420,
  boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
  border: '1px solid rgba(148,163,184,0.2)'
}

const actions = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
  marginTop: 20
}

const primaryBtn = {
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  height: 40,
  fontWeight: 600,
  cursor: 'pointer'
}

const secondaryBtn = {
  background: '#334155',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  height: 40,
  fontWeight: 600,
  cursor: 'pointer'
}
