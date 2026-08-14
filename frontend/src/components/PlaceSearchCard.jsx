import LocationSearch from "./LocationSearch.jsx";
import LayerChips from "./LayerChips.jsx";
import Logo from "./Logo.jsx";

export default function PlaceSearchCard({
  isPremiumView,
  onTogglePremium,
  place,
  onSelectPlace,
  onGetDirections,
  onUseMyLocationDirections,
  searchNear,
  layers,
  setLayers,
  error,
}) {
  return (
    <div className="panel">
      <div className="brand-row">
        <div className="brand">
          <Logo size={74} />
          <div>
            <h2>Guruji</h2>
            <div className="subtitle">
              <span style={{ color: "#334155" }}>OPTIMA-FLEET</span>
              <span style={{ color: "#94a3b8", margin: "0 4px" }}>·</span>
              <span style={{ color: "#10b981" }}>Tennessee</span>
            </div>
          </div>
        </div>
        <label className="premium-toggle">
          <input type="checkbox" checked={isPremiumView} onChange={onTogglePremium} />
          Freight
        </label>
      </div>
      <p className="hint">Search a place, or click the map to drop a pin.</p>

      <LocationSearch 
        label="Search Guruji" 
        placeholder="Search for a place, address, or stop…" 
        onSelect={onSelectPlace} 
        near={searchNear} 
        onUseMyLocation={onUseMyLocationDirections}
      />

      {place && (
        <div className="place-card">
          {userProfile?.truckHeight > 13 && (
            <div style={{ padding: "8px", background: "#fef2f2", color: "#991b1b", fontSize: "0.8rem", borderRadius: "6px", marginBottom: "12px", border: "1px solid #fca5a5" }}>
              <b>Truck Profile Active:</b> Routing will avoid low bridges under {userProfile.truckHeight}ft.
            </div>
          )}
          <strong>📍 {place.label}</strong>
          <div className="button-row">
            <button className="primary" onClick={onGetDirections}>
              🧭 Directions
            </button>
          </div>
        </div>
      )}

      <LayerChips layers={layers} setLayers={setLayers} />

      {error && <p className="error">{error}</p>}
    </div>
  );
}
