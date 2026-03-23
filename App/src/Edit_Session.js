import axios from "axios";
import React, { useEffect, useState } from "react";
import { PiArrowSquareLeftDuotone } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";
import "./Add_Edit_Session.css";
import Modal from "./Modal"; // Import the Modal component

function Edit_Session() {
  const [selectedButton, setSelectedButton] = useState(null);
  const [supplies, setSupplies] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [modalImage, setModalImage] = useState(""); // State to store the image URL
  const [modalAltText, setModalAltText] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search query
  const { sessionId } = useParams(); // Get sessionId from URL params
  const [formData, setFormData] = useState({
    date: "",
    type: "",
    attendees: "",
    checklist: {},
  });
  const [isAuthorized, setIsAuthorized] = useState(false);

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
        if (response.status === 401) {
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
        }
      } catch (error) {
        console.error("Error checking authorization:", error);
      }
    };

    checkAuthorization();
  }, [navigate]);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get(
          // `http://localhost:3000/session/${sessionId}`,
          `https://sfsulogistics.online/session/${sessionId}`,

          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const sessionData = response.data;
        const formattedDate = new Date(sessionData.date)
          .toISOString()
          .split("T")[0]; // Format date to yyyy-MM-dd
        setFormData({
          date: formattedDate,
          type: sessionData.type,
          attendees: sessionData.attendees,
          checklist: sessionData.checklist.reduce((acc, item) => {
            acc[item.id] = item.amount;
            return acc;
          }, {}),
        });
        setSelectedButton(sessionData.type);
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const response = await axios.get(
          // "http://localhost:3000/items/supplies",
          "https://sfsulogistics.online/items/supplies",

          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSupplies(response.data);
      } catch (error) {
        console.error("Error fetching supplies:", error);
      }
    };

    fetchSupplies();
  }, []);

  if (!isAuthorized) {
    return null; // Render a loading state while authorization check is in progress
  }

  const goToInventory = () => {
    navigate("/planner-inventory");
  };

  const handleButtonClick = (buttonType) => {
    setSelectedButton(buttonType);
    setFormData((prevFormData) => ({
      ...prevFormData,
      type: buttonType,
    }));
  };

  const handleChecklistChange = (id, amount) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      checklist: {
        ...prevFormData.checklist,
        [id]: amount,
      },
    }));
  };

  const handleRemoveItem = (id) => {
    setFormData((prevFormData) => {
      const updatedChecklist = { ...prevFormData.checklist };
      delete updatedChecklist[id];
      return {
        ...prevFormData,
        checklist: updatedChecklist,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { date, type, attendees, checklist } = formData;
    const itemsChecklist = Object.entries(checklist).map(([id, amount]) => ({
      id,
      amount,
    }));

    try {
      const response = await axios.put(
        // `http://localhost:3000/edit/session/${sessionId}`,
        `https://sfsulogistics.online/edit/session/${sessionId}`,

        { date, type, attendees, checklist: itemsChecklist },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Session updated successfully:", response.data);
      navigate("/planner-inventory");
    } catch (error) {
      console.error("Error updating session:", error);
    }
  };

  const handleOpenModal = (imageUrl, altText) => {
    setModalImage(imageUrl);
    setModalAltText(altText);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const filteredSupplies = supplies.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle search query change
  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="add-edit-sessions">
      <div className="back-icon-container">
        <PiArrowSquareLeftDuotone
          onClick={goToInventory}
          className="back-icon"
        />
        <h1 className="title">Edit Session</h1>
      </div>
      <div className="main-content">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="form-fields">
                <label>
                  Date:
                  <input
                    type="date"
                    name="date"
                    value={formData.date || ""}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <div className="button-group">
                  <button
                    type="button"
                    className={`action-button ${
                      formData.type === "FTF" ? "selected" : ""
                    }`}
                    onClick={() => handleButtonClick("FTF")}
                  >
                    FTF
                  </button>
                  <button
                    type="button"
                    className={`action-button ${
                      formData.type === "TRA" ? "selected" : ""
                    }`}
                    onClick={() => handleButtonClick("TRA")}
                  >
                    TRA
                  </button>
                </div>
                <label>
                  Attendees:
                  <input
                    type="text"
                    name="attendees"
                    value={formData.attendees || ""}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
            </div>
            <label>
              Add items to checklist:
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchQueryChange}
                placeholder="Search items..."
              />
              <div className="scrollable-container-supplies">
                <div className="supplies-list">
                  {filteredSupplies.map((item) => (
                    <div key={item.id} className="supply-item">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="item-image"
                        onClick={() => handleOpenModal(item.image, item.name)}
                      />
                      <div className="item-details">
                        <div className="item-name-container">
                          <span>{item.name}</span>
                        </div>
                        <input
                          type="number"
                          min="1"
                          placeholder="Amount"
                          value={formData.checklist[item.id] || ""}
                          onChange={(e) =>
                            handleChecklistChange(item.id, e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </label>
            <button type="submit" className="submit-button">
              Confirm
            </button>
          </form>
        </div>
        <div className="item-display">
          <h2>Items checklist:</h2>
          <div className="scrollable-container">
            <ul className="checklist-container">
              {Object.entries(formData.checklist).map(([id, amount]) => {
                const item = supplies.find(
                  (supply) => supply.id === parseInt(id)
                );
                if (!item) {
                  return null; // Skip if the item is not found
                }
                return (
                  <li key={id} className="checklist-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="item-image"
                      onClick={() => handleOpenModal(item.image, item.name)}
                    />
                    <div className="item-details">
                      <span className="item-name">[{item.name}]</span>
                      <span className="item-amount">Amount: {amount}</span>
                      <button
                        className="remove-button"
                        onClick={() => handleRemoveItem(id)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {showModal && (
        <Modal
          imageUrl={modalImage}
          altText={modalAltText}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default Edit_Session;
