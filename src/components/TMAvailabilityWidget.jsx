/**
 * =========================================================
 * TMAvailabilityWidget
 * =========================================================
 * Displays team availability status
 * Data source: Google Apps Script (via backend proxy)
 *
 * UI, layout, and styles preserved
 * Only API routing updated for security
 * =========================================================
 */

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/apiConfig";

export default function TMAvailabilityWidget() {
  const [availability, setAvailability] = useState([]);
  const [error, setError] = useState("");

  /**
   * =========================================================
   * Fetch Team Availability
   * =========================================================
   */
  useEffect(() => {
    async function fetchAvailability() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/google?endpoint=availability`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch availability");
        }

        const data = await response.json();
        setAvailability(data);
      } catch (err) {
        console.error("TMAvailabilityWidget error:", err);
        setError("Failed to load availability data.");
      }
    }

    fetchAvailability();
  }, []);

  /**
   * =========================================================
   * Render
   * =========================================================
   */
  return (
  	<div className="widget">
    	<h3>Team Availability</h3>

	    {/* Error message */}
	    {error && (
        <div className="error">
        {error}
        </div>
    )}

    {/* Data list */}

    {/* Error */}
      {error && (
  	<div style={{ color: "red", marginTop: "8px" }}>
    {error}
       </div>
	)}

    {/* Loading */}
    {!error && availability.length === 0 && (
    <div style={{ marginTop: "8px" }}>
    Loading availability…
    </div>
)}

{/* Data */}
{!error && availability.length > 0 && (
  <ul style={{ marginTop: "8px" }}>
    {availability.map((person, index) => (
      <li key={index}>
        <strong>{person.name}</strong>: {person.status}
      </li>
    ))}
  </ul>
)}



  </div>
);

}

