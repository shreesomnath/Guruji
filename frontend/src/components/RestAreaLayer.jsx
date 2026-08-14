import { Marker, Popup } from "react-leaflet";
import { badgeIcon } from "../lib/mapIcons.js";

const ICON = badgeIcon("🚻", { color: "#2c6e49" });

export default function RestAreaLayer({ data, onAddStop }) {
  if (!data) return null;

  return (
    <>
      {data.features.map((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        const p = feature.properties;
        return (
          <Marker key={p.id} position={[lat, lng]} icon={ICON}>
            <Popup>
              <strong>{p.name}</strong>
              <br />
              {p.highway} — {p.direction}
              <br />
              {Object.entries(p.amenities)
                .filter(([, v]) => v)
                .map(([k]) => k)
                .join(", ") || "Restrooms only"}
              <br />
              <button onClick={() => onAddStop({ lat, lng }, p.name)}>Add as stop</button>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
