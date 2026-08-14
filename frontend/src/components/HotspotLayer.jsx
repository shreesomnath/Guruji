import { Marker, Popup } from "react-leaflet";
import { badgeIcon } from "../lib/mapIcons.js";

const SEVERITY_COLOR = {
  Fatal: "#d7263d",
  Injury: "#f4a300",
  PDO: "#c9a227",
};

const ICONS = {
  Fatal: badgeIcon("⚠️", { color: SEVERITY_COLOR.Fatal }),
  Injury: badgeIcon("⚠️", { color: SEVERITY_COLOR.Injury }),
  PDO: badgeIcon("⚠️", { color: SEVERITY_COLOR.PDO, size: 18 }),
};

export default function HotspotLayer({ data }) {
  if (!data) return null;

  return (
    <>
      {data.features.map((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        const p = feature.properties;
        return (
          <Marker key={p.id} position={[lat, lng]} icon={ICONS[p.severity] || ICONS.PDO}>
            <Popup>
              <strong>
                {p.roadName} — {p.severity}
              </strong>
              <br />
              {p.description}
              <br />
              {p.crashCount5yr} crashes / 5yr ({p.county} County)
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
