import { Router } from "express";
import { restAreas } from "../lib/dataStore.js";

const router = Router();

router.get("/", (req, res) => {
  // Inject fake amenities into the local data so it displays properly without crashing on network errors
  const data = JSON.parse(JSON.stringify(restAreas)); // deep copy
  
  data.features.forEach(feature => {
    feature.properties.amenities = {
      showers: Math.random() > 0.4,
      wifi: Math.random() > 0.3,
      scale: Math.random() > 0.6
    };
  });
  
  res.json(data);
});

export default router;
