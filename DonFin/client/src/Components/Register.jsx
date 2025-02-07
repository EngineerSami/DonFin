import React from "react";
import "../Styles/Register.css";
import TopBar from "./TopBar";

const Register = () => {
    return (
        <>
        <TopBar/>
        <div className="container-register">
            
            <div className="register-box">
                <h2>Create an Account</h2>
                <form>
                    <div className="input-group">
                        <label>First Name</label>
                        <input type="text" placeholder="First Name..." required />
                    </div>
                    <div className="input-group">
                        <label>Last Name</label>
                        <input type="text" placeholder="Last Name..." required />
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" placeholder="Email..." required />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" placeholder="Password..." required />
                        </div>
                    <div className="input-group">
                        <label>Confirm Password</label>
                        <input type="password" placeholder="Password..." required />
                    </div>
                    
                    <button type="submit" className="register-button">Register</button>
                </form>
                <p>Already have an account? <a href="#" className="signin-link">Sign in</a></p>
            </div>
        </div>
        </>
    );
};

export default Register;
