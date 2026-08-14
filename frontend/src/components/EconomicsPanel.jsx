import { useState, useEffect } from "react";
import { fetchEconomics } from "../lib/api.js";

export default function EconomicsPanel({ result }) {
  const [overrides, setOverrides] = useState({});
  const [economicsFastest, setEconomicsFastest] = useState(result.fastest?.economics || result.economics);
  const [economicsSafest, setEconomicsSafest] = useState(result.safest?.economics || result.economics);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEconomicsFastest(result.fastest?.economics || result.economics);
    setEconomicsSafest(result.safest?.economics || result.economics);
    setOverrides({});
  }, [result]);

  const assumptions = economicsFastest.assumptions;

  const updateOverride = (key, value) => {
    setOverrides((prev) => ({ ...prev, [key]: value === "" ? undefined : Number(value) }));
  };

  const recompute = async () => {
    setLoading(true);
    try {
      if (result.fastest && result.safest) {
        const [updatedFastest, updatedSafest] = await Promise.all([
          fetchEconomics({
            distanceMiles: result.fastest.distanceMiles,
            durationMinutes: result.fastest.durationMinutes,
            overrides,
          }),
          fetchEconomics({
            distanceMiles: result.safest.distanceMiles,
            durationMinutes: result.safest.durationMinutes,
            overrides,
          }),
        ]);
        setEconomicsFastest(updatedFastest);
        setEconomicsSafest(updatedSafest);
      } else {
        const updated = await fetchEconomics({
          distanceMiles: result.selected.distanceMiles,
          durationMinutes: result.selected.durationMinutes,
          overrides,
        });
        setEconomicsFastest(updated);
        setEconomicsSafest(updated);
      }
    } finally {
      setLoading(false);
    }
  };

  const hasComparison = result.fastest && result.safest;

  return (
    <div className="panel premium">
      <h2>Freight economics (premium)</h2>
      <p className="hint">Cost-benefit breakdown for this route. Adjust assumptions for your fleet.</p>

      {hasComparison ? (
        <table className="econ-table" style={{ textAlign: "right" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", paddingBottom: "6px" }}>Metric</th>
              <th style={{ paddingBottom: "6px" }}>Fastest Route</th>
              <th style={{ paddingBottom: "6px" }}>Safest Route</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ textAlign: "left" }}>Fuel cost</td>
              <td>${economicsFastest.fuelCost}</td>
              <td>${economicsSafest.fuelCost}</td>
            </tr>
            <tr>
              <td style={{ textAlign: "left" }}>Driver time</td>
              <td>${economicsFastest.driverCost}</td>
              <td>${economicsSafest.driverCost}</td>
            </tr>
            <tr>
              <td style={{ textAlign: "left" }}>Maintenance</td>
              <td>${economicsFastest.maintenanceCost}</td>
              <td>${economicsSafest.maintenanceCost}</td>
            </tr>
            <tr className="total">
              <td style={{ textAlign: "left" }}>Total cost</td>
              <td>${economicsFastest.totalCost}</td>
              <td>${economicsSafest.totalCost}</td>
            </tr>
            <tr>
              <td style={{ textAlign: "left" }}>Cost / mile</td>
              <td>${economicsFastest.costPerMile}</td>
              <td>${economicsSafest.costPerMile}</td>
            </tr>
            <tr style={{ color: "#d7263d", fontSize: "0.85em", fontWeight: "bold" }}>
              <td style={{ textAlign: "left" }}>Crash hotspots</td>
              <td>{result.fastest.hotspotScore}</td>
              <td>{result.safest.hotspotScore}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <table className="econ-table">
          <tbody>
            <tr>
              <td>Fuel cost</td>
              <td>${economicsFastest.fuelCost}</td>
            </tr>
            <tr>
              <td>Driver time cost</td>
              <td>${economicsFastest.driverCost}</td>
            </tr>
            <tr>
              <td>Maintenance cost</td>
              <td>${economicsFastest.maintenanceCost}</td>
            </tr>
            <tr className="total">
              <td>Total cost</td>
              <td>${economicsFastest.totalCost}</td>
            </tr>
            <tr>
              <td>Cost per mile</td>
              <td>${economicsFastest.costPerMile}</td>
            </tr>
          </tbody>
        </table>
      )}

      <h3>Assumptions</h3>
      <label className="field-row">
        Diesel $/gal
        <input
          type="number"
          step="0.01"
          placeholder={assumptions.dieselPricePerGallon}
          onChange={(e) => updateOverride("dieselPricePerGallon", e.target.value)}
        />
      </label>
      <label className="field-row">
        Truck MPG
        <input
          type="number"
          step="0.1"
          placeholder={assumptions.avgTruckMPG}
          onChange={(e) => updateOverride("avgTruckMPG", e.target.value)}
        />
      </label>
      <label className="field-row">
        Driver $/hr
        <input
          type="number"
          step="0.5"
          placeholder={assumptions.driverHourlyRate}
          onChange={(e) => updateOverride("driverHourlyRate", e.target.value)}
        />
      </label>
      <label className="field-row">
        Maintenance $/mi
        <input
          type="number"
          step="0.01"
          placeholder={assumptions.maintenanceCostPerMile}
          onChange={(e) => updateOverride("maintenanceCostPerMile", e.target.value)}
        />
      </label>

      <button className="primary" onClick={recompute} disabled={loading}>
        {loading ? "Recalculating…" : "Recalculate"}
      </button>
    </div>
  );
}
