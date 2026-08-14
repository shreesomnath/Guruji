import { Marker, Popup } from "react-leaflet";
import { scaleIcon } from "../lib/mapIcons.js";

export default function WeighStationLayer({ data, onAddStop }) {
  if (!data) return null;

  return (
    <>
      {data.map((station, i) => (
        <Marker key={`scale-${i}`} position={[station.lat, station.lng]} icon={scaleIcon()}>
          <Popup>
            <div style={{ minWidth: "160px" }}>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "1rem", color: "#8b5cf6" }}>
                ⚖️ {station.name}
              </h3>
              <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#555" }}>
                Status: <b style={{ color: station.status === "open" ? "#10b981" : "#ef4444"}}>{station.status.toUpperCase()}</b>
                <br />
                PrePass Bypass Rate: <b>{station.bypassProbability}%</b>
              </p>
              {onAddStop && (
                <button
                  className="primary"
                  style={{ padding: "4px 8px", fontSize: "0.8rem", width: "100%", background: "#8b5cf6", borderColor: "#8b5cf6" }}
                  onClick={() => onAddStop({ lat: station.lat, lng: station.lng }, station.name)}
                >
                  Add as stop
                </button>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
