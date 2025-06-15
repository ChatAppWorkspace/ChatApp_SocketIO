// --- 1. Import necessary modules ---
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// --- 2. Initialize the Server ---
const app = express();
const server = http.createServer(app);

// --- 3. Configure Socket.IO with CORS ---
// This is the most important change.
// We allow connections from your GitHub Pages domain.
const io = new Server(server, {
  cors: {
    // REPLACE THIS WITH YOUR EXACT GITHUB PAGES URL
    origin: "https://chatappworkspace.github.io/ChatApp_SocketIO/",
    methods: ["GET", "POST"],
  },
});

// Add a basic route to check if the server is running
app.get("/", (req, res) => {
  res.send("Chat server is running!");
});

// --- 4. Handle Socket.IO logic ---
io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Listen for the 'chat message' event from the client
  socket.on("chat message", (msg) => {
    console.log(`Received message from ${msg.username}: ${msg.message}`);
    // Send the message to all connected clients
    io.emit("chat message", msg);
  });

  // Listen for the 'disconnect' event
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// --- 5. Start the Server ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
