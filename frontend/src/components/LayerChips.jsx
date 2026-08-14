export default function LayerChips({ layers, setLayers }) {
  const toggleLayer = (key) => setLayers((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="chip-row">
      <button className={`chip gas ${layers.gasStations ? "active" : ""}`} onClick={() => toggleLayer("gasStations")}>
        ⛽ Gas
      </button>
      <button className={`chip parking ${layers.parking ? "active" : ""}`} onClick={() => toggleLayer("parking")}>
        🅿️ Parking
      </button>
      <button className={`chip rest ${layers.restAreas ? "active" : ""}`} onClick={() => toggleLayer("restAreas")}>
        🚻 Rest areas
      </button>
      <button className={`chip hotspots ${layers.hotspots ? "active" : ""}`} onClick={() => toggleLayer("hotspots")}>
        ⚠️ Hotspots
      </button>
      <button className={`chip traffic ${layers.traffic ? "active" : ""}`} onClick={() => toggleLayer("traffic")}>
        🚥 Traffic
      </button>
    </div>
  );
}
