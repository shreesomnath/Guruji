import { useState } from "react";

export default function TripSummary({ result }) {
  const [hosHours, setHosHours] = useState("");

  if (!result) return null;

  const { selected, economics, nearestParking, mode } = result;
  
  const tripDurationHours = selected.durationMinutes / 60;
  const exceedsHOS = hosHours && tripDurationHours > Number(hosHours);

  return (
    <div className="panel">
      <h2>Trip summary ({mode})</h2>
      <ul className="summary-list">
        <li>Distance: {selected.distanceMiles} mi</li>
        <li>Duration: {Math.round(selected.durationMinutes)} min</li>
        <li>Crash hotspots on route: {selected.hotspotsOnRoute.length} (score {selected.hotspotScore})</li>
        <li>Estimated fuel cost: ${economics.fuelCost}</li>
      </ul>

      <div style={{ marginTop: "12px", padding: "10px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
        <label style={{ fontSize: "0.85rem", fontWeight: "bold", display: "block", marginBottom: "6px" }}>
          Hours of Service (HOS) remaining:
        </label>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input 
            type="number" 
            placeholder="e.g. 8" 
            value={hosHours}
            onChange={(e) => setHosHours(e.target.value)}
            style={{ width: "60px", padding: "4px" }}
          />
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>hours</span>
        </div>
        {exceedsHOS && (
          <div style={{ marginTop: "8px", color: "#b91c1c", fontSize: "0.85rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>⚠️</span> 
            Trip exceeds remaining HOS! You must plan a stop.
          </div>
        )}
      </div>

      {selected.hotspotsOnRoute.length > 0 && (
        <details>
          <summary>Hotspot details</summary>
          <ul className="summary-list small">
            {selected.hotspotsOnRoute.map((h) => (
              <li key={h.id}>
                {h.roadName} — {h.severity}: {h.description}
              </li>
            ))}
          </ul>
        </details>
      )}

      <h3>Nearest parking to destination</h3>
      <ul className="summary-list small">
        {nearestParking.map((p) => (
          <li key={p.id}>
            {p.name} — {p.distanceMiles.toFixed(1)} mi, {Math.round(p.predictedAvailability * 100)}% available
          </li>
        ))}
      </ul>
    </div>
  );
}
