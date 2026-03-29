// Initialize the map with a dark theme (using CartoDB Voyager or similar is better for professional look)
const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
}).addTo(map);

// Realistic Global Airport Data (Approximate coordinates)
const airports = {
    "New York (JFK)": [40.6413, -73.7781],
    "London (LHR)": [51.4700, -0.4543],
    "Paris (CDG)": [49.0097, 2.5479],
    "Dubai (DXB)": [25.2532, 55.3657],
    "Tokyo (HND)": [35.5494, 139.7798],
    "Singapore (SIN)": [1.3644, 103.9915],
    "Sydney (SYD)": [-33.9399, 151.1753],
    "Mumbai (BOM)": [19.0896, 72.8656],
    "Delhi (DEL)": [28.5562, 77.1000],
    "Frankfurt (FRA)": [50.0379, 8.5622],
    "Hong Kong (HKG)": [22.3080, 113.9185],
    "Los Angeles (LAX)": [33.9416, -118.4085],
    "San Francisco (SFO)": [37.6213, -122.3790],
    "Chicago (ORD)": [41.9742, -87.9073],
    "Toronto (YYZ)": [43.6777, -79.6248],
    "Sao Paulo (GRU)": [-23.4356, -46.4731],
    "Johannesburg (JNB)": [-26.1367, 28.2411],
    "Istanbul (IST)": [41.2753, 28.7519],
    "Seoul (ICN)": [37.4602, 126.4407],
    "Bangkok (BKK)": [13.6899, 100.7501],
    "Amsterdam (AMS)": [52.3105, 4.7683],
    "Madrid (MAD)": [40.4839, -3.5680],
    "Rome (FCO)": [41.8003, 12.2389],
    "Cairo (CAI)": [30.1219, 31.4056],
    "Moscow (SVO)": [55.9726, 37.4146]
};

// Realistic Flight Network (Standard global routes)
const routesData = [
    { f: "New York (JFK)", t: "London (LHR)", d: 5555 },
    { f: "New York (JFK)", t: "Paris (CDG)", d: 5837 },
    { f: "New York (JFK)", t: "Toronto (YYZ)", d: 589 },
    { f: "New York (JFK)", t: "Los Angeles (LAX)", d: 3940 },
    { f: "London (LHR)", t: "Paris (CDG)", d: 348 },
    { f: "London (LHR)", t: "Dubai (DXB)", d: 5470 },
    { f: "London (LHR)", t: "Frankfurt (FRA)", d: 655 },
    { f: "London (LHR)", t: "New York (JFK)", d: 5555 },
    { f: "Paris (CDG)", t: "Dubai (DXB)", d: 5240 },
    { f: "Paris (CDG)", t: "Cairo (CAI)", d: 3210 },
    { f: "Dubai (DXB)", t: "Mumbai (BOM)", d: 1930 },
    { f: "Dubai (DXB)", t: "Delhi (DEL)", d: 2190 },
    { f: "Dubai (DXB)", t: "Sydney (SYD)", d: 12040 },
    { f: "Dubai (DXB)", t: "Johannesburg (JNB)", d: 6410 },
    { f: "Mumbai (BOM)", t: "Delhi (DEL)", d: 1150 },
    { f: "Mumbai (BOM)", t: "Singapore (SIN)", d: 3910 },
    { f: "Singapore (SIN)", t: "Sydney (SYD)", d: 6300 },
    { f: "Singapore (SIN)", t: "Tokyo (HND)", d: 5310 },
    { f: "Singapore (SIN)", t: "Hong Kong (HKG)", d: 2590 },
    { f: "Tokyo (HND)", t: "Seoul (ICN)", d: 1180 },
    { f: "Tokyo (HND)", t: "Los Angeles (LAX)", d: 8830 },
    { f: "Hong Kong (HKG)", t: "Bangkok (BKK)", d: 1730 },
    { f: "Istanbul (IST)", t: "London (LHR)", d: 2490 },
    { f: "Istanbul (IST)", t: "Dubai (DXB)", d: 3000 },
    { f: "Cairo (CAI)", t: "Johannesburg (JNB)", d: 6260 },
    { f: "Sao Paulo (GRU)", t: "New York (JFK)", d: 7680 },
    { f: "Sao Paulo (GRU)", t: "Madrid (MAD)", d: 8300 },
    { f: "Frankfurt (FRA)", t: "Moscow (SVO)", d: 2020 },
    { f: "Moscow (SVO)", t: "Seoul (ICN)", d: 6600 },
    { f: "San Francisco (SFO)", t: "Tokyo (HND)", d: 8270 },
    { f: "Chicago (ORD)", t: "London (LHR)", d: 6350 },
    { f: "Amsterdam (AMS)", t: "Singapore (SIN)", d: 10500 },
    { f: "Rome (FCO)", t: "Cairo (CAI)", d: 2130 }
];

// Populate dropdowns
const startSelect = document.getElementById('start');
const endSelect = document.getElementById('end');
startSelect.innerHTML = '';
endSelect.innerHTML = '';

Object.keys(airports).sort().forEach(airport => {
    startSelect.add(new Option(airport, airport));
    endSelect.add(new Option(airport, airport));
});

// Build Graph
const graph = {};
routesData.forEach(r => {
    if (!graph[r.f]) graph[r.f] = {};
    if (!graph[r.t]) graph[r.t] = {};
    graph[r.f][r.t] = r.d;
    graph[r.t][r.f] = r.d;
});

// Dijkstra Implementation
function dijkstra(start, end) {
    const distances = {};
    const prev = {};
    const pq = new Set();

    Object.keys(graph).forEach(v => {
        distances[v] = Infinity;
        pq.add(v);
    });
    distances[start] = 0;

    while (pq.size > 0) {
        let u = null;
        pq.forEach(node => {
            if (u === null || distances[node] < distances[u]) u = node;
        });

        if (distances[u] === Infinity || u === end) break;
        pq.delete(u);

        for (let v in graph[u]) {
            let alt = distances[u] + graph[u][v];
            if (alt < distances[v]) {
                distances[v] = alt;
                prev[v] = u;
            }
        }
    }

    const path = [];
    let curr = end;
    while (curr) {
        path.unshift(curr);
        curr = prev[curr];
    }

    return { distance: distances[end], path: path[0] === start ? path : [] };
}

// Markers for all airports
Object.entries(airports).forEach(([name, coords]) => {
    L.circleMarker(coords, {
        radius: 4,
        fillColor: "#3b82f6",
        color: "#fff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }).bindTooltip(name).addTo(map);
});

let routeLine = null;
let routeDecor = null;

document.getElementById('findPath').onclick = async () => {
    const start = startSelect.value;
    const end = endSelect.value;
    const btn = document.getElementById('findPath');
    const output = document.getElementById('output');
    const card = document.getElementById('resultCard');

    if (start === end) {
        alert("Please select different airports.");
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-plane fa-spin"></i> Calculating Optimal Route...';
    card.classList.remove('visible');

    await new Promise(r => setTimeout(r, 800));

    const res = dijkstra(start, end);

    if (res.path.length === 0) {
        output.innerHTML = "No direct or connecting flight path found.";
    } else {
        output.innerHTML = `
            <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 10px;">OPTIMAL FLIGHT PATH</div>
            <div style="font-weight: 700; color: var(--accent-color); margin-bottom: 5px;">${res.path.join(' → ')}</div>
            <div style="font-size: 1.2rem; font-weight: 600;">Total Distance: ${res.distance.toLocaleString()} km</div>
        `;

        if (routeLine) map.removeLayer(routeLine);
        if (routeDecor) map.removeLayer(routeDecor);

        const latlngs = res.path.map(name => airports[name]);
        routeLine = L.polyline(latlngs, { color: '#3b82f6', weight: 3, opacity: 0.7 }).addTo(map);

        routeDecor = L.polylineDecorator(routeLine, {
            patterns: [
                { offset: '50%', repeat: 0, symbol: L.Symbol.arrowHead({ pixelSize: 10, polygon: false, pathOptions: { stroke: true, color: '#3b82f6' } }) }
            ]
        }).addTo(map);

        map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
    }

    card.classList.add('visible');
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-route"></i> Calculate Shortest Route';
    setTimeout(() => map.invalidateSize(), 400);
};
