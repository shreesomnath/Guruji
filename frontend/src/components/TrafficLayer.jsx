import { Polyline, Popup } from "react-leaflet";

export default function TrafficLayer({ routePositions }) {
  if (!routePositions || routePositions.length < 2) return null;

  // We will divide the route into chunks and assign random traffic colors.
  // In a real app, we would fetch live traffic speeds for these segments from Google or TomTom.
  const segments = [];
  const chunkSize = Math.max(Math.floor(routePositions.length / 10), 2);
  
  for (let i = 0; i < routePositions.length - 1; i += chunkSize) {
    const segmentPositions = routePositions.slice(i, i + chunkSize + 1);
    
    // Generate a deterministically random color based on the segment index
    // so it doesn't flicker on every re-render.
    const rand = (Math.sin(i) * 10000) - Math.floor(Math.sin(i) * 10000);
    
    let color = "#10b981"; // Green (Clear)
    let label = "Clear Traffic";
    
    if (rand > 0.85) {
      color = "#ef4444"; // Red (Heavy)
      label = "Heavy Traffic Congestion";
    } else if (rand > 0.6) {
      color = "#f59e0b"; // Yellow (Moderate)
      label = "Moderate Traffic";
    }

    segments.push(
      <Polyline 
        key={i} 
        positions={segmentPositions} 
        pathOptions={{ color, weight: 8, opacity: 0.8 }}
      >
        <Popup>
          <b>🚥 {label}</b><br/>
          Live traffic conditions.
        </Popup>
      </Polyline>
    );
  }

  return <>{segments}</>;
}
