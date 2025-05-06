// UERC Fire Simulator - Manual Station Placement Mode Enabled

const map = L.map('map').setView([36.8656, -87.4886], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

const stations = [
  { name: "Station 1", number: 1, lat: 36.8712, lng: -87.4877, trucks: ["ladder-1", "d1", "b1"] },
  { name: "Station 2", number: 2, lat: 36.8435, lng: -87.4773, trucks: ["engine-2"] },
  { name: "Station 3", number: 3, lat: 36.8605, lng: -87.5169, trucks: ["engine-3", "r3"] },
  { name: "Station 4", number: 4, lat: 36.8171, lng: -87.4975, trucks: ["tower-4", "d2"] }
];

stations.forEach(s => s.trucks.forEach(truck => {
  const option = document.createElement("option");
  option.value = truck;
  option.textContent = `${truck.toUpperCase()} (Station ${s.number})`;
  document.getElementById("truck-select").appendChild(option);
}));

stations.forEach(station => {
  const icon = L.icon({
    iconUrl: `assets/station-${station.number}.png`,
    iconSize: [45, 45],
    iconAnchor: [22, 45]
  });
  L.marker([station.lat, station.lng], { icon }).addTo(map).bindPopup(station.name);
});

// 🔧 Manual Placement Tool (Temporary - Log Lat/Lng on Click)
map.on('click', function (e) {
  const { lat, lng } = e.latlng;
  console.log(`{ name: "New Station", lat: ${lat.toFixed(6)}, lng: ${lng.toFixed(6)}, trucks: [] },`);
});

async function startScenario() {
  const truckId = document.getElementById("truck-select").value;
  const station = stations.find(s => s.trucks.includes(truckId));

  const icon = L.icon({
    iconUrl: `assets/${truckId}.png`, iconSize: [40, 40], iconAnchor: [20, 20]
  });
  let truckLat = station.lat, truckLng = station.lng;
  const truckMarker = L.marker([truckLat, truckLng], { icon }).addTo(map);

  const overpassQuery = `
    [out:json];
    area["name"="Hopkinsville"][admin_level=8];
    (way(area)[highway];);
    out geom;
  `;
  const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(overpassQuery);
  const roadData = await fetch(url).then(r => r.json());

  const roads = roadData.elements.filter(e => e.type === "way" && e.geometry && e.tags && e.tags.name);
  const selected = roads[Math.floor(Math.random() * roads.length)];
  const point = selected.geometry[Math.floor(Math.random() * selected.geometry.length)];
  const fireLat = point.lat;
  const fireLng = point.lon;

  const fireIcon = L.icon({ iconUrl: "assets/fire-icon.png", iconSize: [40, 40], iconAnchor: [20, 40] });
  L.marker([fireLat, fireLng], { icon: fireIcon }).addTo(map).bindPopup("🔥 Fire Location").openPopup();

  document.getElementById("dispatch-info").innerHTML = `
    <strong>🔥 STRUCTURE FIRE DISPATCHED</strong><br>
    Road: <strong>${selected.tags.name}</strong><br>
    Truck: ${truckId.toUpperCase()}<br>
  `;

  document.addEventListener("keydown", function (e) {
    const move = 0.0005;
    if (e.key === "ArrowUp") truckLat += move;
    if (e.key === "ArrowDown") truckLat -= move;
    if (e.key === "ArrowLeft") truckLng -= move;
    if (e.key === "ArrowRight") truckLng += move;
    truckMarker.setLatLng([truckLat, truckLng]);

    if (Math.sqrt((truckLat - fireLat) ** 2 + (truckLng - fireLng) ** 2) < 0.0007) {
      alert("✅ You have arrived at the fire!");
    }
  });
}
