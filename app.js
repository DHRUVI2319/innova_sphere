// Import necessary modules
const express = require("express");
require("dotenv").config();
const path = require("path");
const axios = require("axios");

// Initialize express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static("./public"));

let inputText = "";
// Route to optimize route
app.post("/get_text", async (req, res) => {
  try {
    inputText = req.body.text;
    console.log(inputText);
    res.json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to optimize route" });
  }
});

// Route for streaming responses
app.get("/stream", (req, res) => {
  // Setup headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendEventStreamData = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Assuming streamResponse is defined elsewhere in app.js
  const response = streamResponse(inputText, sendEventStreamData);


  req.on("close", () => {
    console.log("Connection closed");
  });
});

// Catch-all for undefined routes
app.all("*", (req, res) => {
  res.status(404).send(`<h1>Error 404</h1><h4>Page not found</h4>`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});



async function streamResponse(text, sendDataCallback) {
  let responseBody = '';
  // Type check for sendDataCallback
  if (typeof sendDataCallback !== "function") {
    console.error("sendDataCallback must be a function");
    return; // Exit the function if sendDataCallback is not a function
  }

  const postData = {
    model: "llama3.1",
    messages: [
      {
        role: "user",
        content:
          text,
      },
    ],
    stream: true,
  };

  try {
    const response = await axios.post(
      "http://localhost:11434/api/chat",
      postData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "stream", // This tells axios to handle the response as a stream
      }
    );

    response.data.on("data", (chunk) => {
      const parsedChunk = JSON.parse(chunk);
      responseBody += chunk;
      sendDataCallback(parsedChunk);
    });

    response.data.on("end", () => {
      sendDataCallback(" "); // Consider changing this to a more meaningful end-of-stream signal if needed
      return responseBody;
    });
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow or handle error appropriately
  }
}



