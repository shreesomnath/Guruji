import { gasStationsFallback } from "./dataStore.js";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours — be a good citizen of the free Overpass instance
const FALLBACK_RETRY_MS = 5 * 60 * 1000; // retry the live source sooner if we fell back
const REQUEST_TIMEOUT_MS = 8000;

// Sampled waypoints along TN's major freight corridors (same cities used in
// the mock hotspot/parking data). We query a radius around each rather than
// the whole state so results stay relevant to freight routes and the
// Overpass query stays fast.
const CORRIDOR_WAYPOINTS = [
  { name: "Memphis", lat: 35.149, lng: -90.019 },
  { name: "Jackson", lat: 35.615, lng: -88.814 },
  { name: "Nashville", lat: 36.163, lng: -86.778 },
  { name: "Cookeville", lat: 36.163, lng: -85.502 },
  { name: "Knoxville", lat: 35.965, lng: -83.945 },
  { name: "Clarksville", lat: 36.53, lng: -87.359 },
  { name: "Murfreesboro", lat: 35.846, lng: -86.39 },
  { name: "Monteagle", lat: 35.243, lng: -85.834 },
  { name: "Chattanooga", lat: 35.046, lng: -85.31 },
  { name: "Franklin", lat: 35.925, lng: -86.869 },
  { name: "Portland", lat: 36.578, lng: -86.516 },
  { name: "Jellico", lat: 36.578, lng: -84.13 },
];

const RADIUS_METERS = 8000;

let cache = { data: null, fetchedAt: 0 };

function buildQuery() {
  const clauses = CORRIDOR_WAYPOINTS.map(
    (wp) => `node["amenity"="fuel"](around:${RADIUS_METERS},${wp.lat},${wp.lng});`
  ).join("\n");
  return `[out:json][timeout:25];\n(\n${clauses}\n);\nout body 300;`;
}

async function fetchLiveGasStations() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "OPTIMA-FLEET-prototype/0.1 (Freight routing project)",
        Accept: "application/json",
      },
      body: `data=${encodeURIComponent(buildQuery())}`,
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`Overpass request failed: ${res.status}`);
    }
    const data = await res.json();

    const seen = new Set();
    const features = [];
    for (const el of data.elements ?? []) {
      if (el.type !== "node" || seen.has(el.id)) continue;
      seen.add(el.id);
      features.push({
        type: "Feature",
        properties: {
          id: `osm-fuel-${el.id}`,
          name: el.tags?.name || el.tags?.brand || "Gas station",
          brand: el.tags?.brand || null,
          source: "OpenStreetMap (Overpass)",
        },
        geometry: { type: "Point", coordinates: [el.lon, el.lat] },
      });
    }

    return {
      type: "FeatureCollection",
      metadata: {
        liveData: true,
        source: "Live OpenStreetMap data via Overpass API — real gas stations near TN freight corridors, cached 6h",
      },
      features,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function getGasStationsGeoJson() {
  const ttl = cache.data?.metadata?.liveData === false ? FALLBACK_RETRY_MS : CACHE_TTL_MS;
  if (cache.data && Date.now() - cache.fetchedAt < ttl) {
    return cache.data;
  }

  try {
    const geojson = await fetchLiveGasStations();
    cache = { data: geojson, fetchedAt: Date.now() };
    return geojson;
  } catch (err) {
    // Overpass's free servers are occasionally unreachable/rate-limited.
    // Fall back to a hand-placed sample set rather than showing nothing.
    const fallback = {
      ...gasStationsFallback,
      metadata: { ...gasStationsFallback.metadata, liveData: false, liveError: err.message },
    };
    cache = { data: fallback, fetchedAt: Date.now() };
    return fallback;
  }
}
