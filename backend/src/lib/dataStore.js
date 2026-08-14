import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");

function loadJson(filename) {
  return JSON.parse(readFileSync(path.join(dataDir, filename), "utf-8"));
}

export const hotspots = loadJson("tnCrashHotspots.geojson");
export const restAreas = loadJson("tnRestAreas.geojson");
export const parking = loadJson("tnTruckParking.geojson");
export const economicsConfig = loadJson("economicsConfig.json");
export const gasStationsFallback = loadJson("tnGasStationsFallback.geojson");
