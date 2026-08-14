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
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                {/* Driver Avatar */}
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%", background: "#f1f5f9", 
                  display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold",
                  color: "#64748b", border: "1px solid #e2e8f0"
                }}>
                  {truck.driver.charAt(0)}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", alignItems: "center" }}>
                    <b style={{ color: "#334155", fontSize: "0.95rem" }}>{truck.driver}</b>
                    <span style={{ 
                      fontSize: "0.7rem", padding: "2px 8px", borderRadius: "12px", fontWeight: "bold",
                      backgroundColor: truck.status === "en-route" ? "#dcfce7" : truck.status === "delayed" ? "#fee2e2" : "#f1f5f9",
                      color: truck.status === "en-route" ? "#166534" : truck.status === "delayed" ? "#991b1b" : "#475569"
                    }}>
                      {truck.status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>🚚 #{truck.id}</span>
                    <span style={{ 
                      fontWeight: "bold", 
                      color: truck.speed > 0 ? (truck.speed > 60 ? "#10b981" : "#f59e0b") : "#ef4444" 
                    }}>
                      {Math.round(truck.speed)} mph
                    </span>
                  </div>
                  {truck.destination && (
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                      📍 To: {truck.destination}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
