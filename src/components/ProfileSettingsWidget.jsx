import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProfileSettingsWidget() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  const [team, setTeam] = useState('')
  const [phone, setPhone] = useState('')
  const [birthday, setBirthday] = useState('')
  const [onboardingDate, setOnboardingDate] = useState('')
  const [personalEmail, setPersonalEmail] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('')

  /* ================= LOGOUT ================= */
  const logout = () => {
    sessionStorage.clear()
    navigate('/login')
  }

  /* ================= LOAD USER ================= */
  useEffect(() => {
  const u = JSON.parse(sessionStorage.getItem('currentUser') || 'null')
  if (!u || !u.email) {
    navigate('/login')
    return
  }

  // Step 1: always set what login already knows
  setUser(u)

  // Step 2: fetch full profile from Google Sheets
  fetch('/api/google?endpoint=users')
    .then(res => res.json())
    .then(json => {
      if (!json.success || !Array.isArray(json.users)) return

      const full = json.users.find(
        r => String(r.Email).toLowerCase() === u.email.toLowerCase()
      )

      if (!full) return

      setTeam(full.Team || '')
      setBirthday(full.Birthday || '')
      setOnboardingDate(full['Onboarding Date'] || '')
      setPersonalEmail(full['Personal Email'] || '')
      setState(full.State || '')
      setCountry(full.Country || '')

      if (full.Phone) {
        const p = String(full.Phone).replace(/^'/, '').split(' ')
        setPhone(u.phone || '')
      }
    })
    .catch(err => {
      console.error('Profile load failed:', err)
    })
}, [navigate])


  /* ================= SAVE PROFILE (LOCAL UI ONLY) ================= */
  const saveProfile = () => {
    const updated = {
      ...user,
      team,
      phone, // ✅ correct — single value, includes +
      birthday,
      onboardingDate,
      personalEmail,
      state,
      country
      }
      
      sessionStorage.setItem('currentUser', JSON.stringify(updated))
      setUser(updated)
      alert('Profile updated')
    }


  const avatarSrc =
    user?.avatar ||
    localStorage.getItem('profilePicture') ||
    `${import.meta.env.BASE_URL}default-avatar.png`

  const uploadAvatar = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      const updated = { ...user, avatar: ev.target.result }
      sessionStorage.setItem('currentUser', JSON.stringify(updated))
      localStorage.setItem('profilePicture', ev.target.result)
      setUser(updated)

      const headerImg = document.getElementById('headerProfilePic')
      if (headerImg) headerImg.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

  if (!user) return null

  return (
    <div className="widget">
      <h3 style={header}>Profile Settings</h3>
      <div style={divider} />

      <div style={grid}>
        <div style={avatarCol}>
          <img src={avatarSrc} alt="profile" style={avatar} />

          <label htmlFor="upload-avatar" style={uploadLink}>
            Upload Profile Image
          </label>

          <input
            type="file"
            hidden
            id="upload-avatar"
            accept="image/*"
            onChange={uploadAvatar}
          />
        </div>

        <ReadOnly label="Name" value={user.name || ''} />
        <ReadOnly label="Email" value={user.email || ''} />
        <ReadOnly label="Password" value="••••••••" />
        <ReadOnly label="Onboarding Date" value={onboardingDate || ''} />

        <Editable label="Team" value={team} set={setTeam} />
        <PhoneInput
        label="Phone"
        value={phone}
        set={setPhone}
        />


        <Editable label="Birthday" type="date" value={birthday} set={setBirthday} />
        <Editable
          label="Personal Email"
          type="email"
          value={personalEmail}
          set={setPersonalEmail}
        />

        <Editable label="State" value={state} set={setState} />
        <Editable label="Country" value={country} set={setCountry} />

        <div />

        <div style={buttonRow}>
          <button style={primaryBtn} onClick={saveProfile}>
            Update
          </button>
          <button style={dangerBtn} onClick={logout}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

/* ================= STYLES (UNCHANGED) ================= */

const header = {
  fontSize: 'var(--header-font)',
  color: '#60a5fa',
  fontWeight: 600
}

const divider = {
  margin: '10px 0 20px',
  height: '2px',
  background: '#2563eb'
}

const grid = {
  display: 'grid',
  gridTemplateColumns: '140px repeat(4, 1fr)',
  gap: '14px',
  alignItems: 'end'
}

const avatarCol = {
  gridRow: '1 / span 4',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start'
}

const avatar = {
  width: '145px',
  height: '145px',
  borderRadius: '65%',
  border: '4px solid #8b5cf6',
  objectFit: 'cover',
  marginBottom: '25px'
}

const uploadLink = {
  fontSize: 'var(--font-base)',
  color: '#60a5fa',
  cursor: 'pointer',
  textDecoration: 'underline'
}

const input = {
  width: '100%',
  background: '#020617',
  border: '1px solid #334155',
  borderRadius: '10px',
  padding: '8px',
  fontSize: 'var(--font-base)',
  color: '#e5e7eb'
}

const label = {
  fontSize: 'var(--font-base)',
  color: '#94a3b8'
}

const buttonRow = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '14px'
}

const primaryBtn = {
  background: '#2563eb',
  borderRadius: '10px',
  border: 'none',
  color: '#fff',
  height: '38px',
  fontSize: 'var(--font-base)',
  cursor: 'pointer'
}

const dangerBtn = {
  ...primaryBtn,
  background: '#ef4444'
}

/* ================= FIELDS ================= */

function ReadOnly({ label: l, value }) {
  return (
    <div>
      <label style={label}>{l}</label>
      <input style={{ ...input, opacity: 0.6 }} value={value} readOnly />
    </div>
  )
}

function Editable({ label: l, value, set, type = 'text' }) {
  return (
    <div>
      <label style={label}>{l}</label>
      <input
        style={input}
        type={type}
        value={value}
        onChange={(e) => set(e.target.value)}
      />
    </div>
  )
}

function PhoneInput({ label: l, value, set }) {
  return (
    <div>
      <label style={label}>{l}</label>
      <input
        style={input}
        value={value}
        placeholder="+15555555555"
        onChange={(e) => set(e.target.value)}
      />
    </div>
  )
}
