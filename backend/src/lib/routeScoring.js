import * as turf from "@turf/turf";

const HOTSPOT_BUFFER_KM = 1.5;

/**
 * Scores a route by how many crash hotspots (weighted by severity) fall
 * within a buffer around its path. Used to pick the "safest" alternative
 * out of OSRM's candidate routes.
 */
export function scoreRouteAgainstHotspots(routeGeometry, hotspotsCollection) {
  const routeLine = turf.feature(routeGeometry);
  const buffered = turf.buffer(routeLine, HOTSPOT_BUFFER_KM, { units: "kilometers" });

  let hotspotScore = 0;
  const hotspotsOnRoute = [];

  for (const feature of hotspotsCollection.features) {
    if (turf.booleanPointInPolygon(feature, buffered)) {
      hotspotScore += feature.properties.severityWeight;
      hotspotsOnRoute.push(feature.properties);
    }
  }

  return { hotspotScore, hotspotsOnRoute };
}

/**
 * Returns the `count` nearest points (parking sites, rest areas, etc.) to
 * a given [lng, lat] point, each annotated with distanceMiles.
 */
export function findNearestPoints(originLngLat, pointsCollection, count = 3) {
  const origin = turf.point(originLngLat);

  return pointsCollection.features
    .map((feature) => ({
      ...feature.properties,
      coordinates: feature.geometry.coordinates,
      distanceMiles: turf.distance(origin, feature, { units: "miles" }),
    }))
    .sort((a, b) => a.distanceMiles - b.distanceMiles)
    .slice(0, count);
}
