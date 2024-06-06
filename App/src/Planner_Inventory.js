import axios from "axios";
import React, { useEffect, useState } from "react";
import { PiArrowSquareLeftDuotone } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import "./Planner_Inventory.css";

function Planner_Inventory() {
  const [sessions, setSessions] = useState([]);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalImage, setModalImage] = useState(""); // State to store the image URL
  const [modalAltText, setModalAltText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkAuthorization = async () => {
      try {
        const response = await fetch(
          "https://sfsulogistics.online:3000/auth-check",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 401 && isMounted) {
          alert("Your session has expired, please log in again.");
          const token = localStorage.getItem("token");
          if (token) {
            localStorage.removeItem("token");
            // await axios.post("http://localhost:3000/logout", null, {
            await axios.post("https://sfsulogistics.online:3000/logout", null, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          }
          navigate("/");
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
    const fetchSessions = async () => {
      try {
        // const response = await axios.get("http://localhost:3000/sessions", {

        const response = await axios.get(
          "https://sfsulogistics.online:3000/sessions",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const sessionsData = response.data;

        for (const session of sessionsData) {
          const response = await axios.get(
            // `http://localhost:3000/session/${session.id}`,

            `https://sfsulogistics.online:3000/session/${session.id}`,
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
              // `http://localhost:3000/items/${item.id}`,

              `https://sfsulogistics.online:3000/items/${item.id}`,
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

          if (session.status !== "READY") {
            if (allItemsInStock && session.status !== "ES") {
              await axios.put(
                // `http://localhost:3000/update-session-ES/${session.id}`,

                `https://sfsulogistics.online:3000/update-session-ES/${session.id}`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              session.status = "ES";
            } else if (!allItemsInStock && session.status !== "NES") {
              await axios.put(
                // `http://localhost:3000/update-session-NES/${session.id}`,

                `https://sfsulogistics.online:3000/update-session-NES/${session.id}`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              session.status = "NES";
            }
          } else {
            continue;
          }
        }

        setSessions(sessionsData);
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

  const handleViewSession = async (sessionId) => {
    try {
      const response = await axios.get(
        // `http://localhost:3000/session/${sessionId}`,

        `https://sfsulogistics.online:3000/session/${sessionId}`,
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
            // `http://localhost:3000/items/${item.id}`,

            `https://sfsulogistics.online:3000/items/${item.id}`,
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
      setShowChecklistModal(true);
    } catch (error) {
      console.error("Error fetching session details:", error);
    }
  };

  const handleCloseChecklistModal = () => {
    setCurrentSessionId(null);
    setShowChecklistModal(false);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
  };

  const handleOpenImageModal = (imageUrl, altText) => {
    setModalImage(imageUrl);
    setModalAltText(altText);
    setShowImageModal(true);
  };

  const handlePrepareButtonClick = (sessionId) => {
    setCurrentSessionId(sessionId);
    setShowChecklistModal(true);
  };

  const filteredSessions = sessions.filter(
    (session) =>
      session.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formatDate(session.date).includes(searchQuery)
  );

  const handleConfirmPrep = async () => {
    try {
      console.log("Confirm prep for session ID:", currentSessionId);

      await axios.put(
        // `http://localhost:3000/update-session-READY/${currentSessionId}`,

        `https://sfsulogistics.online:3000/update-session-READY/${currentSessionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.id === currentSessionId
            ? { ...session, status: "READY" }
            : session
        )
      );

      console.log("Session status updated to 'READY' successfully");

      setShowChecklistModal(false);

      window.location.reload();
    } catch (error) {
      console.error("Error updating session status or deducting items:", error);
    }
  };

  return (
    <div className="sessions">
      <div className="back-icon-container">
        <PiArrowSquareLeftDuotone
          onClick={goToDashboard}
          className="back-icon"
        />
        <h1 className="title">SESSION PLANNER</h1>
      </div>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />{" "}
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
              <th>Students | Guests</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.map((session) => (
              <tr key={session.id}>
                <td>{formatDate(session.date)}</td>
                <td>{session.type}</td>
                <td>{session.attendees}</td>
                <td>{getStatusDot(session.status)}</td>
                <td>
                  <button
                    className="action-button"
                    onClick={() => goToEditSession(session.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-button"
                    onClick={() => handleViewSession(session.id)}
                  >
                    View
                  </button>
                  {session.status === "ES" && (
                    <button
                      className="action-button"
                      onClick={() => handlePrepareButtonClick(session.id)}
                    >
                      PREPARED
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showChecklistModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseChecklistModal}>
              &times;
            </span>
            {currentSessionId ? (
              <>
                <h2>Are you sure this session prep is good to go?</h2>
                <button className="confirm-button" onClick={handleConfirmPrep}>
                  YES
                </button>
                <button
                  className="confirm-button"
                  onClick={handleCloseChecklistModal}
                >
                  NOT YET
                </button>
              </>
            ) : (
              <>
                <h2>Checklist Items</h2>
                <ul>
                  {modalContent.map((item) => (
                    <li key={item.id}>
                      <div className="item-details-container">
                        <img
                          src={item.details.image}
                          alt={item.details.name}
                          className="item-image"
                          onClick={() =>
                            handleOpenImageModal(
                              item.details.image,
                              item.details.name
                            )
                          }
                        />
                        <span>{item.details.name}</span>
                        <span
                          className={`quantity-status ${item.quantityStatus}`}
                        >
                          {item.availableQuantity} / {item.amount}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
      {showImageModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseImageModal}>
              &times;
            </span>
            <img
              src={modalImage}
              alt={modalAltText}
              className="preview-image"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Planner_Inventory;
