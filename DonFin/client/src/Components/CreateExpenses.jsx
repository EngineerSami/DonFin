import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../Styles/CreateExpenses.css";
import Sidebar from "./SideBar";
import TopBar from "./TopBar";

const CreateExpenses = () => {
  const { userId, monthId } = useParams();
  const [currentBudget, setCurrentBudget] = useState(null);
  const navigate = useNavigate();

  const [expenseData, setExpenseData] = useState({
    type: "",
    description: "",
    cost: "",
    date: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/users/${userId}/month/${monthId}`);
        setCurrentBudget(response.data.currentBudget);
      } catch (err) {
        setError("Failed to fetch budget.");
      }
    };
    fetchBudget();
  }, [userId, monthId]);

  const handleChange = (e) => {
    setExpenseData({ ...expenseData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!expenseData.type || !expenseData.description || !expenseData.cost || !expenseData.date) {
      setError("All fields are required.");
      setSuccess("");
      return;
    }

    const costValue = parseFloat(expenseData.cost);
    if (isNaN(costValue) || costValue <= 0) {
      setError("Please enter a valid cost.");
      setSuccess("");
      return;
    }

    if (currentBudget !== null && currentBudget - costValue < 0) {
      setError("Insufficient budget to add this expense.");
      setSuccess("");
      return;
    }

    try {
      await axios.post(`http://localhost:8000/api/users/${userId}/month/${monthId}/add-expense`, expenseData);
      setExpenseData({ type: "", description: "", cost: "", date: "" });
      setSuccess("Expense added successfully!");
      setError("");
      setTimeout(() => {
        navigate(`/month-details/${userId}/${monthId}`);
      }, );
    } catch (err) {
      setError("Failed to add expense. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="dashboard-container">
      <TopBar />
      <div className="dashboard-content">
        <Sidebar />
        <div className="main-expense">
          <h2>Add Expense</h2>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <form onSubmit={handleSubmit} className="expense-form">
            <Link to={`/month-details/${userId}/${monthId}`} className="view-btn">{"< "} back to your month</Link>
            <p>Current Budget: {currentBudget !== null ? `$${currentBudget}` : "Loading..."}</p>

            <div className="form-group">
              <label>Expense Type</label>
              <input type="text" name="type" value={expenseData.type} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Description</label>
              <input type="text" name="description" value={expenseData.description} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Cost</label>
              <input type="number" name="cost" value={expenseData.cost} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Date</label>
              <input type="date" name="date" value={expenseData.date} onChange={handleChange} required />
            </div>

            <button type="submit" className="submit-btn">Add Expense</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateExpenses;