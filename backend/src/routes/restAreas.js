import { Router } from "express";
import { restAreas } from "../lib/dataStore.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(restAreas);
});

export default router;
