import { useState } from "react";
import LocationSearch from "./LocationSearch.jsx";

export default function AccountModal({ userProfile, onSave, onClose }) {
  const [name, setName] = useState(userProfile.name || "");
  
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
      savedLocations: newLocations
    });
  };

  return (
    <div className="modal-backdrop" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="panel" style={{ width: "400px", maxWidth: "90%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ margin: 0 }}>Driver Profile & Setup</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
        </div>
        
        <label className="field-label">Your Name</label>
        <input 
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="e.g. John Doe"
          style={{ width: "100%", marginBottom: "16px" }}
        />

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
          Save Profile & Locations
        </button>
      </div>
    </div>
  );
}
