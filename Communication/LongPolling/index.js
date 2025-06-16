const express = require("express");

const app = express();

app.use(express.json());

const clients = [];
const data = { id: 1, message: "Initial data" };

// If anyone hits on the root path, we will show them an html page index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Long polling endpoint
app.get("/api/long-poll", (req, res) => {
  try {
    if (data.id != req.query.dataId) {
      // If the data has changed, send the new data
      res.json(data);
    }
    else {
      // If the data has not changed, add the client to the waiting list
      clients.push(res);
    }
    
  } catch (error) {
    console.error("Error in long polling:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to update data and notify clients
// write a get endpoint to update the data because I am just going to test it in the browser
app.get ("/api/update-data", (req, res) => {
  try {
    // update the data
    data.id += 1;
    data.message = `Updated data at ${new Date().toISOString()}`;

    // Notify all waiting clients
    while (clients.length > 0) {
      const client = clients.pop(); // ideally, you would use shift() to get the first client
      client.json(data);
    }

    

  }
  catch (error) {
    console.error("Error updating data:", error);
    res.status(500).send("Internal Server Error");
  }
})

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});