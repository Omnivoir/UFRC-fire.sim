const map = L.map('map').setView([36.8656, -87.4886], 13);

// Load base map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

// Fire stations with coordinates
const stations = [
    { name: "Station 1", lat: 36.86604, lng: -87.48994 },
    { name: "Station 2", lat: 36.87143, lng: -87.47594 },
    { name: "Station 3", lat: 36.86133, lng: -87.48851 }
];

// Plot each station
stations.forEach(station => {
    L.marker([station.lat, station.lng])
        .addTo(map)
        .bindPopup(station.name);
});

// Mock fire locations (to be replaced with RHQC-based logic)
const fireLocations = [
    { lat: 36.869, lng: -87.48, address: "100 Skyline Dr" },
    { lat: 36.861, lng: -87.49, address: "4210 Canton Pike" },
    { lat: 36.858, lng: -87.487, address: "1330 S Virginia St" },
    { lat: 36.873, lng: -87.475, address: "2700 Lafayette Rd" },
];

const fire = fireLocations[Math.floor(Math.random() * fireLocations.length)];

const fireIcon = L.icon({
    iconUrl: 'assets/fire-icon.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

L.marker([fire.lat, fire.lng], { icon: fireIcon })
    .addTo(map)
    .bindPopup("🔥 Fire Location")
    .openPopup();

// Display dispatch
document.getElementById("dispatch-panel").innerHTML = `
    <strong>🔥 STRUCTURE FIRE DISPATCHED</strong><br>
    Address: <strong>${fire.address}</strong><br>
    Units: E1, L1, BC1 en route...
`;

// --- Spawn user fire truck at closest station ---

// Distance function
function getDistance(a, b) {
    const dx = a.lat - b.lat;
    const dy = a.lng - b.lng;
    return Math.sqrt(dx * dx + dy * dy);
}

// Find nearest station to fire
let closestStation = stations[0];
let shortestDist = getDistance(fire, closestStation);

for (let i = 1; i < stations.length; i++) {
    const dist = getDistance(fire, stations[i]);
    if (dist < shortestDist) {
        shortestDist = dist;
        closestStation = stations[i];
    }
}

// Truck icon
const truckIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/809/809957.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

let truckMarker = L.marker([closestStation.lat, closestStation.lng], {
    icon: truckIcon,
    draggable: false
}).addTo(map).bindPopup("🚒 You (Fire Truck)");

// Allow movement with arrow keys
let truckLat = closestStation.lat;
let truckLng = closestStation.lng;

document.addEventListener("keydown", function (e) {
    const moveAmount = 0.0005; // fine-tune movement

    switch (e.key) {
        case "ArrowUp": truckLat += moveAmount; break;
        case "ArrowDown": truckLat -= moveAmount; break;
        case "ArrowLeft": truckLng -= moveAmount; break;
        case "ArrowRight": truckLng += moveAmount; break;
    }

    truckMarker.setLatLng([truckLat, truckLng]);
});
