// Import necessary modules
const express = require("express");
require("dotenv").config();
const path = require("path");
const axios = require("axios");
const mysql = require("mysql2");

// Initialize express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static("./public"));

let inputText = ""; // Variable to store input text

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'WaterDistributionSystem'

});
db.connect((err) => {
  if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
  }
  console.log('Connected to MySQL');
});
let flowRatesData = [];
const fetchData = () => {
  const query = `
    SELECT 
        afr.FlowRateID,
        n.NodeName AS Ward,
        afr.ActualFlow,
        afr.DateRecorded
    FROM 
        ActualFlowRates afr
    JOIN 
        Nodes n ON afr.NodeID = n.NodeID;
  `;

  db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching data:', err);
          return;
      }
      flowRatesData = results;
      //console.log('Data fetched:', flowRatesData);
  });
};

fetchData();
setInterval(fetchData, 10 * 60 * 1000); // Fetch data every 10 minutes

// Route to get flow rates data
app.get("/flow_rates", (req, res) => {
  res.json(flowRatesData);
});
let data = flowRatesData;
// let data = `ActualFlowRates
// 1, 1, 1600, 2024-07-01 10:00:00
// 2, 2, 1500, 2024-07-01 10:00:00
// 3, 3, 2600, 2024-07-01 10:00:00
// 4, 4, 1700, 2024-07-01 10:00:00
// 5, 5, 1550, 2024-07-01 10:00:00
// 6, 6, 2200, 2024-07-01 10:00:00
// 7, 7, 1600, 2024-07-01 10:00:00
// 8, 8, 1550, 2024-07-01 10:00:00
// 9, 9, 2000, 2024-07-01 10:00:00
// 10, 10, 1900, 2024-07-01 10:00:00
// 11, 11, 1450, 2024-07-01 10:00:00
// 12, 12, 1500, 2024-07-01 10:00:00`; // Hardcoded data for demonstration


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
  const response = streamResponse(inputText + data, sendEventStreamData);


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
    model: "trainmodel",
    messages: [
      {
        role: "user",
        content:
          text         
          ,
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



