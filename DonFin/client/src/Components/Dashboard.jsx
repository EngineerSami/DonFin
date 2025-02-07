import React, { useEffect, useState } from "react";
import TopBar from "./TopBar";
import Sidebar from "./SideBar"; 
import "../Styles/Dashboard.css"; 
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [months, setMonths] = useState([]);
    const navigate = useNavigate();

    // Get user data from localStorage (assuming the user is logged in and user data is stored there)
    const user = JSON.parse(localStorage.getItem('user'));

    // Fetch user's months on component mount
    useEffect(() => {
        if (user) {
            fetch(`http://localhost:8000/api/users/${user._id}/months`) // Make sure the URL matches your API route
                .then((response) => response.json())
                .then((data) => {
                    if (data.months) {
                        setMonths(data.months); // Assuming the response has a 'months' field
                    } else {
                        console.log("No months found for this user");
                    }
                })
                .catch((error) => console.error("Error fetching months:", error));
        }
    }, [user]);

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

                    {/* Display the user's months */}
                    <div className="months-list">
                        {months.length > 0 ? (
                            months.map((month, index) => (
                                <div key={index} className="month-card">
                                    <h3>{month.monthTitle}</h3>
                                    <p>Start Date: {new Date(month.startDate).toLocaleDateString()}</p>
                                    <p>End Date: {new Date(month.endDate).toLocaleDateString()}</p>
                                    <p>Budget: {month.budget}</p>
                                </div>
                            ))
                        ) : (
                            <p>No months added yet.</p>
                        )}
                        <div className="addmonth" onClick={addBox}>+</div>
                    </div>

                    
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
