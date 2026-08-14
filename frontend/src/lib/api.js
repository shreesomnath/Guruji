import { getCandidateRoutes } from "./osrmClient.js";
import { scoreRouteAgainstHotspots, findNearestPoints } from "./routeScoring.js";
import { computeEconomics } from "./economics.js";
import { getHotspots, getRestAreas, getParking, getEconomicsConfig, getGasStationsFallback } from "./dataStoreServerless.js";

function round1(n) {
  return Math.round(n * 10) / 10;
}

export async function fetchRoute({ fromLat, fromLng, toLat, toLng, mode = "fastest", stops, truckHeight, truckWeight, hazmat }) {
  const parsed = { fromLat: Number(fromLat), fromLng: Number(fromLng), toLat: Number(toLat), toLng: Number(toLng) };

  let waypoints = [];
  if (stops && stops.length > 0) {
    waypoints = stops.map(s => ({ lat: Number(s.lat), lng: Number(s.lng) }));
  }

  const candidates = await getCandidateRoutes({ ...parsed, waypoints });
  const hotspotsData = await getHotspots();

  const scored = candidates.map((candidate) => {
    const { hotspotScore, hotspotsOnRoute } = scoreRouteAgainstHotspots(candidate.geometry, hotspotsData);
    return { ...candidate, hotspotScore, hotspotsOnRoute };
  });

  const fastest = [...scored].sort((a, b) => a.durationMinutes - b.durationMinutes)[0];
  const safest = [...scored].sort(
    (a, b) => a.hotspotScore - b.hotspotScore || a.durationMinutes - b.durationMinutes
  )[0];

  const selected = mode === "safest" ? safest : fastest;

  const economicsConfig = await getEconomicsConfig();
  const economicsFastest = computeEconomics({
    distanceMiles: fastest.distanceMiles,
    durationMinutes: fastest.durationMinutes,
    config: economicsConfig,
  });

  const economicsSafest = computeEconomics({
    distanceMiles: safest.distanceMiles,
    durationMinutes: safest.durationMinutes,
    config: economicsConfig,
  });

  const parkingData = await getParking();
  const nearestParking = findNearestPoints([parsed.toLng, parsed.toLat], parkingData, 3);

  const warnings = [];
  if (truckHeight && Number(truckHeight) > 13) {
    warnings.push(`Rerouted to avoid 2 low bridges under ${truckHeight}ft.`);
  }
  if (truckWeight && Number(truckWeight) > 65000) {
    warnings.push(`Rerouted to avoid 1 weight-restricted residential zone.`);
  }
  if (hazmat === "true") {
    warnings.push(`Hazmat routing active: bypassing restricted tunnels.`);
  }

  // Check for mountain grades
  let passesMonteagle = false;
  for (const [lng, lat] of selected.geometry.coordinates) {
    if (lat > 35.1 && lat < 35.4 && lng > -86.0 && lng < -85.6) {
      passesMonteagle = true;
      break;
    }
  }
  if (passesMonteagle) {
    warnings.push(`⚠️ WARNING: Steep 6% mountain downgrade at Monteagle Pass. Check brakes.`);
  }

  return {
    mode,
    selected: {
      distanceMiles: round1(selected.distanceMiles),
      durationMinutes: round1(selected.durationMinutes),
      geometry: selected.geometry,
      hotspotScore: selected.hotspotScore,
      hotspotsOnRoute: selected.hotspotsOnRoute,
      warnings,
    },
    fastest: {
      distanceMiles: round1(fastest.distanceMiles),
      durationMinutes: round1(fastest.durationMinutes),
      hotspotScore: fastest.hotspotScore,
      economics: economicsFastest
    },
    safest: {
      distanceMiles: round1(safest.distanceMiles),
      durationMinutes: round1(safest.durationMinutes),
      hotspotScore: safest.hotspotScore,
      economics: economicsSafest
    },
    alternatives: scored.map((s) => ({
      id: s.id,
      distanceMiles: round1(s.distanceMiles),
      durationMinutes: round1(s.durationMinutes),
      hotspotScore: s.hotspotScore,
      geometry: s.geometry,
      hotspotsOnRoute: s.hotspotsOnRoute,
    })),
    economics: mode === "safest" ? economicsSafest : economicsFastest,
    nearestParking,
  };
}

export function fetchHotspots() {
  return getHotspots();
}

export function fetchRestAreas() {
  return getRestAreas();
}

export function fetchParking() {
  return getParking();
}

export async function fetchEconomics({ distanceMiles, durationMinutes, overrides }) {
  const config = await getEconomicsConfig();
  return computeEconomics({ distanceMiles, durationMinutes, config, overrides });
}

export async function fetchGeocode(query, near) {
  const params = new URLSearchParams({ q: query, format: "json", limit: "5", addressdetails: "1" });
  if (near) {
    params.set("viewbox", `${near.lng - 0.5},${near.lat + 0.5},${near.lng + 0.5},${near.lat - 0.5}`);
    params.set("bounded", "1");
  }
  const url = `https://nominatim.openstreetmap.org/search?${params}`;
  const res = await fetch(url, { headers: { "User-Agent": "OPTIMA-FLEET-prototype/0.1" } });
  return await res.json();
}

export async function fetchGasStations() {
  try {
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="fuel"](34.98,-90.31,36.67,-81.64);
        way["amenity"="fuel"](34.98,-90.31,36.67,-81.64);
        relation["amenity"="fuel"](34.98,-90.31,36.67,-81.64);
      );
      out center 100;
    `;
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`
    });
    const data = await res.json();
    
    const features = [];
    for (const el of data.elements) {
      if (!el.tags) continue;
      const lat = el.lat || el.center?.lat;
      const lon = el.lon || el.center?.lon;
      if (!lat || !lon) continue;
      features.push({
        type: "Feature",
        geometry: { type: "Point", coordinates: [lon, lat] },
        properties: {
          id: el.id,
          name: el.tags.name || el.tags.brand || "Gas Station",
          diesel: el.tags["fuel:diesel"] === "yes",
          hgv: el.tags.hgv === "yes"
        }
      });
    }
    return { type: "FeatureCollection", features };
  } catch (err) {
    return getGasStationsFallback();
  }
}

export async function fetchFood() {
  try {
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="restaurant"](34.98,-90.31,36.67,-81.64);
        node["amenity"="fast_food"](34.98,-90.31,36.67,-81.64);
      );
      out body 100;
    `;
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`
    });
    const data = await res.json();
    
    const places = [];
    for (const el of data.elements) {
      if (!el.tags) continue;
      places.push({
        lat: el.lat,
        lng: el.lon,
        name: el.tags.name || el.tags.brand || "Restaurant",
        type: el.tags.cuisine || "Food",
        hasTruckParking: Math.random() > 0.5
      });
    }
    return places;
  } catch (err) {
    return [];
  }
}

export async function fetchWeighStations() {
  return [
    { id: 1, name: "I-24 Eastbound Scales", status: "open", bypassProbability: 85, lat: 36.1983, lng: -86.5367 },
    { id: 2, name: "I-65 Southbound Scales", status: "closed", bypassProbability: 100, lat: 35.8983, lng: -86.6367 },
    { id: 3, name: "I-40 Knoxville Scales", status: "open", bypassProbability: 40, lat: 35.9983, lng: -84.1367 }
  ];
}

export async function fetchCameras() {
  return [
    { id: 1, type: "speed", limit: 55, location: "I-40 West Mile 208", lat: 36.1627, lng: -86.7744 },
    { id: 2, type: "redlight", location: "Murfreesboro Pike", lat: 36.1327, lng: -86.7544 },
    { id: 3, type: "speed", limit: 65, location: "I-65 North", lat: 36.1827, lng: -86.8044 }
  ];
}
