import { Router } from "express";
import { hotspots } from "../lib/dataStore.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(hotspots);
});

export default router;
