export default function TripSummary({ result }) {
  if (!result) return null;

  const { selected, economics, nearestParking, mode } = result;

  return (
    <div className="panel">
      <h2>Trip summary ({mode})</h2>
      <ul className="summary-list">
        <li>Distance: {selected.distanceMiles} mi</li>
        <li>Duration: {Math.round(selected.durationMinutes)} min</li>
        <li>Crash hotspots on route: {selected.hotspotsOnRoute.length} (score {selected.hotspotScore})</li>
        <li>Estimated fuel cost: ${economics.fuelCost}</li>
      </ul>

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
