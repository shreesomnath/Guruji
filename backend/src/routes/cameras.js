import { Router } from "express";

const router = Router();

const cameras = [
  { lat: 36.16, lng: -86.78, type: "Speed Camera", speedLimit: 55 },
  { lat: 35.84, lng: -86.39, type: "Red Light Camera", speedLimit: null },
  { lat: 35.14, lng: -90.04, type: "Speed Camera", speedLimit: 65 },
  { lat: 35.04, lng: -85.30, type: "Red Light Camera", speedLimit: null },
  { lat: 35.96, lng: -83.92, type: "Speed Camera", speedLimit: 50 },
];

router.get("/", (req, res) => {
  res.json(cameras);
});

export default router;
