// Initialize the map
const map = L.map('map').setView([20.5937, 78.9629], 2); // Centered globally, zoomed out

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define the airports and routes
// Define the airports and routes
const airports = {
    "New York": [40.7128, -74.0060],
    "Los Angeles": [34.0522, -118.2437],
    "London": [51.5074, -0.1278],
    "Paris": [48.8566, 2.3522],
    "Tokyo": [35.6762, 139.6503],
    "Sydney": [-33.8688, 151.2093],
    "Dubai": [25.276987, 55.296249],
    "Mumbai": [19.0760, 72.8777],
    "Shanghai": [31.2304, 121.4737],
    "Singapore": [1.3521, 103.8198],
    "Cairo": [30.0444, 31.2357],
    "Rio de Janeiro": [-22.9068, -43.1729],
    "Buenos Aires": [-34.6037, -58.3816],
    "Delhi": [28.6139, 77.2090],
    "Kolkata": [22.5726, 88.3639],
    "Chennai": [13.0827, 80.2707],
    "Bangalore": [12.9716, 77.5946],
    "Hyderabad": [17.3850, 78.4867]
};

const routes = [
    // Global connections
    { from: "New York", to: "London", distance: 5600 },
    { from: "New York", to: "Paris", distance: 5830 },
    { from: "New York", to: "Dubai", distance: 11000 },
    { from: "New York", to: "Tokyo", distance: 10800 },
    { from: "New York", to: "Mumbai", distance: 12500 },
    { from: "London", to: "Paris", distance: 350 },
    { from: "London", to: "Dubai", distance: 5500 },
    { from: "London", to: "Tokyo", distance: 9550 },
    { from: "London", to: "Mumbai", distance: 7200 },
    { from: "Paris", to: "Dubai", distance: 5200 },
    { from: "Paris", to: "Tokyo", distance: 9700 },
    { from: "Paris", to: "Mumbai", distance: 7050 },
    { from: "Dubai", to: "Mumbai", distance: 2000 },
    { from: "Dubai", to: "Delhi", distance: 2200 },
    { from: "Dubai", to: "Tokyo", distance: 8000 },
    { from: "Tokyo", to: "Shanghai", distance: 2800 },
    { from: "Tokyo", to: "Singapore", distance: 5400 },
    { from: "Tokyo", to: "Sydney", distance: 7800 },
    { from: "Mumbai", to: "Shanghai", distance: 5000 },
    { from: "Mumbai", to: "Singapore", distance: 3900 },
    { from: "Shanghai", to: "Singapore", distance: 3700 },
    { from: "Shanghai", to: "Sydney", distance: 7500 },
    { from: "Singapore", to: "Sydney", distance: 6300 },

    // Inter-city connections in India
    { from: "Mumbai", to: "Delhi", distance: 1400 },
    { from: "Mumbai", to: "Kolkata", distance: 2000 },
    { from: "Mumbai", to: "Chennai", distance: 1300 },
    { from: "Mumbai", to: "Bangalore", distance: 980 },
    { from: "Mumbai", to: "Hyderabad", distance: 710 },
    { from: "Delhi", to: "Kolkata", distance: 1500 },
    { from: "Delhi", to: "Chennai", distance: 2200 },
    { from: "Delhi", to: "Bangalore", distance: 2100 },
    { from: "Delhi", to: "Hyderabad", distance: 1550 },
    { from: "Kolkata", to: "Chennai", distance: 1650 },
    { from: "Kolkata", to: "Bangalore", distance: 1850 },
    { from: "Kolkata", to: "Hyderabad", distance: 1500 },
    { from: "Chennai", to: "Bangalore", distance: 350 },
    { from: "Chennai", to: "Hyderabad", distance: 630 },
    { from: "Bangalore", to: "Hyderabad", distance: 570 },

    // Adding connections to ensure reachability
    { from: "Mumbai", to: "Rio de Janeiro", distance: 14000 },
    { from: "Mumbai", to: "Buenos Aires", distance: 15500 },
    { from: "Sydney", to: "Buenos Aires", distance: 13000 },
    { from: "Dubai", to: "Cairo", distance: 3200 },
    { from: "Cairo", to: "London", distance: 4000 },
    { from: "Singapore", to: "Cairo", distance: 8000 },
    { from: "Tokyo", to: "Rio de Janeiro", distance: 18000 }
];


// Create a graph from the routes
const graph = {};

// Populate the graph with routes
routes.forEach(route => {
    if (!graph[route.from]) graph[route.from] = {};
    if (!graph[route.to]) graph[route.to] = {};
    graph[route.from][route.to] = route.distance;
    graph[route.to][route.from] = route.distance;  // Assuming bidirectional routes
});

// Dijkstra algorithm to find the shortest path
function findShortestPath(graph, start, end) {
    const distances = {};
    const visited = new Set();
    const priorityQueue = [{ city: start, distance: 0 }];
    const previous = {};

    // Initialize distances
    Object.keys(graph).forEach(city => distances[city] = Infinity);
    distances[start] = 0;

    while (priorityQueue.length > 0) {
        priorityQueue.sort((a, b) => a.distance - b.distance);
        const { city, distance } = priorityQueue.shift();

        if (visited.has(city)) continue;
        visited.add(city);

        // Update distances for neighbors
        for (const [neighbor, weight] of Object.entries(graph[city])) {
            const newDistance = distance + weight;
            if (newDistance < distances[neighbor]) {
                distances[neighbor] = newDistance;
                previous[neighbor] = city;
                priorityQueue.push({ city: neighbor, distance: newDistance });
            }
        }
    }

    const path = [];
    let current = end;
    while (current) {
        path.unshift(current);
        current = previous[current];
    }

    return { distance: distances[end], path };
}

// Add markers for airports
Object.entries(airports).forEach(([airport, coords]) => {
    L.marker(coords).addTo(map).bindPopup(airport);
});

// Function to clear previous route
let previousPolyline = null;

function clearPreviousRoute() {
    if (previousPolyline) {
        map.removeLayer(previousPolyline);
    }
}

// Find the shortest path when the button is clicked
document.getElementById("findPath").addEventListener("click", () => {
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;

    if (start === end) {
        document.getElementById("output").innerText = "Start and end airports are the same!";
        return;
    }

    const result = findShortestPath(graph, start, end);
    if (result.distance === Infinity) {
        document.getElementById("output").innerText = "No path found!";
    } else {
        document.getElementById("output").innerText = `Shortest path: ${result.path.join(" → ")} (${result.distance} km)`;

        // Clear previous route
        clearPreviousRoute();

        // Highlight the path on the map with arrows
        const pathCoords = result.path.map(city => airports[city]);
        previousPolyline = L.polyline(pathCoords, {
            color: 'red',
            weight: 4,
            opacity: 0.8,
            smoothFactor: 1
        }).addTo(map);

        const arrowHead = L.polylineDecorator(previousPolyline, {
            patterns: [
                { offset: '100%', repeat: '10%', symbol: L.Symbol.arrowHead({ pixelSize: 10, polygon: false, pathOptions: { stroke: true, color: 'red', weight: 1 } }) }
            ]
        }).addTo(map);

        // Zoom to fit the polyline
        map.fitBounds(previousPolyline.getBounds());
    }
});

