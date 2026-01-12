import { useEffect, useState } from 'react'

export default function WorldClockWidget() {
  const LOCATIONS = [
    { label: 'Kyiv, Ukraine', tz: 'Europe/Kyiv' },
    { label: 'Manila, Philippines', tz: 'Asia/Manila' },
    { label: 'Lahore, Pakistan', tz: 'Asia/Karachi' },
    { label: 'Prince Edward Island, Canada', tz: 'America/Halifax' },
    { label: 'Yerevan, Armenia', tz: 'Asia/Yerevan' },
    { label: 'Ancon, Panama', tz: 'America/Panama' },
    { label: 'Trybunalski, Poland', tz: 'Europe/Warsaw' },
    { label: 'Tbilisi, Georgia', tz: 'Asia/Tbilisi' },
    { label: 'Vilnius, Lithuania', tz: 'Europe/Vilnius' },
    { label: 'Mexico City, Mexico', tz: 'America/Mexico_City' },
    { label: 'Madrid, Spain', tz: 'Europe/Madrid' },
    { label: 'New York, New York', tz: 'America/New_York' },
    { label: 'Bangkok, Thailand', tz: 'Asia/Bangkok' },
    { label: 'London, England', tz: 'Europe/London' }
  ]

  const getLabel = tz =>
    LOCATIONS.find(l => l.tz === tz)?.label || tz

  const [mode, setMode] = useState('now')

  const [tz1, setTz1] = useState('Asia/Manila')
  const [tz2, setTz2] = useState('Europe/Madrid')
  const [clock1, setClock1] = useState('--:--')
  const [clock2, setClock2] = useState('--:--')

  const [baseTime, setBaseTime] = useState('09:00')
  const [tzA, setTzA] = useState('Europe/Madrid')
  const [tzB, setTzB] = useState('Asia/Manila')
  const [tzC, setTzC] = useState('America/Panama')
  const [clockA, setClockA] = useState('--:--')
  const [clockB, setClockB] = useState('--:--')
  const [clockC, setClockC] = useState('--:--')

  useEffect(() => {
    if (mode !== 'now') return
    const update = () => {
      const now = new Date()
      setClock1(now.toLocaleTimeString('en-GB', { timeZone: tz1, hour: '2-digit', minute: '2-digit', hour12: false }))
      setClock2(now.toLocaleTimeString('en-GB', { timeZone: tz2, hour: '2-digit', minute: '2-digit', hour12: false }))
    }
    update()
    const int = setInterval(update, 60000)
    return () => clearInterval(int)
  }, [mode, tz1, tz2])

  useEffect(() => {
    if (mode !== 'converter') return
    const [h, m] = baseTime.split(':')
    const date = new Date()
    date.setHours(parseInt(h), parseInt(m), 0)
    setClockA(date.toLocaleTimeString('en-GB', { timeZone: tzA, hour: '2-digit', minute: '2-digit', hour12: false }))
    setClockB(date.toLocaleTimeString('en-GB', { timeZone: tzB, hour: '2-digit', minute: '2-digit', hour12: false }))
    setClockC(date.toLocaleTimeString('en-GB', { timeZone: tzC, hour: '2-digit', minute: '2-digit', hour12: false }))
  }, [mode, baseTime, tzA, tzB, tzC])

  return (
    <div style={{
      background: 'var(--widget-bg)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '19px 17px',
      marginBottom: '28px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
      border: '1px solid rgba(96,165,250,0.1)'
    }}>
      <h2 style={{
        color: '#60a5fa',
        borderBottom: '2px solid #60a5fa',
        paddingBottom: '12px',
        marginBottom: '20px',
        textAlign: 'center',
        fontSize: 'var(--header-font)'
      }}>
        World Clocks
      </h2>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '20px 0' }}>
        <button onClick={() => setMode('now')} style={mode === 'now' ? activeBtn : inactiveBtn}>Time Now</button>
        <button onClick={() => setMode('converter')} style={mode === 'converter' ? activeBtn : inactiveBtn}>Converter</button>
      </div>

      {mode === 'now' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <select value={tz1} onChange={e => setTz1(e.target.value)} style={selectStyle}>
              {LOCATIONS.map(l => <option key={l.tz} value={l.tz}>{l.label}</option>)}
            </select>
            <select value={tz2} onChange={e => setTz2(e.target.value)} style={selectStyle}>
              {LOCATIONS.map(l => <option key={l.tz} value={l.tz}>{l.label}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'center' }}>
            <Clock label={getLabel(tz1)} value={clock1} size="large" />
            <Clock label={getLabel(tz2)} value={clock2} size="large" />
          </div>
        </>
      )}

      {mode === 'converter' && (
        <>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <input type="time" value={baseTime} onChange={e => setBaseTime(e.target.value)} style={{ padding: '10px', fontSize: '1.2rem' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            {[tzA, tzB, tzC].map((tz, i) => (
              <select
                key={i}
                value={tz}
                onChange={e => [setTzA, setTzB, setTzC][i](e.target.value)}
                style={selectStyle}
              >
                {LOCATIONS.map(l => <option key={l.tz} value={l.tz}>{l.label}</option>)}
              </select>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px', textAlign: 'center' }}>
            <Clock label={getLabel(tzA)} value={clockA} />
            <Clock label={getLabel(tzB)} value={clockB} />
            <Clock label={getLabel(tzC)} value={clockC} />
          </div>
        </>
      )}
    </div>
  )
}

/* ================= COMPONENTS ================= */

const Clock = ({ label, value, size }) => (
  <div>
    <strong style={{ display: 'block', color: '#e2e8f0' }}>{label}</strong>
    <div style={{
      fontSize: size === 'large' ? '2.4rem' : '2.1rem',
      fontWeight: 'bold',
      color: '#60a5fa',
      whiteSpace: 'nowrap'
    }}>
      {value}
    </div>
  </div>
)

const selectStyle = {
  background: '#334155',
  color: '#e2e8f0',
  padding: '12px',
  borderRadius: '8px',
  width: '100%'
}

const activeBtn = {
  padding: '10px 20px',
  background: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer'
}

const inactiveBtn = {
  ...activeBtn,
  background: '#334155'
}
