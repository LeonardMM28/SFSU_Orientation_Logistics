import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiArrowLeftCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./Planner_Inventory.css";

function Planner_Inventory() {
  const [sessions, setSessions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/sessions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const sessionsData = response.data;

        for (const session of sessionsData) {
          const response = await axios.get(
            `http://localhost:3000/session/${session.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const checklist = response.data.checklist;
          let allItemsInStock = true;

          for (const item of checklist) {
            const itemResponse = await axios.get(
              `http://localhost:3000/items/${item.id}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            const availableQuantity = itemResponse.data.quantity_hq;
            const neededQuantity = item.amount;

            if (availableQuantity < neededQuantity) {
              allItemsInStock = false;
              break;
            }
          }

          if (allItemsInStock && session.status !== "ES") {
            await axios.put(
              `http://localhost:3000/update-session-ES/${session.id}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            session.status = "ES"; // Update the session status in the state
          } else if (!allItemsInStock && session.status !== "NES") {
            await axios.put(
              `http://localhost:3000/update-session-NES/${session.id}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            session.status = "NES"; // Update the session status in the state
          }
        }

        setSessions(sessionsData); // Update the state with the modified sessions data
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  const goToAddEdit = () => {
    navigate("/add-session");
  };

  const goToEditSession = (sessionId) => {
    navigate(`/edit-session/${sessionId}`);
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

  // Inside handleViewSession function
  const handleViewSession = async (sessionId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/session/${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const checklist = response.data.checklist;
      const itemDetails = await Promise.all(
        checklist.map(async (item) => {
          const itemResponse = await axios.get(
            `http://localhost:3000/items/${item.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const availableQuantity = itemResponse.data.quantity_hq;
          const neededQuantity = item.amount;
          const quantityStatus =
            availableQuantity >= neededQuantity ? "green" : "red";
          return {
            ...item,
            details: itemResponse.data,
            quantityStatus: quantityStatus,
            availableQuantity: availableQuantity,
          };
        })
      );
      setModalContent(itemDetails);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching session details:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id}>
                <td>{formatDate(session.date)}</td>
                <td>{session.type}</td>
                <td>{session.attendees}</td>
                <td>{getStatusDot(session.status)}</td>
                <td>
                  <button onClick={() => goToEditSession(session.id)}>
                    Edit
                  </button>
                  <button onClick={() => handleViewSession(session.id)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>Checklist Items</h2>
            <ul>
              {modalContent.map((item) => (
                <li key={item.id}>
                  <div className="item-details-container">
                    <img
                      src={item.details.image}
                      alt={item.details.name}
                      className="item-image"
                    />
                    <div className="item-details">
                      <span className="item-title">{item.details.name}</span>
                      <span className={`item-detail ${item.quantityStatus}`}>
                        {item.availableQuantity >= item.amount
                          ? `${item.amount}/${item.amount}`
                          : `${item.availableQuantity}/${item.amount}`}
                      </span>
                      {/* Add other item details here */}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Planner_Inventory;
