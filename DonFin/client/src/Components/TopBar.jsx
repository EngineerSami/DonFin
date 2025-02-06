import React from "react";
import "../Styles/TopBar.css";
import image from "../images/Logo.png";

function TopBar() {
  return (
    <div className="top-bar">
      <div className="logo">
        <img src={image} alt="Logo" />
      </div>
      <nav className="nav-links">
        <a href="/" className="nav-link">Home</a>
        <a href="/faq" className="nav-link">FAQ</a>
        <a href="/about" className="nav-link">About Us</a>
        <a href="/login" className="login-btn nav-link">Login</a>
        <a href="/register" className="register-btn nav-link">Register</a>
      </nav>
    </div>
  );
}

export default TopBar;
