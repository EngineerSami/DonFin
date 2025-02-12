import React, { useState, useEffect } from "react";
import TopBar from "./TopBar";
import Sidebar from "./SideBar"; 
import "../Styles/Transfer.css"; 
import { useNavigate } from "react-router-dom";

function Transfer() {
  const [amount, setAmount] = useState(1); 
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR"); 
  const [conversionRate, setConversionRate] = useState(null); 
  const [result, setResult] = useState(null); 
  const [currencies, setCurrencies] = useState([]); 

  const navigate = useNavigate();
//  const apiUrl = `https://v6.exchangerate-api.com/v6/d41a59832c4561c16963da0a/latest/${fromCurrency}`; 

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate("/login"); 
      return; 
    }

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data?.conversion_rates) {
          setCurrencies(Object.keys(data.conversion_rates)); 
          const rate = data?.conversion_rates?.[toCurrency];
          if (rate) {
            setConversionRate(rate);
          }
        }
      })
      .catch((error) => console.error("Error fetching currency data:", error));
  }, [fromCurrency, toCurrency, user, navigate]); 

  const handleConvert = () => {
    if (conversionRate) {
      setResult(amount * conversionRate);
    }
  };

  return (
    <div className="dashboard-container">
      <TopBar />
      <div className="dashboard-content">
        <Sidebar />
        <div className="main-content">
          <h1>Transfer your money</h1>
          <div className="currency-conversion">
            <div>
              <label>Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <label>From Currency</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>To Currency</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={handleConvert}>Convert</button>
            {result && (
              <div>
                <h3>
                  {amount} {fromCurrency} = {result.toFixed(2)} {toCurrency}
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transfer;
