import React from "react";
import TopBar from "./TopBar";
import Sidebar from "./SideBar"; // Make sure the correct path is used for Sidebar
import "../Styles/Dashboard.css"; // Add a CSS file for styling the layout
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate(); 

    const addBox = () => {
        navigate("/addmonth"); 
    };

    return (
        <div className="dashboard-container">
            <TopBar />
            <div className="dashboard-content">
                <Sidebar />
                <div className="main-content">
                    <h1>Your Months</h1>
                    <div className="addmonth" onClick={addBox}>+</div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
