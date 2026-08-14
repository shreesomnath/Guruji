import { Marker, Popup } from "react-leaflet";
import { badgeIcon } from "../lib/mapIcons.js";

const REST_ICON = badgeIcon("🛏️", { color: "#3b82f6" });

export default function RestAreaLayer({ data, onAddStop }) {
  if (!data || !data.features) return null;

  return (
    <>
      {data.features.map((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        const p = feature.properties;
        return (
          <Marker key={p.id} position={[lat, lng]} icon={REST_ICON}>
            <Popup>
              <div style={{ minWidth: "160px" }}>
                <h3 style={{ margin: "0 0 4px 0", fontSize: "1rem", color: "#3b82f6" }}>🛏️ {p.name}</h3>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#555" }}>
                  {p.highway} — {p.direction}
                  <br /><br />
                  <b>Amenities:</b><br/>
                  🚿 Showers: {p.amenities?.showers ? "✅" : "❌"}<br/>
                  📶 WiFi: {p.amenities?.wifi ? "✅" : "❌"}<br/>
                  ⚖️ CAT Scale: {p.amenities?.scale ? "✅" : "❌"}
                </p>
                {onAddStop && (
                  <button
                    className="primary"
                    style={{ padding: "4px 8px", fontSize: "0.8rem", width: "100%", background: "#3b82f6", borderColor: "#3b82f6" }}
                    onClick={() => onAddStop({ lat, lng }, p.name)}
                  >
                    Add as stop
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
