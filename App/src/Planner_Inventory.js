import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiArrowLeftCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./Planner_Inventory.css";

function Planner_Inventory() {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/sessions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  const goToAddEdit = () => {
    navigate("/add-edit-planner");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    };

  const getStatusDot = (status) => {
    switch (status) {
      case "NES":
        return <span className="status-dot red"></span>;
      case "ES":
        return <span className="status-dot yellow"></span>;
      case "READY":
        return <span className="status-dot green"></span>;
      default:
        return null;
    }
  };

  return (
    <div className="sessions">
      <div className="back-icon-container">
        <FiArrowLeftCircle onClick={goToDashboard} className="back-icon" />
        <h1 className="title">SESSION PLANNER</h1>
      </div>
      <div className="search-container">
        <input type="text" className="search-input" placeholder="Search..." />
        <button className="button" onClick={goToAddEdit}>
          ADD SESSION
        </button>
      </div>
      <div className="sessions-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Attendees</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id}>
                <td>{formatDate(session.date)}</td>
                <td>{session.type}</td>
                <td>{session.attendees}</td>
                <td>{getStatusDot(session.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Planner_Inventory;