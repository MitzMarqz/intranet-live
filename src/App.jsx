import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Login from './pages/Login.jsx'
import Home from './pages/Home'
import Settings from './pages/Settings'
import ChangePassword from './pages/ChangePassword'
import SessionManager from './components/SessionManager.jsx'
import UnderConstruction from './pages/UnderConstruction.jsx'

/* ================= AUTH GUARD ================= */
function ProtectedRoute({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = sessionStorage.getItem('currentUser')
    if (user) setCurrentUser(JSON.parse(user))
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div style={{ padding: 80 }}>Loading…</div>
  }

  return currentUser ? children : <Navigate to="/login" replace />
}

/* ================= APP ================= */
export default function App() {
  return (
    <BrowserRouter basename="/intranet-live">
      <SessionManager />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />

        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        <Route path="/forms" element={<ProtectedRoute><UnderConstruction /></ProtectedRoute>} />
        <Route path="/hr" element={<ProtectedRoute><UnderConstruction /></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><UnderConstruction /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
