import React, { useState, useEffect } from "react"; // Import useState and useEffect
import "../Styles/Sidebar.css"; // Ensure you have the correct path for styles
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios for making HTTP requests

function Sidebar() {
  const [userName, setUserName] = useState("Guest");
  const [loading, setLoading] = useState(false); // For tracking loading state
  const [error, setError] = useState(""); // For error handling

  // Assuming `user` is a global state or context; replace it with the correct way to get the user info
  const user = JSON.parse(localStorage.getItem("user")) || null; // Example of getting user data from localStorage
  const userId = user ? user._id : null;

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        setLoading(true); // Set loading to true while fetching
        try {
          const { data } = await axios.get(`http://localhost:8000/api/users/${userId}`);
          setUserName(data.user.firstName +" "+ data.user.lastName); // Set the username from the response
        } catch (err) {
          setError("Failed to fetch user data. Please try again.");
        } finally {
          setLoading(false); // Set loading to false after fetching
        }
      };

      fetchUser(); // Call the fetchUser function if userId exists
    }
  }, [userId]); // The effect depends on userId

  return (
    <div className="sidebar">
      {/* Display the username at the top of the sidebar */}
      <div className="sidebar-user">
        {userId ? (
          <Link to={`/edit-user/${userId}`} className="sidebar-user-name">
            {loading ? "Loading..." : error || userName}
          </Link>
        ) : (
          <span className="sidebar-user-name">{userName}</span>
        )}
      </div>
      <ul className="sidebar-links">
        <li>
          <Link to="/dashboard" className="sidebar-link">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/transfer" className="sidebar-link">
            Transfer
          </Link>
        </li>
        <li>
          <Link to="/chat" className="sidebar-link">
            Chat
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
