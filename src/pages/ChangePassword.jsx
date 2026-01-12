import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ChangePassword() {
  const navigate = useNavigate()

  const [currentUser, setCurrentUser] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  /* ================= LOAD SESSION ================= */
  useEffect(() => {
    const u = JSON.parse(sessionStorage.getItem('currentUser') || 'null')
    if (!u) {
      navigate('/login', { replace: true })
      return
    }
    setCurrentUser(u)
  }, [navigate])

  /* ================= SUBMIT ================= */
  const submit = async () => {
    setError('')

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/google?endpoint=changepassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          newPassword
        })
      })

      const json = await res.json()

      if (!json.success) {
        setError(json.error || 'Failed to change password')
        setLoading(false)
        return
      }

      // 🔐 Force clean login after password change
      sessionStorage.clear()
      navigate('/login', { replace: true })

    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  if (!currentUser) return null

  return (
    <div style={page}>
      <div className="widget" style={widget}>
        <h2 style={header}>Change Password</h2>

        <div style={field}>
          <label style={label}>New Password</label>
          <input
            type="password"
            style={input}
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </div>

        <div style={field}>
          <label style={label}>Confirm Password</label>
          <input
            type="password"
            style={input}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <div style={errorText}>{error}</div>}

        <button
          onClick={submit}
          disabled={loading}
          style={{
            ...primaryBtn,
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Saving…' : 'Update Password'}
        </button>
      </div>
    </div>
  )
}

/* ================= STYLES ================= */

const page = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const widget = {
  width: 420
}

const header = {
  textAlign: 'center',
  color: 'var(--tinyurl-blue)',
  marginBottom: 20
}

const field = { marginBottom: 14 }

const label = {
  fontSize: '0.75rem',
  color: '#94a3b8',
  display: 'block',
  marginBottom: 4
}

const input = {
  width: '100%',
  background: '#020617',
  border: '1px solid #334155',
  borderRadius: 10,
  padding: 10,
  color: '#e5e7eb'
}

const primaryBtn = {
  width: '100%',
  height: '2.4rem',
  background: 'var(--tinyurl-blue)',
  borderRadius: 10,
  border: 'none',
  color: '#fff',
  fontSize: '1rem',
  marginTop: 10,
  cursor: 'pointer'
}

const errorText = {
  color: '#ef4444',
  marginBottom: 10
}
