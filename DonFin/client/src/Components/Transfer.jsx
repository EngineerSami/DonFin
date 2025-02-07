import React, { useState, useEffect } from "react";
import TopBar from "./TopBar";
import Sidebar from "./SideBar"; // Ensure the correct path is used for Sidebar
import "../Styles/Transfer.css"; // Add the correct CSS path

function Transfer() {
  const [amount, setAmount] = useState(1); // Amount to transfer
  const [fromCurrency, setFromCurrency] = useState("USD"); // Source currency
  const [toCurrency, setToCurrency] = useState("EUR"); // Target currency
  const [conversionRate, setConversionRate] = useState(null); // Conversion rate
  const [result, setResult] = useState(null); // Result after conversion
  const [currencies, setCurrencies] = useState([]); // List of currencies

  const apiUrl = `https://v6.exchangerate-api.com/v6/180131638c767797f48306e0/latest/${fromCurrency}`; // Dynamic API URL based on 'fromCurrency'

  // Fetch currency data and conversion rate when the component mounts or when currencies change
  useEffect(() => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data?.conversion_rates) {
          setCurrencies(Object.keys(data.conversion_rates)); // Dynamically set available currencies
          const rate = data?.conversion_rates?.[toCurrency];
          if (rate) {
            setConversionRate(rate);
          }
        }
      })
      .catch((error) => console.error("Error fetching currency data:", error));
  }, [fromCurrency, toCurrency]); // Trigger when the source or target currency changes

  // Function to handle currency conversion
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
