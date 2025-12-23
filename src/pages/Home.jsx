import Header from '../components/Header.jsx'
import ControlsBar from '../components/ControlsBar.jsx'
import AnnouncementsWidget from '../components/AnnouncementsWidget.jsx'
import GoodStuffWidget from '../components/GoodStuffWidget.jsx'
import SprintWidget from '../components/SprintWidget.jsx'
import ResourceLinksWidget from '../components/ResourceLinksWidget.jsx'
import RoadmapWidget from '../components/RoadmapWidget.jsx'
import TMAvailabilityWidget from '../components/TMAvailabilityWidget.jsx'
import OutOfOfficeWidget from "../components/OutOfOfficeWidget.jsx";
import WorldClockWidget from '../components/WorldClockWidget.jsx'
import DailyStandupWidget from '../components/DailyStandupWidget.jsx'
import HRFormsWidget from '../components/HRFormsWidget.jsx'
// Import the new Treemap widget
import DomainTreemapWidget from '../components/DomainTreemapWidget.jsx';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      {/* *Neon Glass Background Block* */}
      <div className="glass-bg">
        <div className="blob blue-blob"></div>
        <div className="blob purple-blob"></div>
      </div>

      {/* *Header Block* */}
      <Header />

      {/* *Controls Bar Block* */}
      <ControlsBar />

      {/* *Main Scrollable Content* */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div className="page-container" style={{ display: 'flex', maxWidth: '1600px', margin: '0 auto', padding: '20px', gap: '40px' }}>
          {/* *Main Content Area* */}
          <div style={{ flex: 2 }}>
            <AnnouncementsWidget />
            <GoodStuffWidget />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
              {/* Using your existing 'type' prop */}
              <SprintWidget title="Main App Sprint" type="main" />
              <SprintWidget title="Marketing Sprint" type="marketing" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
               {/* Using your existing 'type' prop */}
              <SprintWidget title="Design Sprint" type="design" />
              <SprintWidget title="Abuse Sprint" type="abuse" />
            </div>
            {/* Added the new Treemap widget here, as requested */}
            <DomainTreemapWidget /> 
            <RoadmapWidget />
            <ResourceLinksWidget />
          </div>

          {/* *Sidebar* */}
          <div className="sidebar" style={{ width: '420px' }}>
            <TMAvailabilityWidget />
            <OutOfOfficeWidget />
            <WorldClockWidget />
            <DailyStandupWidget />
            <HRFormsWidget />

            {/* *User Status Widget* (Existing code) */}
            <div style={{
              background: 'var(--widget-bg)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '36px 34px',
              marginBottom: '28px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.7)'
            }}>
              <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #60a5fa', paddingBottom: '12px', textAlign: 'center', fontSize: '1.5rem' }}>
                User Status
              </h2>
              <div style={{ lineHeight: '2.2', fontSize: '1rem' }}>
                🟢 Ana – Clocked In<br />
                🟢 Carlos – Clocked In<br />
                🟡 Maria – In Meeting<br />
                🟢 Pedro – Clocked In<br />
                🟢 Sofia – Clocked In
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* *Footer Block* */}
      <footer style={{ background: '#1e40af', padding: '24px', textAlign: 'center', fontSize: '0.9rem' }}>
        <strong>CONFIDENTIALITY CAUTION AND DISCLAIMER</strong><br />
        This message is intended only for the use of the individual(s) or entity (ies) to which it is addressed and contains information that is legally privileged and confidential. If you are not the intended recipient, or the person responsible for delivering the message to the intended recipient, you are hereby notified that any dissemination, distribution or copying of this communication is strictly prohibited. All unintended recipients are obliged to delete this message and destroy any printed copies.
      </footer>
    </div>
  )
}
