import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Components/Home";
import "./main.css"
import FAQ from "./Components/FAQ";

const App = () => {
    return (
        <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </Router>
    );
};

export default App;
