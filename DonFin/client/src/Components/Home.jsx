import React from "react";
import TopBar from "./TopBar";
import "../Styles/Home.css";
import image from "../images/Phone.png";


function Home() {
  return (
    <div>
      <TopBar />
      <div className="container">
        <div className="text-container">
          <p className="title">Why You Should Use DonFin</p>
          <p style={{fontSize:"21px" , marginLeft:"20px"}}>
            Managing your finances as a student can be overwhelming, especially
            when you're trying to juggle tuition, living expenses, and savings
            for the future. DonFin is here to simplify the process and help you
            take control of your finances. Here’s why you should use DonFin:
          </p>
          <ul>
            <li><strong>Easy-to-Use Interface:</strong> DonFin offers a simple and intuitive interface that makes tracking your income and expenses a breeze.</li>
            <li><strong>Track Your Income & Expenses:</strong> Stay on top of your finances by easily recording and categorizing all your sources of income and expenses.</li>
            <li><strong>Smart Budgeting:</strong> With DonFin, you can set monthly budgets and track how well you're sticking to them.</li>
            <li><strong>Savings Goals Made Simple:</strong> DonFin allows you to create specific savings goals and track progress in real-time.</li>
            <li><strong>Financial Analytics & Reports:</strong> Get detailed reports and insights on your spending patterns.</li>
          </ul>
        </div>

        <div className="image-container">
          <img src={image} alt="Phone" className="phone"/>
        </div>
      </div>

    </div>
  );
}

export default Home;
