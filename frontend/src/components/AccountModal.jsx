import { useState } from "react";
import LocationSearch from "./LocationSearch.jsx";

export default function AccountModal({ userProfile, onSave, onClose }) {
  const [name, setName] = useState(userProfile.name || "");
  const [truckHeight, setTruckHeight] = useState(userProfile.truckHeight || "13.5");
  const [truckWeight, setTruckWeight] = useState(userProfile.truckWeight || "80000");
  const [hazmat, setHazmat] = useState(userProfile.hazmat || false);
  
  // We'll extract Home and Warehouse from savedLocations for easy editing
  const initialHome = userProfile.savedLocations?.find(l => l.icon === "🏠") || null;
  const initialWarehouse = userProfile.savedLocations?.find(l => l.icon === "📦") || null;

  const [homeLoc, setHomeLoc] = useState(initialHome);
  const [warehouseLoc, setWarehouseLoc] = useState(initialWarehouse);

  const handleSave = () => {
    const newLocations = [];
    if (homeLoc) newLocations.push({ ...homeLoc, icon: "🏠" });
    if (warehouseLoc) newLocations.push({ ...warehouseLoc, icon: "📦" });

    onSave({
      name,
      truckHeight,
      truckWeight,
      hazmat,
      savedLocations: newLocations
    });
  };

  return (
    <div className="modal-backdrop" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="panel" style={{ width: "450px", maxWidth: "90%", backgroundColor: "#ffffff", borderRadius: "14px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ margin: 0 }}>Driver Profile & Setup</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
        </div>
        
        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
          <div style={{ flex: 1 }}>
            <label className="field-label">Your Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="e.g. John Doe"
              style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "6px" }}
            />
          </div>
        </div>

        <h3 style={{ margin: "0 0 10px 0", fontSize: "0.95rem", color: "#1a73e8" }}>Truck Specifications</h3>
        <div style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
          <div style={{ flex: 1 }}>
            <label className="field-label">Height (ft)</label>
            <input 
              type="number" step="0.1" value={truckHeight} 
              onChange={e => setTruckHeight(e.target.value)} 
              style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "6px" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label className="field-label">Weight (lbs)</label>
            <input 
              type="number" step="1000" value={truckWeight} 
              onChange={e => setTruckWeight(e.target.value)} 
              style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "6px" }}
            />
          </div>
        </div>
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#444" }}>
            <input type="checkbox" checked={hazmat} onChange={e => setHazmat(e.target.checked)} />
            Carrying Hazmat (Avoid restricted routes)
          </label>
        </div>

        <h3 style={{ margin: "0 0 10px 0", fontSize: "0.95rem", color: "#1a73e8" }}>Saved Locations</h3>
        <div style={{ marginBottom: "16px" }}>
          <LocationSearch 
            label="🏠 Set Home Location" 
            placeholder="Search home address..." 
            initialValue={homeLoc?.label || ""}
            onSelect={(latlng, label) => setHomeLoc({ ...latlng, label })}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <LocationSearch 
            label="📦 Set Default Warehouse" 
            placeholder="Search warehouse address..." 
            initialValue={warehouseLoc?.label || ""}
            onSelect={(latlng, label) => setWarehouseLoc({ ...latlng, label })}
          />
        </div>

        <button className="primary" style={{ width: "100%" }} onClick={handleSave}>
          Save Profile & Settings
        </button>
      </div>
    </div>
  );
}
