import { useEffect, useState } from 'react'

export default function ControlsBar() {
  const [utcTime, setUtcTime] = useState('')

  useEffect(() => {
    const updateUTC = () => {
      const now = new Date()
      const time = now.toLocaleTimeString('en-GB', { 
        timeZone: 'UTC', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false 
      })
      setUtcTime(time + ' UTC')
    }
    updateUTC()
    const interval = setInterval(updateUTC, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleFontChange = (e) => {
    const value = e.target.value
    let base, header
    if (value === '10px') { base = '10px'; header = '12px' }
    else if (value === '13px') { base = '13px'; header = '15px' }
    else { base = '15px'; header = '18px' }

    document.documentElement.style.setProperty('--font-base', base)
    document.documentElement.style.setProperty('--header-font', header)
  }

  return (
    <div style={{
      background: '#1e40af',
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: '24px'
    }}>
      <div style={{ fontWeight: 'bold', color: '#94a3b8', fontSize: '1.05rem' }}>
        UTC Time: <span>{utcTime}</span>
      </div>
      <select 
        onChange={handleFontChange} 
        defaultValue="13px"
        style={{
          background: 'white',
          color: '#2563eb',
          padding: '9px 16px',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 'bold',
          fontSize: '14px',
          cursor: 'pointer'
        }}
      >
        <option value="10px">Small</option>
        <option value="13px">Medium</option>
        <option value="15px">Big</option>
      </select>
    </div>
  )
}