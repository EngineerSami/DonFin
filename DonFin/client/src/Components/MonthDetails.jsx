import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../Styles/MonthDetails.css";
import Sidebar from "./SideBar";
import TopBar from "./TopBar";

const MonthDetails = () => {
  const { userId, monthId } = useParams(); // Get userId and monthId from URL
  const [month, setMonth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMonthDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/users/${userId}/month/${monthId}`);
        setMonth(response.data);
      } catch (error) {
        setError("Failed to fetch month details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMonthDetails();
  }, [userId, monthId]);

  if (loading) return <p>Loading month details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!month) return <p>No month details found.</p>;

  return (
    <div className="dashboard-container">
    <TopBar />
    <div className="dashboard-content">
        <Sidebar />
        <div className="main-content">
        <div className="month-details">
            <div className="left">
            <h2>{month.monthTitle}</h2>
            <p><strong>Start Date:</strong> {new Date(month.startDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {new Date(month.endDate).toLocaleDateString()}</p>
            <p><strong>Budget:</strong> ${month.budget}</p>
            </div>
            <div className="right">
            <p><strong>Name:</strong>Sami</p>
            </div>
        </div>
        </div>
    </div>
</div>
  );
};

export default MonthDetails;
