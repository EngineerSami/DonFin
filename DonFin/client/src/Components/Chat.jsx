import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import TopBar from "./TopBar";
import Sidebar from "./SideBar";
import "../Styles/Chat.css";

const socket = io.connect("http://localhost:8000"); // Change this to your server URL

function Chat() {
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        // Only establish socket connection once
        if (!socket.connected) {
            socket.connect();
        }

        // Get user data from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        const userName = user ? `${user.firstName} ${user.lastName}` : "Guest";
        const firstName = userName.split(' ')[0];  // Extract first name from full name

        // Set the username and emit to join the chat
        if (firstName) {
            setUsername(firstName);
            socket.emit("join_chat", firstName); // Emit first name to join the chat
        }

        // Listen for updated user list from the server
        socket.on("user_list", (userList) => {
            setUsers(userList);
        });

        // Listen for incoming messages
        socket.on("receive_message", (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        // Cleanup: disconnect socket when component is unmounted
        return () => {
            socket.off("user_list"); // Remove event listener
            socket.off("receive_message"); // Remove event listener
            socket.disconnect(); // Disconnect socket on cleanup
        };
    }, []); // Empty dependency array to run the effect only once

    const sendMessage = () => {
        if (message.trim() !== "") {
            // Create message object
            const chatMessage = { username, message };
            // Emit the message to the server
            socket.emit("send_message", chatMessage);
            setMessage(""); // Clear input field after sending
        }
    };

    return (
        <div className="dashboard-container">
            <TopBar />
            <div className="dashboard-content">
                <Sidebar />
                <div className="main-content">
                    <h2>Chat Room</h2>

                    <div className="users-list">
                        <h3>Active Users:</h3>
                        <ul>
                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <li key={index}>{user.username}</li>
                                ))
                            ) : (
                                <li>No active users</li>
                            )}
                        </ul>
                    </div>

                    <div className="chat-box">
                        <div className="messages">
                            {messages.map((msg, index) => (
                                <p key={index}>
                                    <strong>{msg.username}:</strong> {msg.message}
                                </p>
                            ))}
                        </div>

                        <div className="chat-input-container">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="chat-input"
                            />
                            <button onClick={sendMessage} className="send-button">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
