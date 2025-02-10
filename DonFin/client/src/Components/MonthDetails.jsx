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
  const [totalCost, setTotalCost] = useState(0);
  const [budget, setBudget] = useState(0);

  useEffect(() => {
    const fetchMonthDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/users/${userId}/month/${monthId}`);
        setMonth(response.data);
        setBudget(response.data.budget);

        const storedBudget = localStorage.getItem(`currentBudget-${userId}-${monthId}`);
        if (!storedBudget) {
          setCurrentBudget(response.data.budget);
          localStorage.setItem(`currentBudget-${userId}-${monthId}`, response.data.budget);
        } else {
          setCurrentBudget(Number(storedBudget));
        }

        if (response.data.expenses && response.data.expenses.length > 0) {
          const totalCost = response.data.expenses.reduce((acc, expense) => acc + expense.cost, 0);
          setTotalCost(totalCost);
        } else {
          setTotalCost(0);
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
    const newBudget = budget - totalCost;
    setCurrentBudget(newBudget);
    localStorage.setItem(`currentBudget-${userId}-${monthId}`, newBudget);

    try {
      await axios.put(`http://localhost:8000/api/users/${userId}/month/${monthId}`, { currentBudget: newBudget });
    } catch (error) {
      setError("Failed to update the budget. Please try again.");
    }
  };

  const addExpense = () => {
    navigate(`/users/${userId}/month/${monthId}/create-expense`);
  };

  // Recalculate total cost and current budget whenever expenses are updated
  useEffect(() => {
    if (month && month.expenses) {
      const updatedTotalCost = month.expenses.reduce((acc, expense) => acc + expense.cost, 0);
      setTotalCost(updatedTotalCost);
      setCurrentBudget(budget - updatedTotalCost);
    }
  }, [month, budget]);

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
              <h1>Total Expense: {totalCost}</h1>
            </div>
          </div>

          {/* Expenses Section */}
          <div className="month-details" style={{ display: "block" }}>
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
                  {month.expenses.slice().reverse().map((expense) => (
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

          {/* Expense Types & Total Cost Section */}
          <div className="month-details" style={{ display: "block" }}>
            <h2>Expense Types & Total Cost</h2>
            {month.expenses && month.expenses.length > 0 ? (
              <ul>
                {Object.entries(
                  month.expenses.reduce((acc, expense) => {
                    const type = expense.type.toLowerCase();
                    if (!acc[type]) {
                      acc[type] = { originalType: expense.type, totalCost: 0 };
                    }
                    acc[type].totalCost += expense.cost;
                    return acc;
                  }, {})
                ).map(([_, { originalType, totalCost }]) => {
                  const percentage = budget > 0 ? ((totalCost / budget) * 100).toFixed(2) : 0;
                  return (
                  <div className="typescost" key={originalType} style={{ color: "black" , display: "inline-block" }}>
                    <div className="circle-container">
                      <div className="circle-background"></div>
                      <div
                        className="circle-foreground"
                        style={{
                          transform: `rotate(${(percentage / 100) * 360}deg)`,  // Rotating based on the percentage
                        }}
                      ></div>
                      <div className="circle-text">{percentage}%</div>
                    </div>
                    <h2>{originalType}: ${totalCost} <br /> <br /></h2>
                  </div>
                  );
                })}
              </ul>
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
