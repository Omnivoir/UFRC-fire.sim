const map = L.map('map').setView([36.8656, -87.4886], 13);

// Load base map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

// Mock fire locations in Hopkinsville area (RHQC-based soon)
const fireLocations = [
    { lat: 36.869, lng: -87.48, address: "100 Skyline Dr" },
    { lat: 36.861, lng: -87.49, address: "4210 Canton Pike" },
    { lat: 36.858, lng: -87.487, address: "1330 S Virginia St" },
    { lat: 36.873, lng: -87.475, address: "2700 Lafayette Rd" },
];

// Pick a random location
const fire = fireLocations[Math.floor(Math.random() * fireLocations.length)];

// Add fire marker
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

// Update dispatch panel
document.getElementById("dispatch-panel").innerHTML = `
    <strong>🔥 STRUCTURE FIRE DISPATCHED</strong><br>
    Address: <strong>${fire.address}</strong><br>
    Units: E1, L1, BC1 en route...
`;
