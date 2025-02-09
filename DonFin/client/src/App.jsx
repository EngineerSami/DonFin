import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Components/Home";
import "./main.css"
import FAQ from "./Components/FAQ";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import Transfer from "./Components/Transfer";
import AddMonth from "./Components/AddMonth";
import Chat from "./Components/Chat";
import EditUser from "./Components/EditUser";

const App = () => {
    return (
        <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/addmonth" element={<AddMonth />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/edit-user/:userId" element={<EditUser />} />
         </Routes>
      </Router>
    );
};

export default App;
