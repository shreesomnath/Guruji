import { Marker, Popup } from "react-leaflet";
import { cameraIcon } from "../lib/mapIcons.js";

export default function CameraLayer({ data, onAddStop }) {
  if (!data) return null;

  return (
    <>
      {data.map((cam, i) => (
        <Marker key={`camera-${i}`} position={[cam.lat, cam.lng]} icon={cameraIcon()}>
          <Popup>
            <div style={{ minWidth: "150px" }}>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "1rem", color: "#0f172a" }}>
                📸 {cam.type}
              </h3>
              <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#555" }}>
                Limit: <b>{cam.speedLimit ? `${cam.speedLimit} mph` : "N/A"}</b>
              </p>
              {onAddStop && (
                <button
                  className="primary"
                  style={{ padding: "4px 8px", fontSize: "0.8rem", width: "100%", background: "#0f172a", borderColor: "#0f172a" }}
                  onClick={() => onAddStop({ lat: cam.lat, lng: cam.lng }, cam.type)}
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
