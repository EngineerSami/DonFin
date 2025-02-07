import React from "react";
import "../Styles/Sidebar.css"; // You can style it as per your design
import { Link } from "react-router-dom";

function Sidebar() {
  // Get the user data from localStorage (assuming the user object is stored there)
  const user = JSON.parse(localStorage.getItem('user'));
  
  // Check if the user exists in localStorage
  const userName = user ? `${user.firstName} ${user.lastName}` : "Guest";

  return (
    <div className="sidebar">
      {/* Display the username at the top of the sidebar */}
      <div className="sidebar-user">
        <p className="sidebar-user-name">{userName}</p>
      </div>
      <ul className="sidebar-links">
        <li>
          <Link to="/dashboard" className="sidebar-link">Dashboard</Link>
        </li>
        <li>
          <Link to="/transfer" className="sidebar-link">Transfer</Link>
        </li>
        <li>
          <Link to="/chat" className="sidebar-link">Chat</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
