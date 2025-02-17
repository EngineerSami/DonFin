import React, { useState } from "react";
import "../Styles/FAQ.css";
import TopBar from "./TopBar";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  const faqData = [
    {
      question: "What is DonFin?",
      answer: "DonFin is a personal finance tracker designed for students to help manage their income, expenses, and savings efficiently."
    },
    {
      question: "How do I track my expenses?",
      answer: "You can log your daily expenses by categorizing them into various categories like rent, food, entertainment, etc."
    },
    {
      question: "Can I set a budget?",
      answer: "Yes, DonFin allows you to set monthly budgets and helps you track your spending to stay within your limits."
    },
    {
      question: "Is DonFin free to use?",
      answer: "Yes, DonFin offers a free version with essential features. Additional advanced features may be available with premium plans."
    },
    {
      question: "How do I contact support?",
      answer: "You can contact our support team through the 'Contact Us' page or by emailing support@donfin.com."
    },
  ];

  return (
    <div className="faq-container">
      <TopBar />
      <div className="faq-wrapper">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqData.map((faq, index) => (
            <div className="faq-item" key={index}>
              <div className="faq-question" onClick={() => toggleAnswer(index)}>
                <h3>{faq.question}</h3>
                <span className={`toggle-icon ${openIndex === index ? 'open' : ''}`}>
                  {openIndex === index ? "▼" : "▼ "}
                </span>
              </div>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
