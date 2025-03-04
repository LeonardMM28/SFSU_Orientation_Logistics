import axios from "axios";
import React, { useEffect, useState } from "react";
import { PiArrowSquareLeftDuotone } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import "./History.css";

function History() {
  const [transactions, setTransactions] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [userTier, setUserTier] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkAuthorization = async () => {
      try {
        // const response = await fetch("http://localhost:3000/auth-check", {
        const response = await fetch(
          "https://sfsulogistics.online/auth-check",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 401 && isMounted) {
          // Invalid or expired token, show unauthorized message and delete session
          alert("Your session has expired, please log in again.");

          const token = localStorage.getItem("token");
          if (token) {
            localStorage.removeItem("token");
            // await axios.post("http://localhost:3000/logout", null, {
            await axios.post("https://sfsulogistics.online/logout", null, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          }

          navigate("/");
        } else if (response.status === 200 && isMounted) {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Error checking authorization:", error);
      }
    };

    checkAuthorization();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  useEffect(() => {
    const getUsernameAndTierFromToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          setUsername(decodedToken.username);
          setUserId(decodedToken.userId);
          const response = await axios.get(
            // `http://localhost:3000/getUser/${decodedToken.userId}`
            `https://sfsulogistics.online/getUser/${decodedToken.userId}`
          );
          setUserTier(response.data.tier);
        } catch (error) {
          console.error("Error fetching user information:", error);
        }
      }
    };

    getUsernameAndTierFromToken();
  }, []);

  const goBack = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // const response = await fetch("http://localhost:3000/transactions", {
        const response = await fetch("https://sfsulogistics.online/transactions", {
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

  if (!isAuthorized) {
    return null; // Render nothing if not authorized
  }

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="history-page">
      <div className="back-icon-container">
        <PiArrowSquareLeftDuotone onClick={goBack} className="back-icon" />
        <h1 className="title">Transaction History</h1>
      </div>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by action or user..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="transactions-container">
        <ul className="transactions-list">
          <li className="transaction-header">
            <span className="transaction-date">Date</span>
            {userTier === "2" && (
              <span className="transaction-username">Username</span>
            )}
            <span className="transaction-action">Action</span>
          </li>
          {filteredTransactions.map((transaction) => (
            <li key={transaction.id} className="transaction-item">
              <span className="transaction-date">{transaction.date}</span>
              {userTier === "2" && (
                <span className="transaction-username">
                  {transaction.username}
                </span>
              )}
              <span className="transaction-action">{transaction.action}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default History;
