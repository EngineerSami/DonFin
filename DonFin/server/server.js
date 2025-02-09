require("dotenv").config();
require("./config/mongoose.config");
const Message = require("./models/Message.Model");

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
        methods: ["GET", "POST"],
    },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/users", userRoutes);

let users = []; // Store active users

io.on("connection", async (socket) => {
    console.log(`User Connected: ${socket.id}`);

    try {
        // Fetch last 50 messages from the database and send them to the user
        const messages = await Message.find().sort({ timestamp: -1 }).limit(50);
        socket.emit("previous_messages", messages.reverse()); // Send in chronological order
    } catch (error) {
        console.error("Error fetching messages:", error);
    }

    // Handle new user joining the chat
    socket.on("join_chat", (username) => {
        if (username && !users.some((user) => user.username === username)) {
            // Add the user to the list if username is valid and unique
            users.push({ id: socket.id, username });
            io.emit("user_list", users); // Emit updated user list to all clients
        }
    });

    // Handle receiving a message
    socket.on("send_message", async (data) => {
        console.log(`Message from ${data.username}: ${data.message}`);
    
        try {
            // Create and save the message in the database
            const newMessage = new Message({
                username: data.username,
                message: data.message,
                timestamp: Date.now(), // Correct way to set the timestamp
            });
    
            await newMessage.save();
    
            // Broadcast the message to all clients, including the saved timestamp
            io.emit("receive_message", {
                username: newMessage.username,
                message: newMessage.message,
                timestamp: newMessage.timestamp, // Send the correct timestamp
            });
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });
    

    // Handle user disconnecting
    socket.on("disconnect", () => {
        // Remove the user from the active users list
        users = users.filter((user) => user.id !== socket.id);
        io.emit("user_list", users); // Emit the updated user list to all clients
        console.log(`User Disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
