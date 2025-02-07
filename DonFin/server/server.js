require("dotenv").config();
require("./config/mongoose.config");

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const userRoutes = require("./routes/Routes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Change this to your frontend URL
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/users", userRoutes);

let users = [];

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Handle new user joining the chat (only first name is required)
    socket.on("join_chat", (fullName) => {
        const firstName = fullName.split(' ')[0];  // Extract first name from full name

        // Check if the first name is already taken
        if (users.some(user => user.username === firstName)) {
            socket.emit("username_taken", "Username is already taken, please choose another.");
            return;
        }

        users.push({ id: socket.id, username: firstName });
        io.emit("user_list", users); // Send updated user list to all clients
    });

    // Handle receiving a message
    socket.on("send_message", (data) => {
        console.log(`Message from ${data.username}: ${data.message}`);
        // Broadcast the message to all clients
        io.emit("receive_message", data);
    });

    // Handle user disconnecting
    socket.on("disconnect", () => {
        // Remove the user from the active users list
        users = users.filter(user => user.id !== socket.id);
        // Broadcast the updated user list to all clients
        io.emit("user_list", users);
        console.log(`User Disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
