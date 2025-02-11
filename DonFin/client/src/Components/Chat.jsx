import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import TopBar from "./TopBar";
import Sidebar from "./SideBar";
import "../Styles/Chat.css";

const SERVER_URL = "http://localhost:8000"; 

function Chat() {
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const messagesEndRef = useRef(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const socketRef = useRef(null);

    useEffect(() => {
        const handleFocus = () => {
            setUnreadCount(0);
            socketRef.current.emit("message_read", { username });
        };
    
        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, []);
    

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io.connect(SERVER_URL);
        }
        const socket = socketRef.current;

        const user = JSON.parse(localStorage.getItem("user"));
        const firstName = user ? `${user.firstName} ${user.lastName}` : "Guest";

        if (firstName && firstName !== "Guest") {
            setUsername(firstName);
            socket.emit("join_chat", firstName);
        }

        socket.on("previous_messages", (prevMessages) => {
            setMessages(prevMessages);
        });

        socket.on("user_list", (userList) => {
            console.log("Updated user list:", userList);
            setUsers(userList);
        });

        socket.on("receive_message", (data) => {
            if (document.hidden) {
                setUnreadCount((prevCount) => prevCount + 1);
                new Notification("New Message", { body: `${data.username}: ${data.message}` });
            }
            setMessages((prevMessages) => [...prevMessages, data]);
        });
        

        return () => {
            socket.off("previous_messages");
            socket.off("user_list");
            socket.off("receive_message");
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (message.trim() !== "") {
            const chatMessage = { username, message };
            socketRef.current.emit("send_message", chatMessage);
            setMessage("");
        }
    };

    return (
        <div className="dashboard-container">
            <TopBar />
            <div className="dashboard-content">
                <Sidebar />
                <div className="main-content">
                    <h2>Chat Room</h2>

                    <div className="chat-box">
                        <div className="messages">
                            {messages.map((msg, index) => (
                                <p key={index} className={msg.username === username ? "own-message" : ""}>
                                    <strong>{msg.username}:</strong> {msg.message} <br />
                                    <span className="time">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                                </p>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="chat-input-container">
                        <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
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
