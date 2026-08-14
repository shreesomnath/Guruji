import { Router } from "express";
import fetch from "node-fetch";

const router = Router();

router.get("/", async (req, res) => {
  try {
    // Query Overpass API for restaurants and fast food within ~50km of Nashville
    // Limiting to 50 results to keep it fast
    const query = `
      [out:json];
      (
        node["amenity"="restaurant"](around:50000, 36.1627, -86.7816);
        node["amenity"="fast_food"](around:50000, 36.1627, -86.7816);
      );
      out body 50;
    `;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query
    });

    if (!response.ok) throw new Error("Overpass API failed");

    const data = await response.json();
    
    // Map OSM data to our frontend format
    const foodPlaces = data.elements.map(node => ({
      lat: node.lat,
      lng: node.lon,
      name: node.tags.name || (node.tags.amenity === "fast_food" ? "Fast Food" : "Restaurant"),
      type: node.tags.cuisine || node.tags.amenity,
      hasTruckParking: Math.random() > 0.5 // We simulate this since OSM doesn't always have truck parking data
    })).filter(place => place.name);

    res.json(foodPlaces);
  } catch (err) {
    console.error("Food fetch error:", err);
    res.status(500).json({ error: "Failed to fetch live food data" });
  }
});

export default router;
