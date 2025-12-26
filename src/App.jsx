import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Settings from './pages/Settings.jsx'
import { useEffect, useState } from 'react'

function ProtectedRoute({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (user) setCurrentUser(JSON.parse(user))
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div style={{ color: '#e2e8f0', textAlign: 'center', padding: '100px', fontSize: '1.5rem' }}>Loading...</div>
  }

  return currentUser ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
<BrowserRouter>
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Home />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
</BrowserRouter>
  )
}
