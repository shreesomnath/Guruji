import { Router } from "express";
import { economicsConfig } from "../lib/dataStore.js";
import { computeEconomics } from "../lib/economics.js";

const router = Router();

router.get("/config", (req, res) => {
  res.json(economicsConfig);
});

router.post("/", (req, res) => {
  const { distanceMiles, durationMinutes, overrides } = req.body ?? {};

  if (typeof distanceMiles !== "number" || typeof durationMinutes !== "number") {
    return res.status(400).json({ error: "distanceMiles and durationMinutes (numbers) are required" });
  }

  const result = computeEconomics({
    distanceMiles,
    durationMinutes,
    config: economicsConfig,
    overrides: overrides ?? {},
  });

  res.json(result);
});

export default router;
