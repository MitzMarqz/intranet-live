import { useEffect, useState } from 'react'

export default function ControlsBar() {
  const [utcTime, setUtcTime] = useState('')

  useEffect(() => {
    const updateUTC = () => {
      const now = new Date()
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
      
      setUtcTime(`${formatter.format(now)} UTC`)
    }

    updateUTC()
    const interval = setInterval(updateUTC, 1000)
    return () => clearInterval(interval)
  }, [])

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
      
    </div>
  )
}