import express from "express";
import { WebSocketServer } from "ws";

const app = express();
const port = 8080;

// Create an Express server
const server = app.listen(port, () => {
  console.log("Server is listening on port " + port);
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Store all connected clients
const clients = new Set();

// Handle WebSocket connections
wss.on("connection", (ws) => {
  // Add new client to the set
  clients.add(ws);
  console.log("A new client connected");

  // Handle incoming messages from a client
  ws.on("message", (data) => {
    // Broadcast the received message to all clients
    console.log("Received message: ", data.toString());

    // Broadcast the message to all connected clients
    for (const client of clients) {
      if (client !== ws && client.readyState === client.OPEN) {
        client.send(data.toString());
      }
    }
  });

  // Handle client disconnection
  ws.on("close", () => {
    clients.delete(ws);
    console.log("A client disconnected");
  });
});
