import React, { useState, useEffect } from "react"; 
import "../Styles/Sidebar.css"; 
import { Link } from "react-router-dom";
import axios from "axios"; 

function Sidebar() {
  const [userName, setUserName] = useState("Guest");
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 

  const user = JSON.parse(localStorage.getItem("user")) || null; 
  const userId = user ? user._id : null;

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(`http://localhost:8000/api/users/${userId}`);
          setUserName(data.user.firstName +" "+ data.user.lastName); 
        } catch (err) {
          setError("Failed to fetch user data. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [userId]); 

  return (
    <div className="sidebar">
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
