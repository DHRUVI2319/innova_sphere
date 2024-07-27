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
var map = L.map("map").setView([20.5937, 78.9629], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
