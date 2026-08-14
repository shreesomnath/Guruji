import { useState } from "react";

export default function AnalyticsModal({ onClose }) {
  const [tab, setTab] = useState("overview");

  // Dummy analytics data
  const weeklyData = [
    { day: "Mon", miles: 1200, fuel: 450 },
    { day: "Tue", miles: 1500, fuel: 580 },
    { day: "Wed", miles: 900, fuel: 320 },
    { day: "Thu", miles: 1800, fuel: 690 },
    { day: "Fri", miles: 1400, fuel: 520 },
    { day: "Sat", miles: 800, fuel: 300 },
    { day: "Sun", miles: 400, fuel: 150 },
  ];

  const maxMiles = Math.max(...weeklyData.map(d => d.miles));

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: "600px", padding: "24px", borderRadius: "12px", background: "white" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, color: "#1e293b", fontSize: "1.5rem" }}>📈 Fleet Analytics</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
        </div>

        <div className="mode-toggle" style={{ marginBottom: "20px" }}>
          <button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}>Overview</button>
          <button className={tab === "performance" ? "active" : ""} onClick={() => setTab("performance")}>Performance</button>
        </div>

        {tab === "overview" && (
          <div>
            <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
              <div style={{ flex: 1, background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <p style={{ margin: "0 0 4px 0", color: "#64748b", fontSize: "0.85rem" }}>Total Miles (This Week)</p>
                <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.8rem" }}>8,000 mi</h3>
                <span style={{ color: "#10b981", fontSize: "0.8rem", fontWeight: "bold" }}>↑ 12% vs last week</span>
              </div>
              <div style={{ flex: 1, background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <p style={{ margin: "0 0 4px 0", color: "#64748b", fontSize: "0.85rem" }}>Avg Fuel Cost</p>
                <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.8rem" }}>$3.45/gal</h3>
                <span style={{ color: "#ef4444", fontSize: "0.8rem", fontWeight: "bold" }}>↓ 2% vs last week</span>
              </div>
              <div style={{ flex: 1, background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <p style={{ margin: "0 0 4px 0", color: "#64748b", fontSize: "0.85rem" }}>On-Time Rate</p>
                <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.8rem" }}>96.4%</h3>
                <span style={{ color: "#10b981", fontSize: "0.8rem", fontWeight: "bold" }}>↑ 0.5% vs last week</span>
              </div>
            </div>

            <h4 style={{ margin: "0 0 12px 0", color: "#334155" }}>Weekly Mileage Breakdown</h4>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "150px", padding: "16px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              {weeklyData.map((d, i) => {
                const height = (d.miles / maxMiles) * 100;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                      <div style={{ 
                        width: "80%", 
                        height: height + "%", 
                        background: "linear-gradient(to top, #3b82f6, #60a5fa)", 
                        borderRadius: "4px 4px 0 0",
                        transition: "height 0.5s ease"
                      }}></div>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "bold" }}>{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "performance" && (
          <div>
            <h4 style={{ margin: "0 0 12px 0", color: "#334155" }}>Driver HOS Utilization</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { name: "John D.", used: 65, total: 70 },
                { name: "Sarah M.", used: 40, total: 70 },
                { name: "Mike R.", used: 68, total: 70 },
                { name: "Alex K.", used: 12, total: 70 }
              ].map((driver, i) => (
                <li key={i} style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <b style={{ fontSize: "0.9rem", color: "#1e293b" }}>{driver.name}</b>
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{driver.used} / {driver.total} hrs</span>
                  </div>
                  <div style={{ width: "100%", height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ 
                      width: ((driver.used / driver.total) * 100) + "%", 
                      height: "100%", 
                      background: driver.used > 60 ? "#ef4444" : "#10b981" 
                    }}></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
