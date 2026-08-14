import { Router } from "express";
import { getGasStationsGeoJson } from "../lib/overpassClient.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const data = await getGasStationsGeoJson();
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

export default router;
