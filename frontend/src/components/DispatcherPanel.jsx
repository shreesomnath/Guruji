import { useEffect, useState } from "react";

export default function DispatcherPanel({ trucks, onSelectTruck }) {
  const [activeTab, setActiveTab] = useState("all");

  const activeTrucks = trucks.filter(t => t.status === "en-route");
  const delayedTrucks = trucks.filter(t => t.status === "delayed");
  
  return (
    <div className="panel" style={{ display: "flex", flexDirection: "col", height: "100%", maxHeight: "80vh" }}>
      <div style={{ marginBottom: "16px" }}>
        <h2 style={{ fontSize: "1.4rem", margin: "0 0 4px 0", color: "#1a73e8" }}>Fleet Command</h2>
        <p style={{ margin: 0, fontSize: "0.85rem", color: "#5f6368" }}>Live Dispatcher Overview</p>
      </div>

      <div className="mode-toggle" style={{ marginBottom: "16px" }}>
        <button className={activeTab === "all" ? "active" : ""} onClick={() => setActiveTab("all")}>
          All ({trucks.length})
        </button>
        <button className={activeTab === "en-route" ? "active" : ""} onClick={() => setActiveTab("en-route")}>
          En-Route ({activeTrucks.length})
        </button>
        <button className={activeTab === "delayed" ? "active" : ""} onClick={() => setActiveTab("delayed")}>
          Alerts ({delayedTrucks.length})
        </button>
      </div>

      <div style={{ overflowY: "auto", flex: 1, paddingRight: "4px" }}>
        <ul className="summary-list">
          {trucks
            .filter(t => activeTab === "all" || t.status === activeTab)
            .map((truck) => (
            <li 
              key={truck.id} 
              style={{ padding: "12px 8px", cursor: "pointer", borderBottom: "1px solid #eee" }}
              onClick={() => onSelectTruck(truck)}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <b style={{ color: "#334155" }}>{truck.driver}</b>
                <span style={{ 
                  fontSize: "0.75rem", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold",
                  backgroundColor: truck.status === "en-route" ? "#dcfce7" : truck.status === "delayed" ? "#fee2e2" : "#f1f5f9",
                  color: truck.status === "en-route" ? "#166534" : truck.status === "delayed" ? "#991b1b" : "#475569"
                }}>
                  {truck.status.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "#64748b", display: "flex", justifyContent: "space-between" }}>
                <span>Truck #{truck.id}</span>
                <span>{truck.speed} mph</span>
              </div>
              {truck.destination && (
                <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>
                  📍 Dest: {truck.destination}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
