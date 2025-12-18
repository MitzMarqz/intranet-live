import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Initialize default users if none exist
  useEffect(() => {
    let users = JSON.parse(localStorage.getItem('intranetUsers')) || []
    if (users.length === 0) {
      const currentDate = new Date().toISOString().split('T')[0]
      users = [
        { 
          email: 'mitzie@tinyurl.com', 
          password: 'Intranet123', 
          role: 'Admin', 
          status: 'Active', 
          name: 'Mitzie Marquez', 
          phone: '', 
          birthday: '',
          isAdminGenerated: false,
          needsPasswordChange: false,
          createdAt: '2024-01-01',
          removedAt: null
        },
        { 
          email: 'patton@tinyurl.com', 
          password: 'Intranet123', 
          role: 'Manager', 
          status: 'Active', 
          name: 'Patton', 
          phone: '', 
          birthday: '',
          isAdminGenerated: false,
          needsPasswordChange: false,
          createdAt: '2024-02-15',
          removedAt: null
        },
        { 
          email: 'gemm@tinyurl.com', 
          password: 'Intranet123', 
          role: 'Viewer', 
          status: 'Active', 
          name: 'Gemm', 
          phone: '', 
          birthday: '',
          isAdminGenerated: false,
          needsPasswordChange: false,
          createdAt: '2024-03-10',
          removedAt: null
        },
        { 
          email: 'anton@tinyurl.com', 
          password: 'Intranet123', 
          role: 'Viewer', 
          status: 'Invited', 
          name: 'Anton', 
          phone: '', 
          birthday: '',
          isAdminGenerated: true,
          needsPasswordChange: true,
          createdAt: '2024-04-05',
          removedAt: null
        },
        { 
          email: 'fernando@tinyurl.com', 
          password: 'Intranet123', 
          role: 'Viewer', 
          status: 'Revoked', 
          name: 'Fernando', 
          phone: '', 
          birthday: '',
          isAdminGenerated: false,
          needsPasswordChange: false,
          createdAt: '2024-02-20',
          removedAt: '2024-04-15'
        }
      ]
      localStorage.setItem('intranetUsers', JSON.stringify(users))
    }
  }, [])

  const handleLogin = () => {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('intranetUsers')) || []
    
    // Find user by email
    const user = users.find(u => u.email === email)
    
    if (!user) {
      setError('Invalid email or password')
      return
    }
    
    // Check if user is revoked
    if (user.status === 'Revoked') {
      setError('Your account has been revoked. Please contact your administrator.')
      return
    }
    
    // Check if user is invited (hasn't logged in yet)
    if (user.status === 'Invited') {
      // Update status to Active on first login
      user.status = 'Active'
      localStorage.setItem('intranetUsers', JSON.stringify(users))
    }
    
    // Check password
    if (user.password !== password) {
      setError('Invalid email or password')
      return
    }
    
    // Store current user
    localStorage.setItem('currentUser', JSON.stringify(user))
    
    // Set flag to show password change banner if needed
    if (user.needsPasswordChange) {
      localStorage.setItem('showPasswordChangeBanner', 'true')
    }
    
    // Navigate to home
    navigate('/')
  }

  return (
    <>
      {/* *Neon Glass Background Block* */}
      <div className="glass-bg">
        <div className="blob blue-blob"></div>
        <div className="blob purple-blob"></div>
      </div>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* *Header Block* */}
        <header style={{
          background: 'var(--tinyurl-blue)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'white',
          fontFamily: 'Bungee, cursive'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.8rem' }}>
            TinyURL Intranet
            <img src="https://www.tinyurl.com/favicon.ico" alt="TinyURL" style={{ height: '40px' }} />
          </div>
          <div style={{ fontSize: '1.1rem' }}>
            UTC Time: <span id="utcClock">--:--</span>
          </div>
        </header>

        {/* *Login Form Block* */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            background: 'var(--widget-bg)',
            padding: '40px',
            borderRadius: '16px',
            width: '420px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
          }}>
            <h2 style={{ color: '#60a5fa', marginBottom: '30px', fontSize: '2rem' }}>Welcome Back</h2>
            
            {/* Demo Credentials Banner */}
            <div style={{
              background: 'rgba(96, 165, 250, 0.1)',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
              textAlign: 'left',
              fontSize: '0.85rem'
            }}>
              <div style={{ fontWeight: 'bold', color: '#60a5fa', marginBottom: '5px' }}>Demo Credentials:</div>
              <div style={{ color: '#cbd5e1' }}>
                <div>Admin: mitzie@tinyurl.com / Intranet123</div>
                <div>Manager: patton@tinyurl.com / Intranet123</div>
                <div>Viewer: gemm@tinyurl.com / Intranet123</div>
              </div>
            </div>
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--input-bg)',
                color: 'var(--input-text)',
                border: 'none',
                padding: '14px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '1rem'
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%',
                background: 'var(--input-bg)',
                color: 'var(--input-text)',
                border: 'none',
                padding: '14px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '1rem'
              }}
            />
            <button
              onClick={handleLogin}
              style={{
                background: 'var(--tinyurl-blue)',
                color: 'white',
                border: 'none',
                padding: '14px',
                borderRadius: '8px',
                width: '100%',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1.1rem'
              }}
            >
              Login
            </button>
            {error && <div style={{ color: '#ef4444', marginTop: '12px', fontSize: '0.9rem' }}>{error}</div>}
            
            {/* Password Requirements Note */}
            <div style={{
              marginTop: '20px',
              color: '#94a3b8',
              fontSize: '0.8rem',
              textAlign: 'left',
              padding: '10px',
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '6px'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>Password Requirements:</div>
              <div>• Minimum 8 characters</div>
              <div>• At least 2 different character types:</div>
              <div style={{ marginLeft: '15px' }}>- Uppercase letters</div>
              <div style={{ marginLeft: '15px' }}>- Lowercase letters</div>
              <div style={{ marginLeft: '15px' }}>- Numbers</div>
              <div style={{ marginLeft: '15px' }}>- Symbols</div>
            </div>
          </div>
        </div>

        {/* *Footer Block* */}
        <footer style={{ background: '#1e40af', padding: '24px', textAlign: 'center', fontSize: '0.9rem' }}>
          <strong>CONFIDENTIALITY CAUTION AND DISCLAIMER</strong><br />
          This message is intended only for the use of the individual(s) or entity (ies) to which it is addressed and contains information that is legally privileged and confidential. If you are not the intended recipient, or the person responsible for delivering the message to the intended recipient, you are hereby notified that any dissemination, distribution or copying of this communication is strictly prohibited. All unintended recipients are obliged to delete this message and destroy any printed copies.
        </footer>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            function updateUTC() {
              const utc = new Date().toLocaleTimeString('en-GB', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', hour12: false });
              const el = document.getElementById('utcClock');
              if (el) el.textContent = utc + ' UTC';
            }
            updateUTC();
            setInterval(updateUTC, 1000);
          `
        }}
      />
    </>
  )
}