import { useEffect, useState } from 'react'

export default function UserManagementWidget() {
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([])

  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)

  const [addStep, setAddStep] = useState(1)
  const [resetStep, setResetStep] = useState(1)

  const [targetUser, setTargetUser] = useState(null)

  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Viewer',
    team: '',
    phone: '',
    birthday: '',
    personalEmail: '',
    state: '',
    country: '',
    onboardingDate: '',
    tempPassword: ''
  })

  const [tempPassword, setTempPassword] = useState('')

  /* ================= CURRENT USER ================= */
  useEffect(() => {
    const u = JSON.parse(sessionStorage.getItem('currentUser') || 'null')
    setCurrentUser(u)
  }, [])

  if (!currentUser || currentUser.role !== 'Admin') return null

  /* ================= LOAD USERS ================= */
  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      setLoading(true)
      const res = await fetch('/api/google?endpoint=users')
      const json = await res.json()

      if (!json.success || !Array.isArray(json.users)) {
        setUsers([])
        return
      }

      setUsers(
        json.users
          .filter(u => u.Email)
          .map(u => ({
            email: u.Email,
            status: u.Status,
            role: u.Role,
            createdAt: u['Created At'],
            removedAt: u['Removed At']
          }))
      )
    } finally {
      setLoading(false)
    }
  }

  const post = (action, payload) =>
    fetch('/api/google?endpoint=users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload })
    })

  /* ================= ADD USER ================= */
  const addUser = async () => {
    setProcessing(true)

    await post('addUser', {
      email: newUser.email,
      name: `${newUser.firstName} ${newUser.lastName}`,
      role: newUser.role,
      team: newUser.team,
      phone: newUser.phone,
      birthday: newUser.birthday,
      personalEmail: newUser.personalEmail,
      state: newUser.state,
      country: newUser.country,
      onboardingDate: newUser.onboardingDate,
      tempPassword: newUser.tempPassword
    })

    await loadUsers()
    setProcessing(false)
    setShowAddModal(false)
    setAddStep(1)
  }

  /* ================= RESET PASSWORD ================= */
  const confirmReset = async () => {
    setProcessing(true)

    await post('resetPassword', {
      email: targetUser.email,
      tempPassword
    })

    setProcessing(false)
    setShowResetModal(false)
    setResetStep(1)
    setTempPassword('')
  }

  const phoneValid = /^[+0-9\s()-]{7,20}$/.test(newUser.phone)

  return (
    <div className="widget" style={{ height: 260, display: 'flex', flexDirection: 'column' }}>
      <div style={headerRow}>
        <h3 style={header}>User Management</h3>
        <h3
          style={addUserBtn}
          onClick={() => {
            if (!showResetModal) setShowAddModal(true)
          }}
        >
          Add User
        </h3>
      </div>

      <div style={divider} />

      <div style={tableScroll}>
        {loading ? (
          <div style={loaderText}>Loading…</div>
        ) : (
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Email</th>
                <th style={th}>Status</th>
                <th style={th}>Password</th>
                <th style={th}>Permission</th>
                <th style={th}>Added</th>
                <th style={th}>Removed</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i}>
                  <td style={td}>{u.email}</td>
                  <td style={td}>{u.status}</td>
                  <td style={td}>
                    <button
                      style={actionBtn}
                      onClick={() => {
                        if (!showAddModal) {
                          setTargetUser(u)
                          setShowResetModal(true)
                        }
                      }}
                    >
                      Override
                    </button>
                  </td>
                  <td style={td}>{u.role}</td>
                  <td style={td}>{formatDate(u.createdAt)}</td>
                  <td style={td}>{formatDate(u.removedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= ADD USER MODAL ================= */}
      {showAddModal && (
        <Modal>
          {addStep === 1 ? (
            <>
              <h3 style={modalTitle}>Add New User</h3>

              <div style={formGrid}>
                <Input label="First Name" v="firstName" />
                <Input label="Last Name" v="lastName" />
                <Input label="Email" v="email" />
                <Input label="Temporary Password" v="tempPassword" type="password" />
                <Select label="Role" v="role" options={['Admin', 'Manager', 'Viewer']} />
                <Input label="Phone" v="phone" error={!phoneValid} />
              </div>

              <ModalActions>
                <Btn primary onClick={() => setAddStep(2)}>Continue</Btn>
                <Btn onClick={() => setShowAddModal(false)}>Cancel</Btn>
              </ModalActions>
            </>
          ) : (
            <>
              <h3 style={modalTitle}>Confirm New User</h3>
              <p>Please confirm the information before adding this user.</p>

              <ModalActions>
                <Btn primary onClick={addUser}>
                  {processing ? 'Adding…' : 'Confirm'}
                </Btn>
                <Btn onClick={() => setAddStep(1)}>Go Back</Btn>
              </ModalActions>
            </>
          )}
        </Modal>
      )}

      {/* ================= RESET MODAL ================= */}
      {showResetModal && (
        <Modal>
          {resetStep === 1 ? (
            <>
              <h3 style={modalTitle}>Password Override</h3>
              <input
                style={inputStyle}
                placeholder="Temporary Password"
                value={tempPassword}
                onChange={e => setTempPassword(e.target.value)}
              />

              <ModalActions>
                <Btn primary onClick={() => setResetStep(2)}>Continue</Btn>
                <Btn onClick={() => setShowResetModal(false)}>Cancel</Btn>
              </ModalActions>
            </>
          ) : (
            <>
              <h3 style={modalTitle}>Confirm Override</h3>
              <p>This will force the user to change their password.</p>

              <ModalActions>
                <Btn primary onClick={confirmReset}>
                  {processing ? 'Processing…' : 'Confirm'}
                </Btn>
                <Btn onClick={() => setResetStep(1)}>Go Back</Btn>
              </ModalActions>
            </>
          )}
        </Modal>
      )}
    </div>
  )
}

/* ================= HELPERS ================= */
const formatDate = d => (d ? new Date(d).toLocaleDateString('en-US') : '')

/* ================= STYLES ================= */
const headerRow = { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
const header = { color: '#60a5fa', fontSize: '1.1rem', fontWeight: 500 }
const addUserBtn = { height: '1.6rem', padding: '0 14px', borderRadius: 8, background: '#2563eb', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }
const divider = { height: 1, background: '#2563eb', margin: '10px 0' }
const tableScroll = { flex: 1, overflowY: 'auto' }
const table = { width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }
const th = { padding: '8px', background: '#1e3a8a', color: '#e5e7eb' }
const td = { padding: '8px', textAlign: 'center' }
const actionBtn = { height: '1.6rem', padding: '0 14px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }
const loaderText = { textAlign: 'center', opacity: 0.9, padding: 20 }

const overlay = { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', padding: 12 }
const modal = { background: '#020617', padding: 24, borderRadius: 16, width: 520, margin: '0 auto' }
const modalTitle = { color: '#60a5fa', fontWeight: 500 }
const inputStyle = { width: '100%', padding: 10, marginTop: 12, borderRadius: 10, background: '#020617', border: '1px solid #334155', color: '#e5e7eb' }
const formGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }

/* ================= COMPONENTS ================= */
function Modal({ children }) {
  return (
    <div style={overlay}>
      <div style={modal}>{children}</div>
    </div>
  )
}

function ModalActions({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>{children}</div>
}

function Btn({ children, primary, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px',
        fontSize: '1.1rem',
        borderRadius: 10,
        border: 'none',
        cursor: 'pointer',
        background: primary ? '#2563eb' : '#334155',
        color: '#fff'
      }}
    >
      {children}
    </button>
  )
}

function Input({ label, v, type = 'text', error }) {
  return (
    <div>
      <label style={{ fontSize: '.75rem', color: '#94a3b8' }}>{label}</label>
      <input
        type={type}
        style={{
          ...inputStyle,
          borderColor: error ? '#ef4444' : '#334155'
        }}
        onChange={e => setNewUser(prev => ({ ...prev, [v]: e.target.value }))}
      />
    </div>
  )
}

function Select({ label, v, options }) {
  return (
    <div>
      <label style={{ fontSize: '.75rem', color: '#94a3b8' }}>{label}</label>
      <select
        style={inputStyle}
        onChange={e => setNewUser(prev => ({ ...prev, [v]: e.target.value }))}
      >
        {options.map(o => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  )
}
