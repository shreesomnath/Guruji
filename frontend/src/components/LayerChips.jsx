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
      <button className={`chip food ${layers.food ? "active" : ""}`} onClick={() => toggleLayer("food")}>
        🍔 Food
      </button>
      <button className={`chip weather ${layers.weather ? "active" : ""}`} onClick={() => toggleLayer("weather")}>
        🌦️ Weather
      </button>
      <button className={`chip scales ${layers.scales ? "active" : ""}`} onClick={() => toggleLayer("scales")}>
        ⚖️ Scales
      </button>
      <button className={`chip cameras ${layers.cameras ? "active" : ""}`} onClick={() => toggleLayer("cameras")}>
        📸 Cameras
      </button>
    </div>
  );
}
