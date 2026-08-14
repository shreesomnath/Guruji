import { Router } from "express";
import { parking } from "../lib/dataStore.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(parking);
});

export default router;
