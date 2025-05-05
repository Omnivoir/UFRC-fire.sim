let map = L.map('map').setView([36.8656, -87.4886], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);
loadStations(map);
map.on('mousemove', function (e) {
  const lat = e.latlng.lat.toFixed(5);
  const lng = e.latlng.lng.toFixed(5);
  document.getElementById('latlng-tracker').innerText = `Lat: ${lat}, Lng: ${lng}`;
});
// === Fire Simulator Station Loader (Address-Based) ===

const stations = [
  {
    name: "Station 1",
    number: 1,
    address: "116 Phillip Meacham Wy, Hopkinsville, KY",
    trucks: ["ladder-1", "d1", "b1"]
  },
  {
    name: "Station 2",
    number: 2,
    address: "1209 Skyline Dr, Hopkinsville, KY",
    trucks: ["engine-2"]
  },
  {
    name: "Station 3",
    number: 3,
    address: "3203 Canton St, Hopkinsville, KY",
    trucks: ["engine-3", "r3"]
  },
  {
    name: "Station 4",
    number: 4,
    address: "9505 Jerry Claybourne Way, Hopkinsville, KY",
    trucks: ["tower-4", "d2"]
  }
];

async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.length === 0) throw new Error(`Geocode failed for: ${address}`);
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon)
  };
}

async function loadStations(map) {
  for (const station of stations) {
    try {
      const { lat, lng } = await geocodeAddress(station.address);

      const stationIcon = L.icon({
        iconUrl: `assets/station-${station.number}.png`,
        iconSize: [45, 45],
        iconAnchor: [22, 45]
      });

      L.marker([lat, lng], { icon: stationIcon })
        .addTo(map)
        .bindPopup(`${station.name}<br>${station.address}`);

      station.lat = lat;
      station.lng = lng;
    } catch (err) {
      console.error("Station geocode failed:", station.name, err);
    }
  }
}


    // Add trucks at station (static, not user-controlled)
    station.trucks.forEach(truck => {
        const truckIcon = L.icon({
            iconUrl: `assets/${truck}.png`,
            iconSize: [45, 45],
            iconAnchor: [22, 22]
        });

        L.marker([station.lat, station.lng], {
            icon: truckIcon,
            draggable: false
        }).addTo(map).bindPopup(truck.toUpperCase());
    });
});

// --- 🚨 START SCENARIO FUNCTION ---
function startScenario() {
    const selectedTruck = document.getElementById("truck-select").value;
    const fire = fireLocations[Math.floor(Math.random() * fireLocations.length)];

    // 🔥 Fire icon
    const fireIcon = L.icon({
        iconUrl: 'assets/fire-icon.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
    });

    L.marker([fire.lat, fire.lng], { icon: fireIcon })
        .addTo(map)
        .bindPopup("🔥 Fire Location")
        .openPopup();

    document.getElementById("dispatch-info").innerHTML = `
        <strong>🔥 STRUCTURE FIRE DISPATCHED</strong><br>
        Address: <strong>${fire.address}</strong><br>
        Unit: <strong>${selectedTruck.toUpperCase()}</strong> en route...
    `;

    // 🚒 Find truck's assigned station
    const truckStation = stations.find(st => st.trucks.includes(selectedTruck));

    const truckIcon = L.icon({
        iconUrl: `assets/${selectedTruck}.png`,
        iconSize: [45, 45],
        iconAnchor: [22, 22]
    });

    let truckLat = truckStation.lat;
    let truckLng = truckStation.lng;

    let truckMarker = L.marker([truckLat, truckLng], {
        icon: truckIcon,
        draggable: false
    }).addTo(map).bindPopup(`🚒 ${selectedTruck.toUpperCase()}`);

    // 🎯 Arrow key movement
    document.addEventListener("keydown", function (e) {
        const moveAmount = 0.0005;
        switch (e.key) {
            case "ArrowUp": truckLat += moveAmount; break;
            case "ArrowDown": truckLat -= moveAmount; break;
            case "ArrowLeft": truckLng -= moveAmount; break;
            case "ArrowRight": truckLng += moveAmount; break;
        }
        truckMarker.setLatLng([truckLat, truckLng]);

        const dx = truckLat - fire.lat;
        const dy = truckLng - fire.lng;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.0008) {
            alert("✅ You have arrived at the fire!");
        }
    });

    // 💧 Add hydrant near fire
    const hydrantColors = ["red", "orange", "green", "blue"];
    const hydrantColor = hydrantColors[Math.floor(Math.random() * hydrantColors.length)];
    const hydrantOffset = 0.0004;
    const hydrantLat = fire.lat + (Math.random() > 0.5 ? hydrantOffset : -hydrantOffset);
    const hydrantLng = fire.lng + (Math.random() > 0.5 ? hydrantOffset : -hydrantOffset);

    const hydrantIcon = L.icon({
        iconUrl: `assets/hydrant-${hydrantColor}.png`,
        iconSize: [30, 30],
        iconAnchor: [15, 30]
    });

    L.marker([hydrantLat, hydrantLng], {
        icon: hydrantIcon,
        draggable: false
    }).addTo(map).bindPopup(`💧 Hydrant (${hydrantColor.toUpperCase()})`);
}
