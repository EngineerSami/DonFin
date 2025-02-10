import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/CreateExpenses.css";
import Sidebar from "./SideBar";
import TopBar from "./TopBar";

const CreateExpenses = () => {
  const { userId, monthId } = useParams();
  const navigate = useNavigate();

  const [expenseData, setExpenseData] = useState({
    type: "",
    description: "",
    cost: "",
    date: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setExpenseData({ ...expenseData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all fields are filled in
    if (!expenseData.type || !expenseData.description || !expenseData.cost || !expenseData.date) {
      setError("All fields are required.");
      setSuccess("");
      return;
    }

    // Ensure cost is a positive number
    const costValue = parseFloat(expenseData.cost);
    if (isNaN(costValue) || costValue <= 0) {
      setError("Please enter a valid cost.");
      setSuccess("");
      return;
    }

    try {
      // Send the POST request to add the expense
      await axios.post(`http://localhost:8000/api/users/${userId}/month/${monthId}/add-expense`, expenseData);

      // Clear form and show success message
      setExpenseData({
        type: "",
        description: "",
        cost: "",
        date: "",
      });
      setSuccess("Expense added successfully!");
      setError("");

      // Redirect to the month details page after a brief delay
      setTimeout(() => {
        navigate(`/month-details/${userId}/${monthId}`);
      }, );

    } catch (err) {
      // Handle errors
      setError("Failed to add expense. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="dashboard-container">
      <TopBar />
      <div className="dashboard-content">
        <Sidebar />
        <div className="main-content">
          <h2>Add Expense</h2>

          {/* Display error or success messages */}
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          {/* Expense form */}
          <form onSubmit={handleSubmit} className="expense-form">
            <div className="form-group">
              <label>Expense Type</label>
              <input
                type="text"
                name="type"
                value={expenseData.type}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={expenseData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Cost</label>
              <input
                type="number"
                name="cost"
                value={expenseData.cost}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={expenseData.date}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn">Add Expense</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateExpenses;
