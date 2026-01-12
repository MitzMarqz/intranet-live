import { useEffect, useState } from 'react'

export default function UserManagementWidget() {
  /* ============================
   * STATE
   * ============================ */
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([])

  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [showRevokeModal, setShowRevokeModal] = useState(false)

  const [addStep, setAddStep] = useState(1)
  const [resetStep, setResetStep] = useState(1)
  const [revokeStep, setRevokeStep] = useState(1)

  const [targetUser, setTargetUser] = useState(null)
  const [tempPassword, setTempPassword] = useState('')

  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Viewer',
    team: '',
    phone: '',
    onboardingDate: '',
    birthday: '',
    personalEmail: '',
    state: '',
    country: '',
    tempPassword: ''
  })

  /* ============================
   * CURRENT USER
   * ============================ */
  useEffect(() => {
    const u = JSON.parse(sessionStorage.getItem('currentUser') || 'null')
    setCurrentUser(u)
  }, [])

  /* ============================
   * LOAD USERS
   * ============================ */
  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    try {
      const res = await fetch('/api/google?endpoint=users')
      const json = await res.json()

      if (!json.success || !Array.isArray(json.users)) {
        setUsers([])
        return
      }

      const allUsers = json.users.filter(u => u.Email)

      // 🔒 ROLE FILTERING
      if (currentUser?.role === 'Manager') {
        const todayUTC = new Date().toISOString().slice(0, 10)
        setUsers(
          allUsers.filter(u =>
            u['Created At'] &&
            u['Created At'].slice(0, 10) === todayUTC
          )
        )
      } else {
        setUsers(allUsers)
      }
    } finally {
      setLoading(false)
    }
  }

  /* ============================
   * HELPERS
   * ============================ */
  const closeAllModals = () => {
    setShowAddModal(false)
    setShowResetModal(false)
    setShowRevokeModal(false)
    setAddStep(1)
    setResetStep(1)
    setRevokeStep(1)
    setProcessing(false)
    setTempPassword('')
  }

  const phoneValid = /^\+\d{2}\s\d{3}\s\d{3}\s\d{4}$/.test(newUser.phone)

  const postUsers = payload =>
    fetch('/api/google?endpoint=users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

  /* ============================
   * ADD USER
   * ============================ */
  const confirmAddUser = async () => {
    setProcessing(true)
    await postUsers({
      action: 'addUser',
      email: newUser.email,
      name: `${newUser.firstName} ${newUser.lastName}`,
      role: newUser.role,
      team: newUser.team,
      phone: newUser.phone,
      onboardingDate: newUser.onboardingDate,
      birthday: newUser.birthday,
      personalEmail: newUser.personalEmail,
      state: newUser.state,
      country: newUser.country,
      tempPassword: newUser.tempPassword
    })
    await loadUsers()
    closeAllModals()
  }

  /* ============================
   * PASSWORD OVERRIDE (ADMIN ONLY)
   * ============================ */
  const confirmReset = async () => {
    setProcessing(true)
    await postUsers({
      action: 'resetPassword',
      email: targetUser.Email,
      tempPassword
    })
    await loadUsers()
    closeAllModals()
  }

  /* ============================
   * REVOKE / RESTORE (ADMIN ONLY)
   * ============================ */
  const confirmRevoke = async () => {
    setProcessing(true)
    await postUsers({
      action: targetUser.Status === 'Active' ? 'revokeUser' : 'restoreUser',
      email: targetUser.Email
    })
    await loadUsers()
    closeAllModals()
  }

  /* ============================
   * VISIBILITY GUARD
   * ============================ */
  if (!currentUser || currentUser.role === 'Viewer') return null

  /* ============================
   * RENDER
   * ============================ */
  return (
    <div className="widget" style={{ height: 280, display: 'flex', flexDirection: 'column' }}>
      <div style={headerRow}>
        <h3 style={header}>User Management</h3>

        {(currentUser.role === 'Admin' || currentUser.role === 'Manager') && (
          <div
            style={addUserBtn}
            onClick={() => {
              closeAllModals()
              setShowAddModal(true)
            }}
          >
            Add User
          </div>
        )}
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
                <th style={th}>Role</th>
                <th style={th}>Added</th>
                <th style={th}>Removed</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i}>
                  <td style={td}>{u.Email}</td>

                  <td
                    style={{
                      ...td,
                      color: u.Status === 'Active' ? '#22c55e' : '#ef4444',
                      cursor: currentUser.role === 'Admin' ? 'pointer' : 'default'
                    }}
                    onClick={() => {
                      if (currentUser.role !== 'Admin') return
                      closeAllModals()
                      setTargetUser(u)
                      setShowRevokeModal(true)
                    }}
                  >
                    {u.Status}
                  </td>

                  <td style={td}>
                    {currentUser.role === 'Admin' && (
                      <span
                        style={{ color: '#60a5fa', cursor: 'pointer' }}
                        onClick={() => {
                          closeAllModals()
                          setTargetUser(u)
                          setShowResetModal(true)
                        }}
                      >
                        Override
                      </span>
                    )}
                  </td>

                  <td style={td}>
                    {currentUser.role === 'Admin' ? (
                      <select
                        value={u.Role}
                        onChange={async e => {
                          setProcessing(true)
                          await postUsers({
                            action: 'updateRole',
                            email: u.Email,
                            role: e.target.value
                          })
                          await loadUsers()
                          setProcessing(false)
                        }}
                      >
                        <option>Admin</option>
                        <option>Manager</option>
                        <option>Viewer</option>
                      </select>
                    ) : (
                      u.Role
                    )}
                  </td>

                  <td style={td}>{formatDate(u['Created At'])}</td>
                  <td style={td}>{formatDate(u['Removed At'])}</td>
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
                <Input label="First Name" v="firstName" setNewUser={setNewUser} />
                <Input label="Last Name" v="lastName" setNewUser={setNewUser} />
                <Input label="Email" v="email" type="email" setNewUser={setNewUser} />
                <Input label="Temporary Password" v="tempPassword" type="password" setNewUser={setNewUser} />
                <Select label="Teams" v="team" options={['Customer Experience','Development','Marketing','Operations']} setNewUser={setNewUser} />
                <Select label="Role" v="role" options={['Viewer', 'Manager']} setNewUser={setNewUser} />
                <Input label="Phone Number" v="phone" placeholder="+639123456789" error={!phoneValid} setNewUser={setNewUser} />
                <Input label="Onboarding Date" v="onboardingDate" type="date" setNewUser={setNewUser} />
                <Input label="Birthday" v="birthday" type="date" setNewUser={setNewUser} />
                <Input label="Personal Email" v="personalEmail" type="email" setNewUser={setNewUser} />
                <Input label="State" v="state" setNewUser={setNewUser} />
                <Input label="Country" v="country" setNewUser={setNewUser} />
              </div>

              <ModalActions>
                <Btn primary onClick={() => setAddStep(2)}>Continue</Btn>
                <Btn onClick={closeAllModals}>Cancel</Btn>
              </ModalActions>
            </>
          ) : (
            <>
              <h3 style={modalTitle}>Confirm New User</h3>
              <ModalActions>
                <Btn primary onClick={confirmAddUser}>
                  {processing ? 'Processing…' : 'Confirm'}
                </Btn>
                <Btn onClick={() => setAddStep(1)}>Back</Btn>
              </ModalActions>
            </>
          )}
        </Modal>
      )}

      {/* ================= RESET MODAL (ADMIN) ================= */}
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
                <Btn onClick={closeAllModals}>Cancel</Btn>
              </ModalActions>
            </>
          ) : (
            <>
              <ModalActions>
                <Btn primary onClick={confirmReset}>
                  {processing ? 'Processing…' : 'Confirm'}
                </Btn>
                <Btn onClick={() => setResetStep(1)}>Back</Btn>
              </ModalActions>
            </>
          )}
        </Modal>
      )}

      {/* ================= REVOKE MODAL (ADMIN) ================= */}
      {showRevokeModal && (
        <Modal>
          {revokeStep === 1 ? (
            <>
              <h3 style={modalTitle}>
                {targetUser.Status === 'Active' ? 'Revoke Access' : 'Restore Access'}
              </h3>
              <ModalActions>
                <Btn primary onClick={() => setRevokeStep(2)}>Continue</Btn>
                <Btn onClick={closeAllModals}>Cancel</Btn>
              </ModalActions>
            </>
          ) : (
            <>
              <ModalActions>
                <Btn primary onClick={confirmRevoke}>
                  {processing ? 'Processing…' : 'Confirm'}
                </Btn>
                <Btn onClick={() => setRevokeStep(1)}>Back</Btn>
              </ModalActions>
            </>
          )}
        </Modal>
      )}
    </div>
  )
}

/* ============================
 * HELPERS & STYLES (UNCHANGED)
 * ============================ */
const formatDate = d => (d ? new Date(d).toLocaleDateString('en-US') : '')

const headerRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
const header = { color: '#60a5fa', fontSize: '1.1rem', fontWeight: 500 }
const addUserBtn = { background: '#2563eb', padding: '6px 14px', borderRadius: 8, cursor: 'pointer' }
const divider = { height: 1, background: '#2563eb', margin: '10px 0' }
const tableScroll = { flex: 1, overflowY: 'auto' }
const table = { width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }
const th = { padding: 8, background: '#1e293b', color: '#e5e7eb' }
const td = { padding: 8, textAlign: 'center' }
const loaderText = { textAlign: 'center', padding: 20 }

const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.85)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999
}
const modal = { background: '#020617', padding: 24, borderRadius: 16, width: 620 }
const modalTitle = { color: '#60a5fa', fontWeight: 500 }
const inputStyle = {
  width: '100%',
  padding: 10,
  marginTop: 10,
  borderRadius: 10,
  background: '#020617',
  border: '1px solid #334155',
  color: '#e5e7eb'
}
const formGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }

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
        padding: '12px',
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

function Input({ label, v, type = 'text', error, setNewUser }) {
  return (
    <div>
      <label style={{ fontSize: '.75rem', color: '#94a3b8' }}>{label}</label>
      <input
        type={type}
        style={{ ...inputStyle, borderColor: error ? '#ef4444' : '#334155' }}
        onChange={e => setNewUser(prev => ({ ...prev, [v]: e.target.value }))}
      />
    </div>
  )
}

function Select({ label, v, options, setNewUser }) {
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

function handlePhoneChange(value) {
  // Remove everything except digits
  const digits = value.replace(/\D/g, '');

  // Auto-prefix +
  const formatted = digits ? `+${digits}` : '';

  setNewUser(prev => ({
    ...prev,
    phone: formatted
  }));
}

