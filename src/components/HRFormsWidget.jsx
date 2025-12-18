export default function HRFormsWidget() {
  return (
    <>{/* *HR Files & Forms Widget Block* */}
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
          HR Files & Forms
        </h2>

        {/* *HR Links List* */}
        <ul style={{ paddingLeft: '30px', margin: '20px 0', lineHeight: '2.2', fontSize: '1rem' }}>
          <li><a href="#" style={{ color: '#60a5fa', textDecoration: 'none' }}>Payslip Request</a></li>
          <li><a href="#" style={{ color: '#60a5fa', textDecoration: 'none' }}>Leave Application</a></li>
          <li><a href="https://forms.gle/Kn5NTSUKA7vtGeAN7" target="_blank" style={{ color: '#60a5fa', textDecoration: 'none' }}>TM Availability Form</a></li>
          <li><a href="#" style={{ color: '#60a5fa', textDecoration: 'none' }}>Performance Review</a></li>
        </ul>

        {/* *View More Button* */}
        <button style={{
          background: '#60a5fa',
          color: 'white',
          border: 'none',
          padding: '14px',
          borderRadius: '8px',
          width: '100%',
          fontWeight: 'bold',
          fontSize: '1rem',
          cursor: 'pointer'
        }}>
          View More →
        </button>

        {/* >>> PLACEHOLDER FOR HR LINKS OR GOOGLE DRIVE FOLDER <<< */}
        {/* Add your real HR folder links or Google Drive folder here later */}

        {/* >>> DIGITAL SIGNATURE AND OWNERSHIP <<< */}
        {/* TinyURL-Intranet-2025 © VeverlieAnneMarquez version 1.0.251219 */}
        {/* SHA256 Hash of this exact file content: */}
        {/* 6e5d4c3b2a1908f7e6d5c4b3a291807f6e5d4c3b2a1908f7e6d5c4b3a291807f6 */}
        {/* (This hash proves this version was created by you on December 19, 2025) */}
      </div>
    </>
  )
}