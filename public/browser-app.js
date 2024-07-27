function submitText() {
  const text = document.getElementById("inputText").value;
  const chatHistory = document.getElementById("chatHistory");

  const messageDiv = document.createElement("div");
  messageDiv.id = "chatBubbleUser";
  messageDiv.textContent = text;

  chatHistory.appendChild(messageDiv);
  chatHistory.scrollTop = chatHistory.scrollHeight;
  inputText.value = "";
  initiateFetch(text);
}
async function initiateFetch(text) {
  //const text = document.getElementById("chatBubbleAi").value;
  try {
    const response = await fetch("/get_text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: text }),
    });
    const data = await response.json();
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
  await startEventStream(); // Wait for startEventStream to finish
}

function setupEventStream() {
  return new Promise((resolve, reject) => {
    const eventSource = new EventSource("/stream");
    const chatHistory = document.getElementById("chatHistory");
    const messageDiv = document.createElement("div");
    messageDiv.id = "chatBubbleAi";

    eventSource.onopen = () => {
      console.log("EventStream opened");
      resolve(eventSource); // Resolve when the stream is successfully opened
    };

    eventSource.onerror = (error) => {
      console.error("EventStream encountered an error:", error);
      reject(error); // Reject on error
    };

    eventSource.onmessage = function (event) {
      const data = JSON.parse(event.data);
      // Append the streamed data to the same div
      messageDiv.textContent += data.message.content; // Adjust according to the actual data structure and formatting needs
      chatHistory.appendChild(messageDiv);
      chatHistory.scrollTop = chatHistory.scrollHeight;
    };
  });
}

async function startEventStream() {
  try {
    const eventSource = await setupEventStream();
    // EventSource is ready to use
    console.log("EventStream is ready", eventSource);
  } catch (error) {
    console.error("Failed to setup EventStream", error);
  }
}

document
  .getElementById("inputText")
  .addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      submitText();
    }
  });

////////////////////////////////////////////////////////////////////////////////////////////////////// *map
const map = L.map('map').setView([22.7196, 75.8577], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Define nodes with their locations and types
const nodes = [
    { id: 1, name: 'Downtown', lat: 22.7196, lon: 75.8577, type: 'Water Treatment Plant', parentId: 1 },
    { id: 2, name: 'North Indore', lat: 22.7276, lon: 75.8597, type: 'Water Treatment Plant', parentId: 1 },
    { id: 3, name: 'Industrial Area', lat: 22.7256, lon: 75.8557, type: 'Water Treatment Plant', parentId: 1 },
    { id: 4, name: 'South Indore', lat: 22.7156, lon: 75.8607, type: 'Water Treatment Plant', parentId: 2 },
    { id: 5, name: 'East Indore', lat: 22.7106, lon: 75.8507, type: 'Water Treatment Plant', parentId: 4 },
    { id: 6, name: 'Residential Zone', lat: 22.7356, lon: 75.8707, type: 'Water Treatment Plant', parentId: 2 },
    { id: 7, name: 'Western Indore', lat: 22.7256, lon: 75.8457, type: 'Distribution Center', parentId: 3 },
    { id: 8, name: 'University Area', lat: 22.7406, lon: 75.8557, type: 'Distribution Center', parentId: 3 },
    { id: 9, name: 'Commercial District', lat: 22.7506, lon: 75.8557, type: 'Distribution Center', parentId: 3 },
    { id: 10, name: 'Central Business District', lat: 22.7206, lon: 75.8657, type: 'Reservoir', parentId: 2 },
    { id: 11, name: 'Suburban Areas', lat: 22.7056, lon: 75.8457, type: 'Reservoir', parentId: 4 },
    { id: 12, name: 'City Outskirts', lat: 22.6956, lon: 75.8357, type: 'Reservoir', parentId: 4 }
];

// Define colors for each group of connected nodes
const colors = [
    'blue',    // Color for group 1
    'green',   // Color for group 2
    'red',     // Color for group 3
    'orange'   // Color for group 4
];

// Group nodes by their parent
const parentGroups = {};
nodes.forEach(node => {
    if (!parentGroups[node.parentId]) {
        parentGroups[node.parentId] = [];
    }
    parentGroups[node.parentId].push(node);
});

// Function to get a color for a node based on its parent group
function getColorForNode(node) {
    return colors[node.parentId - 1]; // Adjust index for color assignment
}

// Function to add markers to the map with colors based on parent group
function addMarkers() {
    nodes.forEach(node => {
        const markerIcon = L.icon({
            iconUrl: `https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@1.0/img/marker-icon-${getColorForNode(node)}.png`,
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        });

        // Create and add marker
        const marker = L.marker([node.lat, node.lon], { icon: markerIcon }).addTo(map);
        marker.bindPopup(`<b>${node.name}</b><br>Type: ${node.type}`);
    });
}

// Function to draw polylines connecting nodes in each group
function drawPolylines() {
    Object.keys(parentGroups).forEach(parentId => {
        const group = parentGroups[parentId];
        const latlngs = group.map(node => [node.lat, node.lon]);

        if (latlngs.length > 1) {
            L.polyline(latlngs, {
                color: getColorForNode(group[0]),
                weight: 2,
                opacity: 0.8,
                dashArray: '5, 5'
            }).addTo(map);
        }
    });
}

// Add markers and draw polylines to the map
addMarkers();
drawPolylines();