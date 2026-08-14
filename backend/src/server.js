import express from "express";
import cors from "cors";

import routeRouter from "./routes/route.js";
import hotspotsRouter from "./routes/hotspots.js";
import restAreasRouter from "./routes/restAreas.js";
import parkingRouter from "./routes/parking.js";
import economicsRouter from "./routes/economics.js";
import geocodeRouter from "./routes/geocode.js";
import gasStationsRouter from "./routes/gasStations.js";
import foodRouter from "./routes/food.js";
import weighStationsRouter from "./routes/weighStations.js";
import camerasRouter from "./routes/cameras.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/route", routeRouter);
app.use("/api/hotspots", hotspotsRouter);
app.use("/api/rest-areas", restAreasRouter);
app.use("/api/parking", parkingRouter);
app.use("/api/economics", economicsRouter);
app.use("/api/geocode", geocodeRouter);
app.use("/api/gas-stations", gasStationsRouter);
app.use("/api/food", foodRouter);
app.use("/api/weigh-stations", weighStationsRouter);
app.use("/api/cameras", camerasRouter);

app.listen(PORT, () => {
  console.log(`OPTIMA-FLEET backend listening on http://localhost:${PORT}`);
});
