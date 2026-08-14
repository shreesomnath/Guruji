const BASE_URL = import.meta.env.BASE_URL;

async function loadJson(filename) {
  const res = await fetch(`${BASE_URL}data/${filename}`);
  return res.json();
}

let hotspotsCache, restAreasCache, parkingCache, economicsConfigCache, gasStationsCache;

export async function getHotspots() {
  if (!hotspotsCache) hotspotsCache = await loadJson("tnCrashHotspots.geojson");
  return hotspotsCache;
}

export async function getRestAreas() {
  if (!restAreasCache) restAreasCache = await loadJson("tnRestAreas.geojson");
  
  // Inject random amenities
  const data = JSON.parse(JSON.stringify(restAreasCache));
  data.features.forEach(feature => {
    feature.properties.amenities = {
      showers: Math.random() > 0.4,
      wifi: Math.random() > 0.3,
      scale: Math.random() > 0.6
    };
  });
  return data;
}

export async function getParking() {
  if (!parkingCache) parkingCache = await loadJson("tnTruckParking.geojson");
  return parkingCache;
}

export async function getEconomicsConfig() {
  if (!economicsConfigCache) economicsConfigCache = await loadJson("economicsConfig.json");
  return economicsConfigCache;
}

export async function getGasStationsFallback() {
  if (!gasStationsCache) gasStationsCache = await loadJson("tnGasStationsFallback.geojson");
  return gasStationsCache;
}
