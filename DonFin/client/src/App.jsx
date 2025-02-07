import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Components/Home";
import "./main.css"
import FAQ from "./Components/FAQ";
import Register from "./Components/Register";

const App = () => {
    return (
        <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    );
};

export default App;
