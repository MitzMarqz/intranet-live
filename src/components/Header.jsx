import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function Header() {
  const navigate = useNavigate()

  useEffect(() => {
    const savedPic = localStorage.getItem('profilePicture')
    if (savedPic) {
      const img = document.getElementById('headerProfilePic')
      if (img) img.src = savedPic
    }
  }, [])

  return (
    <header style={{
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
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <div 
          style={{ width: '52px', height: '52px', borderRadius: '50%', border: '4px solid #60a5fa', overflow: 'hidden', cursor: 'pointer' }}
          onClick={() => navigate('/settings')}
        >
          <img 
            id="headerProfilePic" 
            src="https://via.placeholder.com/52" 
            alt="Profile" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        TinyURL Intranet
        <img src="https://www.tinyurl.com/favicon.ico" alt="TinyURL" style={{ height: '44px' }} />
      </div>
      <nav>
        <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', margin: '0 22px' }}>Home</a>
        <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', margin: '0 22px' }}>Forms</a>
        <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', margin: '0 22px' }}>HR</a>
        <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', margin: '0 22px' }}>Resources</a>
      </nav>
    </header>
  )
}