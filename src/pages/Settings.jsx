import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import ControlsBar from '../components/ControlsBar.jsx'

export default function Settings() {
  const [currentUser, setCurrentUser] = useState(null)
  const [allUsers, setAllUsers] = useState([])
  const [newPassword, setNewPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [birthday, setBirthday] = useState('')
  const [profilePosition, setProfilePosition] = useState({ x: 50, y: 50 })
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [selectedUserForReset, setSelectedUserForReset] = useState(null)
  const [resetPasswordValue, setResetPasswordValue] = useState('')
  const [newUserData, setNewUserData] = useState({
    email: '',
    name: '',
    role: 'Viewer',
    status: 'Invited',
    phone: '',
    birthday: '',
    password: '',
    isAdminGenerated: true
  })
  const navigate = useNavigate()

  // Initialize default users if none exist
  useEffect(() => {
    let users = JSON.parse(localStorage.getItem('intranetUsers')) || []
    if (users.length === 0) {
      const currentDate = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
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
    setAllUsers(users)
  }, [])

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    if (!user) {
      navigate('/login')
      return
    }
    
    if (user.needsPasswordChange) {
      alert('Please change your password. This password was set by an administrator.')
      localStorage.setItem('showPasswordChangeBanner', 'true')
    }
    
    setCurrentUser(user)
    setPhone(user.phone || '')
    setBirthday(user.birthday || '')

    const savedPosition = localStorage.getItem('profilePicturePosition')
    if (savedPosition) {
      setProfilePosition(JSON.parse(savedPosition))
    }

    const savedPic = localStorage.getItem('profilePicture')
    if (savedPic) {
      const headerImg = document.getElementById('headerProfilePic')
      const sidebarImg = document.getElementById('sidebarProfilePic')
      const previewImg = document.getElementById('largeProfilePreview')
      if (headerImg) headerImg.src = savedPic
      if (sidebarImg) sidebarImg.src = savedPic
      if (previewImg) previewImg.src = savedPic
    }
  }, [navigate])

  const previewPic = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const dataURL = ev.target.result
        localStorage.setItem('profilePicture', dataURL)
        const headerImg = document.getElementById('headerProfilePic')
        const sidebarImg = document.getElementById('sidebarProfilePic')
        const previewImg = document.getElementById('largeProfilePreview')
        if (headerImg) headerImg.src = dataURL
        if (sidebarImg) sidebarImg.src = dataURL
        if (previewImg) previewImg.src = dataURL
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileDrag = (e) => {
    const container = e.currentTarget
    const rect = container.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    const constrainedX = Math.max(0, Math.min(100, x))
    const constrainedY = Math.max(0, Math.min(100, y))
    
    setProfilePosition({ x: constrainedX, y: constrainedY })
  }

  const saveProfilePosition = () => {
    localStorage.setItem('profilePicturePosition', JSON.stringify(profilePosition))
    alert('Profile position saved')
  }

  const isValidPassword = (pwd) => {
    if (pwd.length < 8) return false
    const types = [
      /[a-z]/,
      /[A-Z]/,
      /[0-9]/,
      /[^a-zA-Z0-9]/
    ]
    const matched = types.filter(regex => regex.test(pwd)).length
    return matched >= 2
  }

  const updateUserInfo = () => {
    if (newPassword && !isValidPassword(newPassword)) {
      return alert('Password must be at least 8 characters and contain at least 2 different types (uppercase, lowercase, numbers, symbols)')
    }

    const updated = allUsers.map(u => {
      if (u.email === currentUser.email) {
        const updatedUser = { 
          ...u, 
          phone, 
          birthday,
          isAdminGenerated: false,
          needsPasswordChange: false
        }
        if (newPassword) {
          updatedUser.password = newPassword
        }
        return updatedUser
      }
      return u
    })
    
    localStorage.setItem('intranetUsers', JSON.stringify(updated))
    
    const updatedCurrentUser = { ...currentUser, phone, birthday }
    if (newPassword) {
      updatedCurrentUser.password = newPassword
      updatedCurrentUser.isAdminGenerated = false
      updatedCurrentUser.needsPasswordChange = false
    }
    localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser))
    localStorage.setItem('profilePicturePosition', JSON.stringify(profilePosition))
    
    if (newPassword) {
      localStorage.removeItem('showPasswordChangeBanner')
    }
    
    setCurrentUser(updatedCurrentUser)
    setAllUsers(updated)
    
    alert('All information updated successfully')
    setNewPassword('')
  }

  const updateUserRole = (email, newRole) => {
    const updated = allUsers.map(u => u.email === email ? { ...u, role: newRole } : u)
    localStorage.setItem('intranetUsers', JSON.stringify(updated))
    setAllUsers(updated)
    alert(`Permission updated for ${email}`)
  }

  const handleAddNewUser = () => {
    if (!newUserData.email || !newUserData.name || !newUserData.password) {
      alert('Please fill in all required fields: Email, Name, and Password')
      return
    }
    
    if (!isValidPassword(newUserData.password)) {
      alert('Password must be at least 8 characters and contain at least 2 different types (uppercase, lowercase, numbers, symbols)')
      return
    }
    
    if (allUsers.some(user => user.email === newUserData.email)) {
      alert('User with this email already exists')
      return
    }
    
    const currentDate = new Date().toISOString().split('T')[0]
    
    const newUser = {
      email: newUserData.email,
      name: newUserData.name,
      password: newUserData.password,
      role: newUserData.role,
      status: newUserData.status,
      phone: newUserData.phone,
      birthday: newUserData.birthday,
      isAdminGenerated: true,
      needsPasswordChange: true,
      createdAt: currentDate,
      removedAt: newUserData.status === 'Revoked' ? currentDate : null
    }
    
    const updatedUsers = [...allUsers, newUser]
    localStorage.setItem('intranetUsers', JSON.stringify(updatedUsers))
    setAllUsers(updatedUsers)
    
    setNewUserData({
      email: '',
      name: '',
      role: 'Viewer',
      status: 'Invited',
      phone: '',
      birthday: '',
      password: '',
      isAdminGenerated: true
    })
    setShowAddUserModal(false)
    
    alert('New user added successfully. The user will be prompted to change their password on first login.')
  }

  const handleResetPassword = () => {
    if (!resetPasswordValue) {
      alert('Please enter a new password')
      return
    }
    
    if (!isValidPassword(resetPasswordValue)) {
      alert('Password must be at least 8 characters and contain at least 2 different types (uppercase, lowercase, numbers, symbols)')
      return
    }
    
    const updated = allUsers.map(u => {
      if (u.email === selectedUserForReset.email) {
        return { 
          ...u, 
          password: resetPasswordValue,
          isAdminGenerated: true,
          needsPasswordChange: true
        }
      }
      return u
    })
    
    localStorage.setItem('intranetUsers', JSON.stringify(updated))
    setAllUsers(updated)
    
    if (currentUser.email === selectedUserForReset.email) {
      const updatedCurrentUser = { ...currentUser, password: resetPasswordValue }
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser))
      setCurrentUser(updatedCurrentUser)
    }
    
    setShowResetPasswordModal(false)
    setResetPasswordValue('')
    setSelectedUserForReset(null)
    
    alert(`Password reset for ${selectedUserForReset.email}. User will be prompted to change it on next login.`)
  }

  const handleUserStatusChange = (email, newStatus) => {
    const currentDate = new Date().toISOString().split('T')[0]
    const updated = allUsers.map(u => {
      if (u.email === email) {
        const updatedUser = { ...u, status: newStatus }
        // If status is changed to Revoked, set removedAt date
        if (newStatus === 'Revoked' && u.removedAt === null) {
          updatedUser.removedAt = currentDate
        }
        // If status is changed from Revoked to something else, clear removedAt
        if (newStatus !== 'Revoked' && u.status === 'Revoked') {
          updatedUser.removedAt = null
        }
        return updatedUser
      }
      return u
    })
    
    localStorage.setItem('intranetUsers', JSON.stringify(updated))
    setAllUsers(updated)
    alert(`Status updated for ${email}`)
  }

  const signOut = () => {
    localStorage.removeItem('currentUser')
    navigate('/login')
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const firstName = currentUser?.name?.split(' ')[0] || 'User'

  return (
    <>
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#020410',
        color: '#e2e8f0',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        <Header />
        <ControlsBar />

        {localStorage.getItem('showPasswordChangeBanner') === 'true' && (
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            padding: '15px',
            textAlign: 'center',
            fontSize: '1rem',
            fontWeight: 'bold',
            marginBottom: '20px'
          }}>
            ⚠️ Please change your password. This password was set by an administrator.
          </div>
        )}

        <div style={{ 
          display: 'flex', 
          padding: '40px 20px', 
          gap: '60px', 
          maxWidth: '1400px', 
          margin: '0 auto',
          alignItems: 'flex-start'
        }}>
          
          <div style={{
            flex: '0 0 400px',
            background: 'var(--widget-bg)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
            border: '1px solid rgba(96,165,250,0.1)',
            height: 'fit-content'
          }}>
            <h2 style={{
              color: '#60a5fa',
              borderBottom: '2px solid #60a5fa',
              paddingBottom: '12px',
              marginBottom: '20px',
              textAlign: 'center',
              fontSize: '1.5rem'
            }}>
              Settings
            </h2>

            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Profile Picture</label>
              <input type="file" accept="image/*" onChange={previewPic} id="profileUpload" style={{ display: 'none' }} />
              <label htmlFor="profileUpload" style={{
                display: 'inline-block',
                background: '#334155',
                color: '#e2e8f0',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>Choose Photo</label>
            </div>

            <label style={{ display: 'block', margin: '20px 0 8px', fontWeight: 'bold', fontSize: '0.9rem' }}>Email</label>
            <input type="email" value={currentUser?.email || ''} readOnly style={{
              width: '100%',
              background: '#334155',
              color: '#94a3b8',
              border: 'none',
              padding: '10px 12px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              marginBottom: '5px'
            }} />

            <label style={{ display: 'block', margin: '15px 0 8px', fontWeight: 'bold', fontSize: '0.9rem' }}>Permission Access</label>
            <input type="text" value={currentUser?.role || 'Viewer'} readOnly style={{
              width: '100%',
              background: '#334155',
              color: '#94a3b8',
              border: 'none',
              padding: '10px 12px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              marginBottom: '5px'
            }} />

            <label style={{ display: 'block', margin: '15px 0 8px', fontWeight: 'bold', fontSize: '0.9rem' }}>Change Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" style={{
              width: '100%',
              background: '#334155',
              color: '#e2e8f0',
              border: 'none',
              padding: '10px 12px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              marginBottom: '5px'
            }} />

            <label style={{ display: 'block', margin: '15px 0 8px', fontWeight: 'bold', fontSize: '0.9rem' }}>Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone" style={{
              width: '100%',
              background: '#334155',
              color: '#e2e8f0',
              border: 'none',
              padding: '10px 12px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              marginBottom: '5px'
            }} />

            <label style={{ display: 'block', margin: '15px 0 8px', fontWeight: 'bold', fontSize: '0.9rem' }}>Birthday</label>
            <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} style={{
              width: '100%',
              background: '#334155',
              color: '#e2e8f0',
              border: 'none',
              padding: '10px 12px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              marginBottom: '20px'
            }} />

            <button onClick={updateUserInfo} style={{
              background: '#2563eb',
              color: 'white',
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '10px',
              width: '100%',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}>Update Info</button>

            <button onClick={signOut} style={{
              background: '#ef4444',
              color: 'white',
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              width: '100%',
              fontWeight: 'bold',
              fontSize: '1rem',
              marginTop: '15px',
              cursor: 'pointer'
            }}>
              Sign Out
            </button>

            <a href="/" style={{ 
              display: 'block', 
              textAlign: 'center', 
              marginTop: '15px', 
              color: '#60a5fa', 
              fontSize: '0.9rem',
              textDecoration: 'none'
            }}>
              ← Back to Homepage
            </a>
          </div>

          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}>
            <h3 style={{ 
              color: '#e2e8f0', 
              marginTop: '100px',
              marginBottom: '30px', 
              fontSize: '1.8rem', 
              fontWeight: 'normal',
              textAlign: 'center'
            }}>
              Hi {firstName}! How are we feeling today?
            </h3>
            
            <div 
              style={{
                width: '320px',
                height: '320px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '8px solid #60a5fa',
                boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                position: 'relative',
                cursor: 'move'
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                const handleMouseMove = (moveEvent) => {
                  handleProfileDrag(moveEvent)
                }
                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove)
                  document.removeEventListener('mouseup', handleMouseUp)
                  saveProfilePosition()
                }
                document.addEventListener('mousemove', handleMouseMove)
                document.addEventListener('mouseup', handleMouseUp)
                handleProfileDrag(e)
              }}
              onTouchStart={(e) => {
                const handleTouchMove = (moveEvent) => {
                  handleProfileDrag(moveEvent)
                }
                const handleTouchEnd = () => {
                  document.removeEventListener('touchmove', handleTouchMove)
                  document.removeEventListener('touchend', handleTouchEnd)
                  saveProfilePosition()
                }
                document.addEventListener('touchmove', handleTouchMove)
                document.addEventListener('touchend', handleTouchEnd)
                handleProfileDrag(e.touches[0])
              }}
            >
              <img 
                id="largeProfilePreview"
                src={localStorage.getItem('profilePicture') || "https://via.placeholder.com/340"} 
                alt="Profile Preview" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  objectPosition: `${profilePosition.x}% ${profilePosition.y}%`,
                  transition: 'object-position 0.1s ease'
                }}
              />
              
              <div style={{
                position: 'absolute',
                left: `${profilePosition.x}%`,
                top: `${profilePosition.y}%`,
                transform: 'translate(-50%, -50%)',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#ff6b6b',
                border: '2px solid white',
                pointerEvents: 'none'
              }} />
            </div>
            
            <p style={{ 
              color: '#94a3b8', 
              fontSize: '0.9rem', 
              marginTop: '15px',
              textAlign: 'center',
              maxWidth: '320px'
            }}>
              Click and drag on the image to adjust the center position
            </p>
          </div>
        </div>

        {currentUser?.email === 'mitzie@tinyurl.com' && (
          <div style={{ maxWidth: '1400px', margin: '40px auto', padding: '0 20px' }}>
            <div style={{
              background: 'var(--widget-bg)',
              borderRadius: '16px',
              padding: '25px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
              border: '1px solid rgba(96,165,250,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ color: '#60a5fa', fontSize: '1.4rem' }}>User Management (Admin Only)</h3>
                <button 
                  onClick={() => setShowAddUserModal(true)}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                >
                  + Add New User
                </button>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #475569' }}>
                      <th style={{ textAlign: 'left', padding: '10px', color: '#60a5ba' }}>Email</th>
                      <th style={{ textAlign: 'left', padding: '10px', color: '#60a5ba' }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '10px', color: '#60a5ba' }}>Password</th>
                      <th style={{ textAlign: 'left', padding: '10px', color: '#60a5ba' }}>Permission</th>
                      <th style={{ textAlign: 'left', padding: '10px', color: '#60a5ba' }}>Added On</th>
                      <th style={{ textAlign: 'left', padding: '10px', color: '#60a5ba' }}>Removed On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((user, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #475569' }}>
                        <td style={{ padding: '10px', color: '#e2e8f0' }}>{user.email}</td>
                        <td style={{ padding: '10px' }}>
                          <select 
                            value={user.status} 
                            onChange={(e) => handleUserStatusChange(user.email, e.target.value)}
                            style={{ 
                              background: '#334155', 
                              color: '#e2e8f0', 
                              padding: '6px', 
                              borderRadius: '6px', 
                              border: 'none',
                              fontSize: '0.85rem',
                              width: '100px'
                            }}
                          >
                            <option value="Active">Active</option>
                            <option value="Invited">Invited</option>
                            <option value="Revoked">Revoked</option>
                          </select>
                        </td>
                        <td style={{ padding: '10px' }}>
                          {user.isAdminGenerated ? (
                            <div>
                              <span style={{ color: '#fbbf24', marginRight: '10px' }}>Admin-Generated</span>
                              {user.status === 'Active' && (
                                <button 
                                  onClick={() => {
                                    setSelectedUserForReset(user)
                                    setShowResetPasswordModal(true)
                                  }}
                                  style={{
                                    background: '#3b82f6',
                                    color: 'white',
                                    padding: '4px 8px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem'
                                  }}
                                >
                                  Reset Password
                                </button>
                              )}
                            </div>
                          ) : (
                            <span style={{ color: '#86efac' }}>User-Set</span>
                          )}
                        </td>
                        <td style={{ padding: '10px' }}>
                          <select 
                            value={user.role} 
                            onChange={(e) => updateUserRole(user.email, e.target.value)}
                            style={{ 
                              background: '#334155', 
                              color: '#e2e8f0', 
                              padding: '6px', 
                              borderRadius: '6px', 
                              border: 'none',
                              fontSize: '0.85rem',
                              width: '100px'
                            }}
                          >
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Viewer">Viewer</option>
                          </select>
                        </td>
                        <td style={{ padding: '10px', color: '#cbd5e1' }}>
                          {formatDate(user.createdAt)}
                        </td>
                        <td style={{ padding: '10px', color: user.removedAt ? '#ef4444' : '#cbd5e1' }}>
                          {user.removedAt ? formatDate(user.removedAt) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {showAddUserModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#1e293b',
              padding: '30px',
              borderRadius: '16px',
              width: '500px',
              maxWidth: '90%',
              border: '1px solid #60a5fa'
            }}>
              <h3 style={{ color: '#60a5fa', marginBottom: '20px', textAlign: 'center' }}>Add New User</h3>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#e2e8f0', fontSize: '0.9rem' }}>Email *</label>
                <input 
                  type="email" 
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                  placeholder="user@company.com"
                  style={{
                    width: '100%',
                    background: '#334155',
                    color: '#e2e8f0',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#e2e8f0', fontSize: '0.9rem' }}>Full Name *</label>
                <input 
                  type="text" 
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    background: '#334155',
                    color: '#e2e8f0',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#e2e8f0', fontSize: '0.9rem' }}>Password *</label>
                <input 
                  type="password" 
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                  placeholder="Minimum 8 chars with 2 character types"
                  style={{
                    width: '100%',
                    background: '#334155',
                    color: '#e2e8f0',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#e2e8f0', fontSize: '0.9rem' }}>Role</label>
                  <select 
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({...newUserData, role: e.target.value})}
                    style={{
                      width: '100%',
                      background: '#334155',
                      color: '#e2e8f0',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#e2e8f0', fontSize: '0.9rem' }}>Status</label>
                  <select 
                    value={newUserData.status}
                    onChange={(e) => setNewUserData({...newUserData, status: e.target.value})}
                    style={{
                      width: '100%',
                      background: '#334155',
                      color: '#e2e8f0',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="Invited">Invited</option>
                    <option value="Revoked">Revoked</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#e2e8f0', fontSize: '0.9rem' }}>Phone</label>
                  <input 
                    type="tel" 
                    value={newUserData.phone}
                    onChange={(e) => setNewUserData({...newUserData, phone: e.target.value})}
                    placeholder="Optional"
                    style={{
                      width: '100%',
                      background: '#334155',
                      color: '#e2e8f0',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#e2e8f0', fontSize: '0.9rem' }}>Birthday</label>
                  <input 
                    type="date" 
                    value={newUserData.birthday}
                    onChange={(e) => setNewUserData({...newUserData, birthday: e.target.value})}
                    style={{
                      width: '100%',
                      background: '#334155',
                      color: '#e2e8f0',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={handleAddNewUser}
                  style={{
                    flex: 1,
                    background: '#10b981',
                    color: 'white',
                    padding: '12px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Add User
                </button>
                <button 
                  onClick={() => setShowAddUserModal(false)}
                  style={{
                    flex: 1,
                    background: '#6b7280',
                    color: 'white',
                    padding: '12px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showResetPasswordModal && selectedUserForReset && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#1e293b',
              padding: '30px',
              borderRadius: '16px',
              width: '400px',
              maxWidth: '90%',
              border: '1px solid #60a5fa'
            }}>
              <h3 style={{ color: '#60a5fa', marginBottom: '20px', textAlign: 'center' }}>
                Reset Password for {selectedUserForReset.email}
              </h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#e2e8f0', fontSize: '0.9rem' }}>New Password *</label>
                <input 
                  type="password" 
                  value={resetPasswordValue}
                  onChange={(e) => setResetPasswordValue(e.target.value)}
                  placeholder="Minimum 8 chars with 2 character types"
                  style={{
                    width: '100%',
                    background: '#334155',
                    color: '#e2e8f0',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={handleResetPassword}
                  style={{
                    flex: 1,
                    background: '#3b82f6',
                    color: 'white',
                    padding: '12px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Reset Password
                </button>
                <button 
                  onClick={() => {
                    setShowResetPasswordModal(false)
                    setResetPasswordValue('')
                    setSelectedUserForReset(null)
                  }}
                  style={{
                    flex: 1,
                    background: '#6b7280',
                    color: 'white',
                    padding: '12px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <footer style={{ 
          background: '#1e40af', 
          padding: '20px', 
          textAlign: 'center', 
          fontSize: '0.8rem',
          marginTop: '40px'
        }}>
          <strong>CONFIDENTIALITY CAUTION AND DISCLAIMER</strong><br />
          This message is intended only for the use of the individual(s) or entity (ies) to which it is addressed and contains information that is legally privileged and confidential. If you are not the intended recipient, or the person responsible for delivering the message to the intended recipient, you are hereby notified that any dissemination, distribution or copying of this communication is strictly prohibited. All unintended recipients are obliged to delete this message and destroy any printed copies.
        </footer>
      </div>
    </>
  )
}