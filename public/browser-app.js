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
var map = L.map("map").setView([22.7196, 75.8577], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
const nodes = [
  { id: 1, name: 'Downtown', lat: 22.7196, lon: 75.8577, type: 'Water Treatment Plant' },
  { id: 2, name: 'North Indore', lat: 22.7276, lon: 75.8597, type: 'Water Treatment Plant' },
  { id: 3, name: 'Industrial Area', lat: 22.7256, lon: 75.8557, type: 'Water Treatment Plant' },
  { id: 4, name: 'South Indore', lat: 22.7156, lon: 75.8607, type: 'Water Treatment Plant' },
  { id: 5, name: 'East Indore', lat: 22.7106, lon: 75.8507, type: 'Water Treatment Plant' },
  { id: 6, name: 'Residential Zone', lat: 22.7356, lon: 75.8707, type: 'Water Treatment Plant' },
  { id: 7, name: 'Western Indore', lat: 22.7256, lon: 75.8457, type: 'Distribution Center' },
  { id: 8, name: 'University Area', lat: 22.7406, lon: 75.8557, type: 'Distribution Center' },
  { id: 9, name: 'Commercial District', lat: 22.7506, lon: 75.8557, type: 'Distribution Center' },
  { id: 10, name: 'Central Business District', lat: 22.7206, lon: 75.8657, type: 'Reservoir' },
  { id: 11, name: 'Suburban Areas', lat: 22.7056, lon: 75.8457, type: 'Reservoir' },
  { id: 12, name: 'City Outskirts', lat: 22.6956, lon: 75.8357, type: 'Reservoir' }
];

// Function to add markers to the map
function addMarkers() {
  nodes.forEach(node => {
      const marker = L.marker([node.lat, node.lon]).addTo(map);
      marker.bindPopup(`<b>${node.name}</b><br>Type: ${node.type}`);
  });
}

// Add markers to the map
addMarkers();