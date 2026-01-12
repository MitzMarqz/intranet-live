import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SignInWidget() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  /* ================= SIGN IN ================= */
  const signIn = async (e) => {
    e.preventDefault()
    if (loading) return

    setError('')
    setLoading(true)

    // 🔍 DEBUG — REQUIRED FOR STABILITY VERIFICATION
    console.log('LOGIN DEBUG', {
      email,
      password,
      passwordLength: password.length
    })

    try {
      const res = await fetch('/api/google?endpoint=auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const json = await res.json()

      if (!json.success) {
        setError(json.error || 'Login failed')
        setLoading(false)
        return
      }

      // ===============================
      // SAVE LOGGED-IN USER (CRITICAL)
      // ===============================
      
      const userPayload = {
        email: json.user.email,
        name: json.user.name,
        role: json.user.role,
        status: json.user.status,
        loginAt: Date.now()
      }


      // Used by routes / auth
      sessionStorage.setItem('currentUser', JSON.stringify(userPayload))

      // Used by widgets / UI permissions
      localStorage.setItem('currentUser', JSON.stringify(userPayload))


      navigate(json.user.needsPasswordChange ? '/change-password' : '/')
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  /* ================= RENDER ================= */
  return (
    <form className="widget" style={widget} onSubmit={signIn}>
      <h2 style={header}>Sign In</h2>

      <div style={field}>
        <label style={label}>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={input}
          required
        />
      </div>

      <div style={field}>
        <label style={label}>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={input}
          autoComplete="current-password"
          required
        />
      </div>

      {error && <div style={errorText}>{error}</div>}

      <button
        type="submit"
        disabled={loading}
        style={{
          ...primaryBtn,
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  )
}

/* ================= STYLES ================= */

const widget = {
  width: 420,
  padding: 28,
  background: '#020617',
  borderRadius: 16,
  boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
  border: '1px solid rgba(148,163,184,0.2)'
}

const header = {
  fontSize: 'var(--header-font)',
  color: 'var(--tinyurl-blue)',
  textAlign: 'center',
  marginBottom: 20,
  fontWeight: 500
}

const field = {
  marginBottom: 14
}

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
  padding: '10px',
  fontSize: 'var(--font-base)',
  color: '#e5e7eb',
  outline: 'none'
}

const primaryBtn = {
  width: '100%',
  height: '2.2rem',
  background: 'var(--tinyurl-blue)',
  borderRadius: 10,
  border: 'none',
  color: '#fff',
  fontSize: 'var(--font-base)',
  marginTop: 10
}

const errorText = {
  color: '#ef4444',
  marginBottom: 12,
  fontSize: '0.85rem'
}
