import { useState, useEffect } from 'react';

// >>> REPLACE THIS WITH YOUR DEPLOYED GOOGLE APPS SCRIPT WEB APP URL <<<
const APPS_SCRIPT_URL = 'YOUR-GAS-WEB-APP-URL-HERE'; 

// Helper function to format time strings from Google Sheets (e.g., "09:00:00" -> "9:00 AM")
const formatTime = (timeString) => {
    if (!timeString || timeString === '00:00:00') return 'Off';
    try {
        let [hours, minutes] = timeString.split(':');
        hours = parseInt(hours, 10);
        const amPm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert 0 to 12
        return `${hours}:${minutes} ${amPm}`;
    } catch (e) {
        return timeString; 
    }
};

export default function TMAvailabilityWidget() {
    const [availabilityData, setAvailabilityData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data when the component loads
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            // Call the Apps Script API endpoint for TM Availability
            const url = `${APPS_SCRIPT_URL}?endpoint=tmAvailability`;
            
            try {
                const response = await fetch(url);
                const result = await response.json();

                if (result.success) {
                    setAvailabilityData(result.availability);
                } else {
                    setError(result.error || 'Failed to fetch data');
                }
            } catch (err) {
                setError('Network error or invalid Apps Script URL.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []); // Empty dependency array means this runs once on load

    if (error) return <div className="widget">Error: {error}</div>;

    return (
      <>{/* *TM Availability Widget Block* */}
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
            TM Availability
          </h2>

          {/* *Availability List Area* */}
          <div style={{
            minHeight: '200px',
            maxHeight: '300px',
            overflowY: 'auto',
            lineHeight: '1.8', // Adjusted line height slightly for table legibility
            fontSize: '1rem',
            color: '#e2e8f0'
          }}>
            {loading ? (
                <span>Loading availability from Google Sheet...<br /><br /></span>
            ) : (
                <table style={{ width: '100%', fontSize: 'var(--font-base)' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left' }}>Name</th>
                            <th>Shift 1</th>
                            <th>Shift 2</th>
                            <th>Shift 3</th>
                        </tr>
                    </thead>
                    <tbody>
                        {availabilityData.map((item, index) => (
                            <tr key={index}>
                                <td style={{ fontWeight: 'bold' }}>{item.name}</td>
                                <td>{formatTime(item.startTime1)} - {formatTime(item.endTime1)}</td>
                                <td>{formatTime(item.startTime2)} - {formatTime(item.endTime2)}</td>
                                <td>{formatTime(item.startTime3)} - {formatTime(item.endTime3)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
          </div>

          {/* >>> DIGITAL SIGNATURE AND OWNERSHIP <<< */}
          {/* TinyURL-Intranet-2025 © VeverlieAnneMarquez version 1.0.251219 */}
        </div>
      </>
    )
}
