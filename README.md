# Optima Fleet

Optima Fleet is a world-class, AI-driven freight logistics and fleet management platform designed to revolutionize the way transportation companies manage their truck routes, optimize freight economics, and track live fleet data. 

## The Need for Optima Fleet

In the high-stakes logistics industry, routing a commercial truck is vastly more complex than routing a passenger car. Fleet owners and dispatchers face significant challenges every day:
- **Safety Hazards:** Trucks cannot travel on roads with low bridges, strict weight restrictions, or steep mountain grades without severe safety risks.
- **Economic Inefficiency:** Every extra mile driven, toll paid, and gallon of fuel burned directly impacts the bottom line. Traditional map routing fails to account for heavy-duty freight economics.
- **Hours of Service (HOS) Exhaustion:** Drivers are federally mandated to stop and rest, but finding a commercial rest area with available showers and CAT scales is extremely difficult while en-route.
- **Lack of Real-Time Intelligence:** Dispatchers need to see the exact location of their fleet against weather radar overlays and interactive geo-fenced warehouse yards.

## Key Features & Uses

1. **Intelligent Routing & Economics Dashboard:**
   Calculates the safest and most economically viable routes. It automatically bypasses hazardous low bridges and weight-restricted zones, while projecting total trip costs (fuel, wages, maintenance) so dispatchers can bid accurately on freight loads.

2. **Live Environmental Awareness:**
   Equipped with a real-time NEXRAD weather radar overlay, allowing dispatchers to proactively route their drivers around severe storm cells and hazardous driving conditions.

3. **Rest Stop Amenities Tracking:**
   Pulls live data to track truck stops and rest areas along the route. It instantly identifies which facilities offer critical driver amenities such as showers, WiFi, and CAT Scales.

4. **Fleet Mode & Interactive Geo-Fencing:**
   A dedicated Dispatcher UI allows fleet managers to monitor all company trucks live on the map. It features interactive geo-fenced zones (such as warehouse yards) to visually manage restricted or alert areas.

5. **Weigh Stations & Speed Cameras:**
   Visualizes commercial weigh stations, providing their operational status and PrePass bypass probability rates. It also maps known speed traps and red-light cameras with specific speed limit warnings.

6. **Fleet Analytics Panel:**
   A robust executive dashboard that visualizes fleet-wide performance. It tracks weekly total miles, average fuel costs, on-time delivery rates, and provides a real-time bar-chart breakdown of driver Hours of Service (HOS) utilization.

## Technologies Used

- **Frontend:** React, Vite, Leaflet.js (Map Visualization)
- **Backend:** Node.js, Express
- **Geospatial Intelligence:** OpenStreetMap (OSM) Overpass API, CARTO tiles, Iowa Environmental Mesonet (Weather Radar)

## Installation & Setup

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Start the backend API:**
   \`\`\`bash
   cd backend
   npm run dev
   \`\`\`

3. **Start the frontend application:**
   \`\`\`bash
   cd frontend
   npm run dev
   \`\`\`

---

*Developed by Er. Somnath Luitel & Er. Arbin Amagain*
