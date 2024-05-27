import React, { useEffect, useState } from "react";
import { FiArrowLeftCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./History.css";

function History() {
  const [transactions, setTransactions] = useState([]);

  const navigate = useNavigate();

  const goBack = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:3000/transactions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

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
              <span className="transaction-date">{transaction.date}</span>
              <span className="transaction-username">
                {transaction.username}
              </span>
              <span className="transaction-action">{transaction.action}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default History;