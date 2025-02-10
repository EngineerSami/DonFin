import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/MonthDetails.css";
import Sidebar from "./SideBar";
import TopBar from "./TopBar";

const MonthDetails = () => {
  const { userId, monthId } = useParams();
  const navigate = useNavigate();
  const [month, setMonth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentBudget, setCurrentBudget] = useState(null);

  useEffect(() => {
    const fetchMonthDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/users/${userId}/month/${monthId}`);
        setMonth(response.data);

        const storedBudget = localStorage.getItem(`currentBudget-${userId}-${monthId}`);
        if (!storedBudget) {
          setCurrentBudget(response.data.budget);
          localStorage.setItem(`currentBudget-${userId}-${monthId}`, response.data.budget);
        } else {
          setCurrentBudget(Number(storedBudget));
        }
      } catch (error) {
        setError("Failed to fetch month details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMonthDetails();
  }, [userId, monthId]);

  const decreaseBudget = async () => {
    if (currentBudget > 0) {
      const newBudget = currentBudget - 1;
      setCurrentBudget(newBudget);
      localStorage.setItem(`currentBudget-${userId}-${monthId}`, newBudget);

      try {
        await axios.put(`http://localhost:8000/api/users/${userId}/month/${monthId}`, {
          currentBudget: newBudget,
        });
      } catch (error) {
        setError("Failed to update the budget. Please try again.");
      }
    } else {
      setError("Budget cannot go below zero.");
    }
  };

  const addExpense = () => {
    navigate(`/users/${userId}/month/${monthId}/create-expense`);
  };

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
              <p><strong>Initial Budget:</strong> {month.budget}</p>
            </div>
            <div className="right">
              <h1>Current Budget: {currentBudget}</h1>
            </div>
          </div>

          {/* Expenses Section */} 
          <div className="month-details" style={{display: "block"}}>
            <div className="expenses-header">
              <h2>Expenses</h2>
              <button onClick={addExpense} className="create-expense-btn">+ Add Expense</button>
            </div>

            {month.expenses && month.expenses.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Expense Type</th>
                    <th>Description</th>
                    <th>Cost</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {month.expenses.map((expense) => (
                    <tr key={expense._id}>
                      <td>{expense.type}</td>
                      <td>{expense.description}</td>
                      <td>{expense.cost}</td>
                      <td>{new Date(expense.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No expenses recorded for this month.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthDetails;
