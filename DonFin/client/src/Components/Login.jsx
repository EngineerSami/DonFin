import React, { useState } from "react";
import "../Styles/Register.css";
import TopBar from "./TopBar";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'; // Import axios for making API requests

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // For navigating after successful login

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:8000/api/users/login', { email, password });
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard'); 
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        setError(err.response.data.message || "An error occurred during login.");
      } else {
        setError("Network error or server not reachable.");
      }
    }
  };
  
  return (
    <>
      <TopBar />
      <div className="container-register">
        <div className="register-box">
          <h2 style={{color:"white"}} >Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Email..."
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Password..."
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="error">{error}</p>} {/* Display error if any */}

            <button type="submit" className="register-button">Login</button>
          </form>
          <p>Don't have an account? <Link to="/register" className="signin-link">Register</Link></p>
        </div>
      </div>
    </>
  );
};

export default Login;
