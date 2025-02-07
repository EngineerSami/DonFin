import React from "react";
import "../Styles/TopBar.css";
import image from "../images/Logo.png";
import { Link } from "react-router-dom";

function TopBar() {
  return (
    <div className="top-bar">
      <div className="logo">
        <img src={image} alt="Logo" />
      </div>
      <nav className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/faq" className="nav-link">FAQ</Link>
        <a href="/login" className="login-btn nav-link">Login</a>
        <Link to="/register" className="register-btn nav-link">Register</Link>
      </nav>
    </div>
  );
}

export default TopBar;
