import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/MonthDetails.css";
import Sidebar from "./SideBar";
import TopBar from "./TopBar";
import { CanvasJSChart } from "canvasjs-react-charts"; // Correct import

const MonthDetails = () => {
  const { userId, monthId } = useParams();
  const navigate = useNavigate();
  const [month, setMonth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentBudget, setCurrentBudget] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [budget, setBudget] = useState(0);
  const [Challenge, setChallenge] = useState(0);

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

        const storedChallenge = localStorage.getItem(`challenge-${userId}-${monthId}`);
        if (!storedChallenge) {
          const newChallenge = parseFloat((Math.random() * (0.2 - 0.05) + 0.05).toFixed(2));
          setChallenge(newChallenge);
          localStorage.setItem(`challenge-${userId}-${monthId}`, newChallenge);
        } else {
          setChallenge(Number(storedChallenge));
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

  const expensesByDate = month.expenses.reduce((acc, expense) => {
    const date = new Date(expense.date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + expense.cost;
    return acc;
  }, {});

  const chartData = Object.entries(expensesByDate).map(([date, total]) => ({
    label: date,
    y: total,
  }));

  const options = {
    animationEnabled: true,
    title: {
      text: "Daily Expenses Overview",
    },
    axisX: {
      title: "Date",
    },
    axisY: {
      title: "Total Spent",
      prefix: "$",
    },
    data: [
      {
        type: "column",
        dataPoints: chartData,
      },
    ],
  };

  // Chart data for Expense Types & Total Cost
  const expenseTypesData = Object.entries(
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
    return {
      label: originalType,
      y: totalCost,
      percentage: percentage,
    };
  });

  const expenseTypesChartOptions = {
    animationEnabled: true,
    title: {
      text: "Expense Types Breakdown",
    },
    axisX: {
      title: "Expense Type",
    },
    axisY: {
      title: "Total Cost",
      prefix: "$",
    },
    data: [
      {
        type: "pie",
        showInLegend: true,
        indexLabel: "{label}: {y} ({percentage}%)",
        dataPoints: expenseTypesData.map((item) => ({
          label: item.label,
          y: item.y,
          percentage: item.percentage,
        })),
      },
    ],
  };

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
              <h1>Your Challenge: Save {month.budget * Challenge}</h1>
            </div>
          </div>

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

          <div className="month-details" style={{ display: "block" }}>
            <h2>Expense Types & Total Cost</h2>
            {month.expenses && month.expenses.length > 0 ? (
              <CanvasJSChart options={expenseTypesChartOptions} />
            ) : (
              <p>No expenses recorded for this month.</p>
            )}
          </div>

          <div className="month-details" style={{ display: "block" }}>
            <h2>Daily Expenses</h2>
            <CanvasJSChart options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthDetails;
