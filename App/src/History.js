import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiArrowLeftCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./History.css";

function History() {
  const [transactions, setTransactions] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [userTier, setUserTier] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkAuthorization = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth-check", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.status === 401 && isMounted) {
          // Invalid or expired token, show unauthorized message and delete session
          alert("Your session has expired, please log in again.");

          const token = localStorage.getItem("token");
          if (token) {
            localStorage.removeItem("token");
            await axios.post("http://localhost:3000/logout", null, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          }

          navigate("/");
        } else if (isMounted) {
          // Token is valid, check user tier
          const decodedToken = JSON.parse(
            atob(localStorage.getItem("token").split(".")[1])
          );
          const response = await axios.get(
            `http://localhost:3000/getUser/${decodedToken.userId}`
          );
          const userTier = response.data.tier;
          if (userTier !== "2") {
            // User does not have the required tier, show unauthorized message and delete session
            const token = localStorage.getItem("token");
            if (token) {
              localStorage.removeItem("token");
              await axios.post("http://localhost:3000/logout", null, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            }
            navigate("/");
            alert("You are not authorized to access this page.");
          } else {
            // Both token and user tier are valid, continue with the component
            setUsername(decodedToken.username);
            setUserId(decodedToken.userId);
            setUserTier(userTier);
            setIsAuthorized(true);
          }
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

    if (!isAuthorized) {
      return null; // Render nothing if not authorized
    }

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
