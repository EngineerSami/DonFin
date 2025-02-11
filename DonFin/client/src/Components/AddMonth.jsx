import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "./TopBar";
import Sidebar from "./SideBar";
import "../Styles/Dashboard.css";
import "../Styles/AddMonth.css";

function AddMonth() {
  const [monthTitle, setMonthTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate("/login");  
    }
  }, [user, navigate]);

  const userId = user ? `${user._id}` : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Please log in first.");
      navigate("/login");  
      return;
    }

    if (!monthTitle || !startDate || !endDate || !budget) {
      alert("Please fill all the fields");
      return;
    }

    const monthData = { userId, monthTitle, startDate, endDate, budget };

    try {
      const response = await fetch("http://localhost:8000/api/users/add-month", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(monthData),
      });

      const textResponse = await response.text();
      console.log("Raw Response:", textResponse); 

      try {
        const data = JSON.parse(textResponse); 
        if (response.ok) {
          navigate("/dashboard");
        } else {
          alert(data.message || "Error adding month.");
        }
      } catch (jsonError) {
        console.error("Error parsing JSON response:", jsonError);
        alert("Server returned an unexpected response.");
      }
    } catch (error) {
      console.error("Error in frontend:", error);
      alert("Error adding month.");
    }
  };

  return (
    <div className="dashboard-container">
      <TopBar />
      <div className="dashboard-content">
        <Sidebar />
        <div className="add-content">
          <h1>Add a New Month</h1>
          <form className="add-form" onSubmit={handleSubmit}>
            <div className="input-div">
              <label htmlFor="monthTitle">Month Title</label>
              <input
                className="add-input"
                type="text"
                id="monthTitle"
                value={monthTitle}
                onChange={(e) => setMonthTitle(e.target.value)}
                required
              />
            </div>
            <div className="input-div">
              <label htmlFor="startDate">Start Date</label>
              <input
                className="add-input"
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="input-div">
              <label htmlFor="endDate">End Date</label>
              <input
                className="add-input"
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className="input-div">
              <label htmlFor="budget">Budget</label>
              <input
                className="add-input"
                type="number"
                id="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>
            <button className="addbtn" type="submit">Add Month</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddMonth;
