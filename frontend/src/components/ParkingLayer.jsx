import { Marker, Popup } from "react-leaflet";
import { badgeIcon } from "../lib/mapIcons.js";

function availabilityColor(a) {
  if (a >= 0.4) return "#2ecc71";
  if (a >= 0.15) return "#f4a300";
  return "#d7263d";
}

export default function ParkingLayer({ data, onAddStop }) {
  if (!data) return null;

  return (
    <>
      {data.features.map((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        const p = feature.properties;
        const color = availabilityColor(p.predictedAvailability);
        const icon = badgeIcon("🅿️", { color, dashed: p.type === "informal-ramp-pressure" });
        return (
          <Marker key={p.id} position={[lat, lng]} icon={icon}>
            <Popup>
              <strong>{p.name}</strong>
              <br />
              {p.highway} — {p.type}
              <br />
              {p.capacity > 0 ? `Capacity: ${p.capacity}` : "No legal capacity (overflow pressure point)"}
              <br />
              Predicted availability: {Math.round(p.predictedAvailability * 100)}%
              {p.note && (
                <>
                  <br />
                  <em>{p.note}</em>
                </>
              )}
              <br />
              {p.capacity > 0 && <button onClick={() => onAddStop({ lat, lng }, p.name)}>Add as stop</button>}
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
