import Header from '../components/Header.jsx'
import ControlsBar from '../components/ControlsBar.jsx'
import ProfileSettingsWidget from '../components/ProfileSettingsWidget.jsx'
import UserManagementWidget from '../components/UserManagementWidget.jsx'

export default function Settings() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* ===== Neon Glass Background (same as Home) ===== */}
      <div className="glass-bg">
        <div className="blob pink-blob"></div>
        <div className="blob blue-blob"></div>
        <div className="blob purple-blob"></div>
      </div>

      {/* ===== Header & Controls ===== */}
      <Header />
      <ControlsBar />

      {/* ===== Main Content ===== */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div
          className="page-container"
          style={{
            maxWidth: '1600px',
            margin: '0 auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '40px'
          }}
        >
          <ProfileSettingsWidget />
          <UserManagementWidget />
        </div>
      </div>

      {/* ===== Footer (copied from Home.jsx) ===== */}
      <footer
        style={{
          background: '#1e40af',
          padding: '24px',
          textAlign: 'center',
          fontSize: '0.9rem'
        }}
      >
        <strong>CONFIDENTIALITY CAUTION AND DISCLAIMER</strong>
        <br />
        This message is intended only for the use of the individual(s) or
        entity (ies) to which it is addressed and contains information that is
        legally privileged and confidential. If you are not the intended
        recipient, or the person responsible for delivering the message to the
        intended recipient, you are hereby notified that any dissemination,
        distribution or copying of this communication is strictly prohibited.
        All unintended recipients are obliged to delete this message and destroy
        any printed copies.
      </footer>
    </div>
  )
}
