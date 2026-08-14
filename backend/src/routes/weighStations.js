import { Router } from "express";

const router = Router();

const weighStations = [
  { lat: 35.88, lng: -86.42, name: "I-24 Eastbound Scales", status: "open", bypassProbability: 80 },
  { lat: 36.14, lng: -86.75, name: "I-40 Westbound Scales", status: "closed", bypassProbability: 100 },
  { lat: 35.05, lng: -85.32, name: "I-75 Northbound Scales", status: "open", bypassProbability: 10 },
  { lat: 35.95, lng: -83.91, name: "I-40 Eastbound Scales", status: "open", bypassProbability: 40 },
  { lat: 35.13, lng: -89.98, name: "I-55 Southbound Scales", status: "open", bypassProbability: 95 }
];

router.get("/", (req, res) => {
  res.json(weighStations);
});

export default router;
