const map = L.map('map').setView([36.8656, -87.4886], 13); // Centered Hopkinsville, KY

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

// Placeholder for RHQC Overlay here later
