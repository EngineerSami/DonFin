import React, { useState } from "react";
import "../Styles/Register.css";
import TopBar from "./TopBar";
import { Link } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({}); 

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let newErrors = {};

        if (formData.firstName.length < 3) newErrors.firstName = "First name must be at least 3 characters.";
        if (formData.lastName.length < 3) newErrors.lastName = "Last name must be at least 3 characters.";
        if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format.";
        if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters.";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return; 

        try {
            const response = await fetch("http://localhost:8000/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("User registered successfully!");
                setFormData({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
                setErrors({});
            } else {
                setMessage(data.message || "Error registering user.");
            }
        } catch (error) {
            setMessage("Server error. Please try again.");
        }
    };

    return (
        <>
            <TopBar />
            <div className="container-register">
                <div className="register-box">
                    <h2 style={{color:"white"}}>Create an Account</h2>
                    {message && <p className="message">{message}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>First Name</label>
                            <input type="text" name="firstName" placeholder="First Name..." required value={formData.firstName} onChange={handleChange} />
                            {errors.firstName && <p className="error">{errors.firstName}</p>}
                        </div>
                        <div className="input-group">
                            <label>Last Name</label>
                            <input type="text" name="lastName" placeholder="Last Name..." required value={formData.lastName} onChange={handleChange} />
                            {errors.lastName && <p className="error">{errors.lastName}</p>}
                        </div>
                        <div className="input-group">
                            <label>Email</label>
                            <input type="email" name="email" placeholder="Email..." required value={formData.email} onChange={handleChange} />
                            {errors.email && <p className="error">{errors.email}</p>}
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <input type="password" name="password" placeholder="Password..." required value={formData.password} onChange={handleChange} />
                            {errors.password && <p className="error">{errors.password}</p>}
                        </div>
                        <div className="input-group">
                            <label>Confirm Password</label>
                            <input type="password" name="confirmPassword" placeholder="Confirm Password..." required value={formData.confirmPassword} onChange={handleChange} />
                            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                        </div>
                        <button type="submit" className="register-button">Register</button>
                    </form>
                    <p>Already have an account? <Link to="/login" className="signin-link">Login</Link></p>
                </div>
            </div>
        </>
    );
};

export default Register;
