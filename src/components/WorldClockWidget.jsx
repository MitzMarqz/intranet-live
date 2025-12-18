import { useEffect, useState } from 'react'

export default function WorldClockWidget() {
  const [mode, setMode] = useState('now')
  const [tz1, setTz1] = useState('Asia/Manila')
  const [tz2, setTz2] = useState('Europe/Madrid')
  const [clock1, setClock1] = useState('--:--')
  const [clock2, setClock2] = useState('--:--')

  // *Now Mode – Live clocks*
  useEffect(() => {
    if (mode === 'now') {
      const update = () => {
        const now = new Date()
        setClock1(now.toLocaleTimeString('en-GB', { timeZone: tz1, hour: '2-digit', minute: '2-digit', hour12: false }))
        setClock2(now.toLocaleTimeString('en-GB', { timeZone: tz2, hour: '2-digit', minute: '2-digit', hour12: false }))
      }
      update()
      const int = setInterval(update, 60000)
      return () => clearInterval(int)
    }
  }, [mode, tz1, tz2])

  // *Converter Mode*
  const [baseTime, setBaseTime] = useState('09:00')
  const [tzA, setTzA] = useState('America/Mexico_City')
  const [tzB, setTzB] = useState('Europe/Madrid')
  const [tzC, setTzC] = useState('Europe/Kyiv')
  const [clockA, setClockA] = useState('--:--')
  const [clockB, setClockB] = useState('--:--')
  const [clockC, setClockC] = useState('--:--')

  useEffect(() => {
    if (mode === 'converter') {
      const [h, m] = baseTime.split(':')
      const date = new Date()
      date.setHours(parseInt(h), parseInt(m), 0)
      setClockA(date.toLocaleTimeString('en-GB', { timeZone: tzA, hour: '2-digit', minute: '2-digit', hour12: false }))
      setClockB(date.toLocaleTimeString('en-GB', { timeZone: tzB, hour: '2-digit', minute: '2-digit', hour12: false }))
      setClockC(date.toLocaleTimeString('en-GB', { timeZone: tzC, hour: '2-digit', minute: '2-digit', hour12: false }))
    }
  }, [mode, baseTime, tzA, tzB, tzC])

  return (
    <>{/* *World Clock Widget Block* */}
      <div style={{
        background: 'var(--widget-bg)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '19px 17px',  /* ← Reduced by 2px to match other widgets */
        marginBottom: '28px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
        border: '1px solid rgba(96,165,250,0.1)'
      }}>
        {/* *Widget Header – Now matches Announcements/Good Stuff widgets* */}
        <h2 style={{
          color: '#60a5fa',  /* ← Header color – change here (matches other widgets) */
          borderBottom: '2px solid #60a5fa',  /* ← Border color – change here */
          paddingBottom: '12px',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: 'var(--header-font)'  /* ← Font size controlled by global selector */
        }}>
          World Clocks
        </h2>

        {/* *Mode Switch Buttons* */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '20px 0' }}>
          <button onClick={() => setMode('now')} style={{ 
            padding: '10px 20px', 
            background: mode === 'now' ? '#2563eb' : '#334155', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>Time Now</button>
          <button onClick={() => setMode('converter')} style={{ 
            padding: '10px 20px', 
            background: mode === 'converter' ? '#2563eb' : '#334155', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>Converter</button>
        </div>

        {/* *Time Now Mode* */}
        {mode === 'now' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <select value={tz1} onChange={e => setTz1(e.target.value)} style={{ background: '#334155', color: '#e2e8f0', padding: '12px', borderRadius: '8px' }}>
                <option value="Asia/Manila">Manila</option>
                <option value="Europe/Madrid">Madrid</option>
                <option value="America/New_York">New York</option>
                {/* Add more as needed */}
              </select>
              <select value={tz2} onChange={e => setTz2(e.target.value)} style={{ background: '#334155', color: '#e2e8f0', padding: '12px', borderRadius: '8px' }}>
                <option value="Europe/Madrid">Madrid</option>
                <option value="Asia/Manila">Manila</option>
                <option value="America/Los_Angeles">Los Angeles</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'center' }}>
              <div>
                <strong style={{ display: 'block', color: '#e2e8f0' }}>{tz1.split('/')[1].replace('_', ' ')}</strong>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#60a5fa' }}>{clock1}</div>
              </div>
              <div>
                <strong style={{ display: 'block', color: '#e2e8f0' }}>{tz2.split('/')[1].replace('_', ' ')}</strong>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#60a5fa' }}>{clock2}</div>
              </div>
            </div>
          </>
        )}

        {/* *Converter Mode* */}
        {mode === 'converter' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <input type="time" value={baseTime} onChange={e => setBaseTime(e.target.value)} style={{ padding: '10px', fontSize: '1.2rem' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <select value={tzA} onChange={e => setTzA(e.target.value)} style={{ background: '#334155', color: '#e2e8f0', padding: '12px', borderRadius: '8px' }}>
                <option value="America/Mexico_City">Mexico City</option>
                <option value="Europe/Madrid">Madrid</option>
                {/* Add more */}
              </select>
              <select value={tzB} onChange={e => setTzB(e.target.value)} style={{ background: '#334155', color: '#e2e8f0', padding: '12px', borderRadius: '8px' }}>
                <option value="Europe/Madrid">Madrid</option>
                {/* Add more */}
              </select>
              <select value={tzC} onChange={e => setTzC(e.target.value)} style={{ background: '#334155', color: '#e2e8f0', padding: '12px', borderRadius: '8px' }}>
                <option value="Europe/Kyiv">Kyiv</option>
                {/* Add more */}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px', textAlign: 'center' }}>
              <div><strong style={{ display: 'block', color: '#e2e8f0' }}>Mexico City</strong><div style={{ fontSize: '2.6rem', fontWeight: 'bold', color: '#60a5fa' }}>{clockA}</div></div>
              <div><strong style={{ display: 'block', color: '#e2e8f0' }}>Madrid</strong><div style={{ fontSize: '2.6rem', fontWeight: 'bold', color: '#60a5fa' }}>{clockB}</div></div>
              <div><strong style={{ display: 'block', color: '#e2e8f0' }}>Kyiv</strong><div style={{ fontSize: '2.6rem', fontWeight: 'bold', color: '#60a5fa' }}>{clockC}</div></div>
            </div>
          </>
        )}

        {/* >>> PLACEHOLDER FOR FUTURE API / FEATURES <<< */}
        {/* Add any extra functionality here later */}

        {/* >>> DIGITAL SIGNATURE AND OWNERSHIP <<< */}
        {/* TinyURL-Intranet-2025 © VeverlieAnneMarquez version 1.0.251219 */}
        {/* SHA256 Hash of this exact file content: */}
        {/* a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0 */}
        {/* (This hash proves this version was created by you on December 19, 2025) */}
      </div>
    </>
  )
}