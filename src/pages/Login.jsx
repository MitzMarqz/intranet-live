import SignInWidget from '../components/SignInWidget.jsx'

export default function Login() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Background blobs (same as Home / Settings) */}
      <div className="glass-bg">
        <div className="blob pink-blob"></div>
        <div className="blob blue-blob"></div>
        <div className="blob purple-blob"></div>
      </div>

      {/* Centered login widget */}
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        <SignInWidget />
      </div>
    </div>
  )
}
