import React from "react";
import { FiArrowLeftCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./History.css";

function History() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/dashboard");
  };

  const transactions = [
    {
      id: 1,
      description: "Purchase of office supplies",
      amount: "$200",
      date: "2023-01-15",
    },
    {
      id: 2,
      description: "Client payment received",
      amount: "$1500",
      date: "2023-01-20",
    },
    // Add more transactions as needed
  ];

  return (
    <div className="history-page">
      <div className="back-icon-container">
        <FiArrowLeftCircle onClick={goBack} className="back-icon" />
        <h1 className="title">Transaction History</h1>
      </div>
      <div className="transactions-container">
        <ul className="transactions-list">
          {transactions.map((transaction) => (
            <li key={transaction.id} className="transaction-item">
              <span className="transaction-description">
                {transaction.description}
              </span>
              <span className="transaction-amount">{transaction.amount}</span>
              <span className="transaction-date">{transaction.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default History;
