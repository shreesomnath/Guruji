import { Router } from "express";

const router = Router();

const foodPlaces = [
  { lat: 35.88, lng: -86.42, name: "Big Rig Diner", type: "American", hasTruckParking: true },
  { lat: 36.14, lng: -86.75, name: "Nash BBQ & Grill", type: "BBQ", hasTruckParking: true },
  { lat: 35.05, lng: -85.32, name: "Chattanooga Chili", type: "Tex-Mex", hasTruckParking: false },
  { lat: 35.95, lng: -83.91, name: "Smoky Mountain Steakhouse", type: "Steakhouse", hasTruckParking: true },
  { lat: 35.13, lng: -89.98, name: "Memphis Rib Rack", type: "BBQ", hasTruckParking: true },
  { lat: 36.32, lng: -82.35, name: "Appalachian Eats", type: "Diner", hasTruckParking: false },
  { lat: 35.61, lng: -88.82, name: "Jackson Quick Bite", type: "Fast Food", hasTruckParking: true }
];

router.get("/", (req, res) => {
  res.json(foodPlaces);
});

export default router;
