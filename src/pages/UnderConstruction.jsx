import Header from '../components/Header'
import ControlsBar from '../components/ControlsBar'


export default function UnderConstruction({ title = 'Page Under Construction' }) {
  return (
    <>
      {/* ================= HEADER ================= */}
      <Header />

      {/* ================= CONTROLS BAR ================= */}
      <ControlsBar />

      {/* ================= MAIN CONTENT ================= */}
      <main
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#e2e8f0',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            fontSize: '4rem',
            marginBottom: '20px',
            animation: 'spin 2s linear infinite'
          }}
        >
          ⚙️
        </div>

        <h2 style={{ color: '#60a5fa', marginBottom: '8px' }}>
          {title}
        </h2>

        <p>This page is currently being built.</p>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </main>

      {/* ================= FOOTER ================= */}
      <footer
        style={{
          background: '#1e40af',
          padding: '24px',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: '#e5e7eb'
        }}
      >
        <strong>CONFIDENTIALITY CAUTION AND DISCLAIMER</strong>
        <br />
        This message is intended only for the use of the individual(s) or entity(ies)
        to which it is addressed and contains information that is legally privileged
        and confidential. If you are not the intended recipient, or the person
        responsible for delivering the message to the intended recipient, you are
        hereby notified that any dissemination, distribution or copying of this
        communication is strictly prohibited. All unintended recipients are obliged
        to delete this message and destroy any printed copies.
      </footer>
    </>
  )
}
