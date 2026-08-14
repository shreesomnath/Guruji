import { useState } from "react";
import { fetchEconomics } from "../lib/api.js";

export default function EconomicsPanel({ result }) {
  const [overrides, setOverrides] = useState({});
  const [economics, setEconomics] = useState(result.economics);
  const [loading, setLoading] = useState(false);

  const assumptions = economics.assumptions;

  const updateOverride = (key, value) => {
    setOverrides((prev) => ({ ...prev, [key]: value === "" ? undefined : Number(value) }));
  };

  const recompute = async () => {
    setLoading(true);
    try {
      const updated = await fetchEconomics({
        distanceMiles: result.selected.distanceMiles,
        durationMinutes: result.selected.durationMinutes,
        overrides,
      });
      setEconomics(updated);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel premium">
      <h2>Freight economics (premium)</h2>
      <p className="hint">Cost-benefit breakdown for this route. Adjust assumptions for your fleet.</p>

      <table className="econ-table">
        <tbody>
          <tr>
            <td>Fuel cost</td>
            <td>${economics.fuelCost}</td>
          </tr>
          <tr>
            <td>Driver time cost</td>
            <td>${economics.driverCost}</td>
          </tr>
          <tr>
            <td>Maintenance cost</td>
            <td>${economics.maintenanceCost}</td>
          </tr>
          <tr className="total">
            <td>Total cost</td>
            <td>${economics.totalCost}</td>
          </tr>
          <tr>
            <td>Cost per mile</td>
            <td>${economics.costPerMile}</td>
          </tr>
        </tbody>
      </table>

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
