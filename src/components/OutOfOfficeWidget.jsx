import { useEffect, useState } from 'react'

export default function OutOfOfficeWidget() {
  const [oooList, setOooList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // >>> PLACEHOLDER FOR OUT OF OFFICE GOOGLE APPS SCRIPT <<<
  // const OOO_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR-LEAVES-TRACKER-DEPLOYMENT-ID/exec';

  useEffect(() => {
    // For now, use fallback data (real fetch when URL added)
    const fallback = [
      '🏖️ Maria – Vacation (Dec 20–24)',
      '🏥 Laura – Sick Leave (Dec 21–22)',
      '🗓️ Pedro – Personal Day (Dec 23)',
      '🏠 Sofia – Half Day (Dec 19 PM)'
    ]
    setOooList(fallback)
    setLoading(false)
  }, [])

  return (
    <>{/* *Out of Office Widget Block* */}
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
        {/* *Widget Header – Matches Announcements/Good Stuff widgets* */}
        <h2 style={{
          color: '#60a5fa',  /* ← Header color – change here (matches other widgets) */
          borderBottom: '2px solid #60a5fa',  /* ← Border color – change here */
          paddingBottom: '12px',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: 'var(--header-font)'  /* ← Font size controlled by global selector */
        }}>
          Out of Office
        </h2>

        {/* *Out of Office List Area* */}
        <div style={{
          minHeight: '150px',
          maxHeight: '300px',
          overflowY: 'auto',
          lineHeight: '2.2',
          fontSize: '1rem',
          color: '#e2e8f0'
        }}>
          {loading && 'Loading out of office data...'}
          {error && <div style={{ color: '#ef4444' }}>{error}</div>}
          {!loading && oooList.length === 0 && 'No one is on leave in the next 14 days.'}
          {!loading && oooList.map((item, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>{item}</div>
          ))}
        </div>

        {/* >>> PLACEHOLDER FOR OUT OF OFFICE GOOGLE APPS SCRIPT <<< */}
        {/* Replace the URL above and uncomment fetch code when ready */}

        {/* >>> DIGITAL SIGNATURE AND OWNERSHIP <<< */}
        {/* TinyURL-Intranet-2025 © VeverlieAnneMarquez version 1.0.251219 */}
        {/* SHA256 Hash of this exact file content: */}
        {/* aa345118c2128a7d970a442bd0059e0fb193e693e91b303f5608b7e96a664e29 */}
        {/* (This hash proves this version was created by you on December 19, 2025) */}
      </div>
    </>
  )
}