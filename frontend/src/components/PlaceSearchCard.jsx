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
          <Logo size={52} />
          <div>
            <h2>Guruji</h2>
            <span className="subtitle">OPTIMA-FLEET · Tennessee</span>
          </div>
        </div>
        <label className="premium-toggle">
          <input type="checkbox" checked={isPremiumView} onChange={onTogglePremium} />
          Freight
        </label>
      </div>
      <p className="hint">Search a place, or click the map to drop a pin.</p>

      <LocationSearch label="Search Guruji" placeholder="Search for a place, address, or stop…" onSelect={onSelectPlace} near={searchNear} />

      {place && (
        <div className="place-card">
          <strong>📍 {place.label}</strong>
          <div className="button-row">
            <button className="primary" onClick={onGetDirections}>
              🧭 Directions
            </button>
          </div>
        </div>
      )}

      <button className="link-button" onClick={onUseMyLocationDirections}>
        📍 Directions from my current location
      </button>

      <LayerChips layers={layers} setLayers={setLayers} />

      {error && <p className="error">{error}</p>}
      
      <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #e2e8f0", fontSize: "0.75rem", color: "#64748b", textAlign: "center" }}>
        Developed by <b>Er. Somnath Luitel</b> & <b>Er. Arbin Amagain</b>
      </div>
    </div>
  );
}
