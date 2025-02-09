import React from "react";
import "../Styles/TopBar.css";
import image from "../images/Logo.png";
import { Link, useNavigate } from "react-router-dom";

function TopBar() {
  const navigate = useNavigate();  


  const isLoggedIn = localStorage.getItem('user'); 

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="top-bar">
      <div className="logo">
        <img src={image} alt="Logo" />
      </div>
      <nav className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/faq" className="nav-link">FAQ</Link>

        {isLoggedIn ? (
          <>
          <Link to="/dashboard" className="nav-link" style={{    minWidth:"117px"}}>User Dashboard</Link>
          <button onClick={handleLogout} className="login-btn nav-link">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-btn nav-link">Login</Link>
            <Link to="/register" className="register-btn nav-link">Register</Link>
          </>
        )}
      </nav>
    </div>
  );
}

export default TopBar;
