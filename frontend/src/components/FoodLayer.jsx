import { Marker, Popup } from "react-leaflet";
import { foodIcon } from "../lib/mapIcons.js";

export default function FoodLayer({ data, onAddStop }) {
  if (!data) return null;

  return (
    <>
      {data.map((place, i) => (
        <Marker key={`food-${i}`} position={[place.lat, place.lng]} icon={foodIcon()}>
          <Popup>
            <div style={{ minWidth: "150px" }}>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "1rem", color: "#f43f5e" }}>
                🍔 {place.name}
              </h3>
              <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#555" }}>
                Type: <b>{place.type}</b>
                <br />
                Truck Parking: {place.hasTruckParking ? "✅ Yes" : "❌ No"}
              </p>
              {onAddStop && (
                <button
                  className="primary"
                  style={{ padding: "4px 8px", fontSize: "0.8rem", width: "100%", background: "#f43f5e", borderColor: "#f43f5e" }}
                  onClick={() => onAddStop({ lat: place.lat, lng: place.lng }, place.name)}
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
