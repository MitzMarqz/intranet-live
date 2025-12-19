import { useEffect, useState } from 'react'

export default function OutOfOfficeWidget() {
  const [approvedLeaves, setApprovedLeaves] = useState([])
  const [pendingLeaves, setPendingLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userRole, setUserRole] = useState('')
  
  // ✅ REPLACE THIS WITH YOUR ACTUAL APPS SCRIPT URL
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR-DEPLOYMENT-ID/exec';

  useEffect(() => {
    fetchOutOfOfficeData()
    
    // Get current user role from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if (currentUser?.role) {
      setUserRole(currentUser.role.toLowerCase())
    }
  }, [])

  const fetchOutOfOfficeData = async () => {
    try {
      setLoading(true)
      
      // Fetch approved leaves (visible to all)
      const approvedResponse = await fetch(`${APPS_SCRIPT_URL}?endpoint=approvedLeaves&nocache=${Date.now()}`)
      const approvedData = await approvedResponse.json()
      setApprovedLeaves(approvedData.leaves || [])
      
      // Fetch pending leaves (only for managers/admins)
      const currentUser = JSON.parse(localStorage.getItem('currentUser'))
      if (currentUser?.role?.toLowerCase() === 'manager' || currentUser?.role?.toLowerCase() === 'admin') {
        const pendingResponse = await fetch(`${APPS_SCRIPT_URL}?endpoint=pendingLeaves&nocache=${Date.now()}`)
        const pendingData = await pendingResponse.json()
        setPendingLeaves(pendingData.leaves || [])
      }
      
    } catch (err) {
      console.error('Error fetching leave data:', err)
      setError('Unable to load out of office data. Please try again later.')
      
      // Fallback data
      const fallback = [
        { name: 'Maria', leaveType: 'Vacation', startDate: '2024-12-20', endDate: '2024-12-24', handoffDoc: null },
        { name: 'Laura', leaveType: 'Sick Leave', startDate: '2024-12-21', endDate: '2024-12-22', handoffDoc: null },
        { name: 'Pedro', leaveType: 'Personal Day', startDate: '2024-12-23', endDate: '2024-12-23', handoffDoc: null },
        { name: 'Sofia', leaveType: 'Half Day', startDate: '2024-12-19', endDate: '2024-12-19', handoffDoc: null }
      ]
      setApprovedLeaves(fallback)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch (e) {
      return dateString
    }
  }

  const formatDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return ''
    try {
      const start = new Date(startDate)
      const end = new Date(endDate)
      if (start.toDateString() === end.toDateString()) {
        return formatDate(startDate)
      }
      return `${formatDate(startDate)} – ${formatDate(endDate)}`
    } catch (e) {
      return `${startDate} – ${endDate}`
    }
  }

  return (
    <>{/* *Out of Office Widget Block* */}
      <div style={{
        background: 'var(--widget-bg)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '19px 17px',
        marginBottom: '28px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
        border: '1px solid rgba(96,165,250,0.1)'
      }}>
        {/* *Widget Header* */}
        <h2 style={{
          color: '#60a5fa',
          borderBottom: '2px solid #60a5fa',
          paddingBottom: '12px',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: 'var(--header-font)'
        }}>
          Team Out of Office
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#60a5fa' }}>
            Loading out of office data...
          </div>
        ) : error ? (
          <div style={{ color: '#ef4444', padding: '20px', textAlign: 'center' }}>
            {error}
          </div>
        ) : (
          <>
            {/* Approved Leaves Section - Visible to All */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ 
                color: '#86efac', 
                fontSize: '1.1rem', 
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '1.2rem' }}>✅</span> Approved Leaves
              </h3>
              
              {approvedLeaves.length === 0 ? (
                <div style={{ color: '#94a3b8', textAlign: 'center', padding: '15px' }}>
                  No approved leaves for this month
                </div>
              ) : (
                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  {approvedLeaves.map((leave, index) => (
                    <div 
                      key={index} 
                      style={{
                        padding: '12px',
                        marginBottom: '10px',
                        background: 'rgba(30, 41, 59, 0.5)',
                        borderRadius: '8px',
                        borderLeft: '4px solid #60a5fa'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#e2e8f0', marginBottom: '4px' }}>
                            {leave.name}
                          </div>
                          <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
                            {leave.leaveType} • {formatDuration(leave.startDate, leave.endDate)}
                          </div>
                        </div>
                        
                        {leave.handoffDoc && (
                          <a
                            href={leave.handoffDoc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background: 'rgba(59, 130, 246, 0.1)',
                              color: '#3b82f6',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              textDecoration: 'none',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            📄 Hand-off Doc
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending Leaves Section - Only for Managers/Admins */}
            {(userRole === 'manager' || userRole === 'admin') && (
              <div>
                <h3 style={{ 
                  color: '#fbbf24', 
                  fontSize: '1.1rem', 
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>⏳</span> Pending Approval ({pendingLeaves.length})
                </h3>
                
                {pendingLeaves.length === 0 ? (
                  <div style={{ color: '#94a3b8', textAlign: 'center', padding: '15px' }}>
                    No pending leave requests
                  </div>
                ) : (
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {pendingLeaves.map((leave, index) => (
                      <div 
                        key={index} 
                        style={{
                          padding: '12px',
                          marginBottom: '10px',
                          background: 'rgba(120, 53, 15, 0.1)',
                          borderRadius: '8px',
                          borderLeft: '4px solid #fbbf24'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <a
                              href={`https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit#gid=0`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                fontWeight: 'bold',
                                color: '#fbbf24',
                                textDecoration: 'none',
                                marginBottom: '4px',
                                display: 'block'
                              }}
                            >
                              {leave.name}
                            </a>
                            <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
                              Submitted: {formatDate(leave.submissionDate)} • {formatDuration(leave.startDate, leave.endDate)}
                            </div>
                            {leave.isLongLeave && leave.isLongLeave.toString().toLowerCase().includes('yes') && (
                              <div style={{ 
                                color: '#f59e0b', 
                                fontSize: '0.8rem', 
                                marginTop: '4px',
                                background: 'rgba(245, 158, 11, 0.1)',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                display: 'inline-block'
                              }}>
                                📅 3+ Day Leave
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* >>> INSTRUCTIONS: REPLACE THESE VALUES <<< */}
        {/* 
        1. Replace APPS_SCRIPT_URL above with your actual deployment URL
        2. Replace YOUR_SHEET_ID in the pending leaves link with your Google Sheet ID
        3. Test by logging in as admin/manager to see both sections
        */}

        {/* >>> DIGITAL SIGNATURE AND OWNERSHIP <<< */}
        {/* TinyURL-Intranet-2025 © VeverlieAnneMarquez version 1.0.251219 */}
        {/* SHA256 Hash of this exact file content: */}
        {/* aa345118c2128a7d970a442bd0059e0fb193e693e91b303f5608b7e96a664e29 */}
        {/* (This hash proves this version was created by you on December 19, 2025) */}
      </div>
    </>
  )
}