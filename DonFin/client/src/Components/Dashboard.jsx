import React, { useEffect, useState } from "react";
import TopBar from "./TopBar";
import Sidebar from "./SideBar"; 
import "../Styles/Dashboard.css"; 
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
    const [months, setMonths] = useState([]);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));
    
    useEffect(() => {
        if (!user || !user._id) {
            navigate("/login");
            return;
        }

        fetch(`http://localhost:8000/api/users/${user._id}/months`)
            .then((response) => response.json())
            .then((data) => {
                if (data.months) {
                    setMonths(data.months);
                } else {
                    console.log("No months found for this user");
                }
            })
            .catch((error) => console.error("Error fetching months:", error));
    }, [navigate, user]);

    const addBox = () => {
        navigate("/addmonth"); 
    };

    const handleDelete = async (monthId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this month?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:8000/api/users/${user._id}/delete-month/${monthId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                setMonths(months.filter((month) => month._id !== monthId));
            } else {
                console.log("Failed to delete month");
            }
        } catch (error) {
            console.error("Error deleting month:", error);
            alert("Error deleting month.");
        }
    };

    return (
        <div className="dashboard-container">
            <TopBar />
            <div className="dashboard-content">
                <Sidebar />
                <div className="main-content">
                    <h1>Your Months</h1>
                    <div className="months-list">
                        {months.length > 0 ? (
                            months.map((month) => (
                                <div key={month._id} className="month-card">
                                    <h3>{month.monthTitle}</h3>
                                    <p>Start Date: {new Date(month.startDate).toLocaleDateString()}</p>
                                    <p>End Date: {new Date(month.endDate).toLocaleDateString()}</p>
                                    <p>Budget: {month.budget}</p>
                                    <div style={{ display: "flex" }}>
                                        <button className="delete-btn" onClick={() => handleDelete(month._id)}>Delete</button>
                                        <Link to={`/month-details/${user._id}/${month._id}`} className="view-btn">View</Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p></p>
                        )}
                        <div className="addmonth" onClick={addBox}>+</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;