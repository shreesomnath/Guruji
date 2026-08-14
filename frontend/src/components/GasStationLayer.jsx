import { Marker, Popup } from "react-leaflet";
import { badgeIcon } from "../lib/mapIcons.js";

const ICON = badgeIcon("⛽", { color: "#7c3aed" });

export default function GasStationLayer({ data, onAddStop }) {
  if (!data) return null;

  return (
    <>
      {data.features.map((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        const p = feature.properties;
        return (
          <Marker key={p.id} position={[lat, lng]} icon={ICON}>
            <Popup>
              <strong>⛽ {p.name}</strong>
              {p.brand && p.brand !== p.name && (
                <>
                  <br />
                  {p.brand}
                </>
              )}
              <br />
              <em>Real OpenStreetMap data</em>
              <br />
              <button onClick={() => onAddStop({ lat, lng }, p.name)}>Add as stop</button>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
