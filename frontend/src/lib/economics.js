export function computeEconomics({ distanceMiles, durationMinutes, config, overrides = {} }) {
  const dieselPricePerGallon = overrides.dieselPricePerGallon ?? config.dieselPricePerGallon;
  const avgTruckMPG = overrides.avgTruckMPG ?? config.avgTruckMPG;
  const driverHourlyRate = overrides.driverHourlyRate ?? config.driverHourlyRate;
  const maintenanceCostPerMile = overrides.maintenanceCostPerMile ?? config.maintenanceCostPerMile;

  const durationHours = durationMinutes / 60;
  const fuelCost = (distanceMiles / avgTruckMPG) * dieselPricePerGallon;
  const driverCost = durationHours * driverHourlyRate;
  const maintenanceCost = distanceMiles * maintenanceCostPerMile;
  const totalCost = fuelCost + driverCost + maintenanceCost;

  return {
    assumptions: { dieselPricePerGallon, avgTruckMPG, driverHourlyRate, maintenanceCostPerMile },
    fuelCost: round2(fuelCost),
    driverCost: round2(driverCost),
    maintenanceCost: round2(maintenanceCost),
    totalCost: round2(totalCost),
    costPerMile: round2(totalCost / distanceMiles),
  };
}

function round2(n) {
  return Math.round(n * 100) / 100;
}
