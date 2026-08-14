import LocationSearch from "./LocationSearch.jsx";
import LayerChips from "./LayerChips.jsx";

export default function RouteForm({
  isPremiumView,
  onTogglePremium,
  onBack,
  origin,
  destination,
  searchNear,
  onSelectOrigin,
  onSelectDestination,
  onUseMyLocation,
  geoError,
  stops,
  onAddStop,
  onRemoveStop,
  mode,
  setMode,
  onFindRoute,
  onClear,
  layers,
  setLayers,
  loading,
  error,
  tracking,
  onStartTrip,
  onStopTrip,
  savedLocations = []
}) {
  return (
    <div className="panel">
      <div className="brand-row">
        <div className="brand">
          <button className="back-button" onClick={onBack} aria-label="Back to search">
            ←
          </button>
          <h2>Directions</h2>
        </div>
        <label className="premium-toggle">
          <input type="checkbox" checked={isPremiumView} onChange={onTogglePremium} />
          Freight
        </label>
      </div>

      <LocationSearch
        label="Origin"
        placeholder="Search an address…"
        onSelect={onSelectOrigin}
        near={searchNear}
        initialValue={origin?.label}
        onUseMyLocation={onUseMyLocation}
        savedLocations={savedLocations}
      />
      {geoError && <p className="error">{geoError}</p>}

      <LocationSearch
        label="Destination"
        placeholder="Search an address…"
        onSelect={onSelectDestination}
        near={origin || searchNear}
        initialValue={destination?.label}
        savedLocations={savedLocations}
      />

      <LayerChips layers={layers} setLayers={setLayers} />

      <LocationSearch
        label="Add a stop"
        placeholder="Search a stop to add…"
        onSelect={(latlng, label) => onAddStop(latlng, label)}
        near={origin || searchNear}
        savedLocations={savedLocations}
      />
      {stops.length > 0 && (
        <ul className="stop-list">
          {stops.map((stop, i) => (
            <li key={i}>
              <span className="dot stop" /> {i + 1}. {stop.label}
              <button className="remove-stop" onClick={() => onRemoveStop(i)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mode-toggle">
        <button className={mode === "fastest" ? "active" : ""} onClick={() => setMode("fastest")}>
          Fastest
        </button>
        <button className={mode === "safest" ? "active" : ""} onClick={() => setMode("safest")}>
          Safest
        </button>
      </div>
      {stops.length > 0 && (
        <p className="hint">Note: with stops added, OSRM returns one route only — Fastest/Safest won't differ.</p>
      )}

      <div className="button-row">
        <button className="primary" disabled={!origin || !destination || loading} onClick={onFindRoute}>
          {loading ? "Finding route…" : "Find Route"}
        </button>
        <button onClick={onClear}>Clear</button>
      </div>

      <div className="button-row">
        {!tracking ? (
          <button disabled={!origin || !destination} onClick={onStartTrip}>
            ▶ Start Trip (live GPS + auto-reroute)
          </button>
        ) : (
          <button className="tracking-active" onClick={onStopTrip}>
            ■ Stop Trip
          </button>
        )}
      </div>
      {tracking && <p className="hint">Tracking your location — route updates automatically as you move.</p>}

      {error && <p className="error">{error}</p>}
    </div>
  );
}
