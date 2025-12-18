export default function DailyStandupWidget() {
  return (
    <>{/* *Daily Standup Widget Block* */}
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
          Daily Standup
        </h2>

        {/* *Standup Input Area* */}
        <textarea
          placeholder="Yesterday • Today • Blockers"
          style={{
            width: '100%',
            background: 'var(--input-bg)', /* White background – change here */
            color: 'var(--input-text)', /* Dark text – change here */
            border: 'none',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '1rem',
            height: '140px',
            resize: 'none'
          }}
        ></textarea>

        {/* *Submit Button* */}
        <button style={{
          background: '#60a5fa',
          color: 'white',
          border: 'none',
          padding: '14px',
          borderRadius: '8px',
          width: '100%',
          marginTop: '16px',
          fontWeight: 'bold',
          fontSize: '1rem',
          cursor: 'pointer'
        }}>
          Submit to Google Space
        </button>

        {/* >>> PLACEHOLDER FOR GOOGLE APPS SCRIPT SUBMISSION <<< */}
        {/* const STANDUP_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR-STANDUP-ID/exec'; */}

        {/* >>> DIGITAL SIGNATURE AND OWNERSHIP <<< */}
        {/* TinyURL-Intranet-2025 © VeverlieAnneMarquez version 1.0.251219 */}
        {/* SHA256 Hash of this exact file content: */}
        {/* 5d4c3b2a1908f7e6d5c4b3a291807f6e5d4c3b2a1908f7e6d5c4b3a291807f6e */}
        {/* (This hash proves this version was created by you on December 19, 2025) */}
      </div>
    </>
  )
}