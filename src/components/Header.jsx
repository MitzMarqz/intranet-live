import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function Header() {
  const navigate = useNavigate()

  useEffect(() => {
    const user = sessionStorage.getItem('currentUser')
    if (!user) navigate('/login', { replace: true })
  }, [navigate])

  return (
    <header
      style={{
        background: 'var(--tinyurl-blue)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        fontFamily: '"Bungee", cursive',
        fontSize: '2rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            border: '4px solid #60a5fa',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/settings')}
        >
          <img
            src={
              localStorage.getItem('profilePicture') ||
              `${import.meta.env.BASE_URL}default-avatar.png`
            }
            alt="Profile"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        TinyURL Intranet
        <img
          src="https://www.tinyurl.com/favicon.ico"
          alt="TinyURL"
          style={{ height: '44px' }}
        />
      </div>

      <nav>
        <span style={navLink} onClick={() => navigate('/')}>Home</span>
        <span style={navLink} onClick={() => navigate('/forms')}>Forms</span>
        <span style={navLink} onClick={() => navigate('/hr')}>HR</span>
        <span style={navLink} onClick={() => navigate('/resources')}>Resources</span>
      </nav>
    </header>
  )
}

const navLink = {
  color: 'white',
  textDecoration: 'none',
  margin: '0 22px',
  cursor: 'pointer'
}
