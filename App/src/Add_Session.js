import axios from "axios";
import React, { useEffect, useState } from "react"; // Import React hooks
import { FiArrowLeftCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./Add_Session.css";
import Modal from "./Modal"; // Import the Modal component

function Add_Session() {
  const [selectedButton, setSelectedButton] = useState(null);
  const [supplies, setSupplies] = useState([]);
  const [checklist, setChecklist] = useState({});
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [modalImage, setModalImage] = useState(""); // State to store the image URL
  const [modalAltText, setModalAltText] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search query
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
            await axios.post("https://sfsulogistics.online:3000/logout", null, {
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
    const fetchSupplies = async () => {
      try {
        const response = await axios.get(
          // "http://localhost:3000/items/supplies",
          "https://sfsulogistics.online:3000/items/supplies",

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
  };

  const handleChecklistChange = (id, amount) => {
    setChecklist((prevChecklist) => ({
      ...prevChecklist,
      [id]: amount,
    }));
  };

  const handleRemoveItem = (id) => {
    setChecklist((prevChecklist) => {
      const updatedChecklist = { ...prevChecklist };
      delete updatedChecklist[id];
      return updatedChecklist;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const date = formData.get("date");
    const type = selectedButton;
    const attendees = formData.get("attendees");
    const itemsChecklist = Object.entries(checklist).map(([id, amount]) => ({
      id,
      amount,
    }));

    try {
      const response = await axios.post(
        // "http://localhost:3000/add/session",
        "https://sfsulogistics.online:3000/add/session",

        { date, type, attendees, checklist: itemsChecklist },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Session added successfully:", response.data);
      navigate("/planner-inventory");
    } catch (error) {
      console.error("Error adding session:", error);
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
        <FiArrowLeftCircle onClick={goToInventory} className="back-icon" />
        <h1 className="title">Add Session</h1>
      </div>
      <div className="main-content">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="form-fields">
                <label>
                  Date:
                  <input type="date" name="date" required />
                </label>
                <div className="button-group">
                  <button
                    type="button"
                    className={`action-button ${
                      selectedButton === "FTF" ? "selected" : ""
                    }`}
                    onClick={() => handleButtonClick("FTF")}
                  >
                    FTF
                  </button>
                  <button
                    type="button"
                    className={`action-button ${
                      selectedButton === "TRA" ? "selected" : ""
                    }`}
                    onClick={() => handleButtonClick("TRA")}
                  >
                    TRA
                  </button>
                </div>
                <label>
                  Attendees:
                  <input type="number" name="attendees" required />
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
                      <span>{item.name}</span>
                      <input
                        type="number"
                        min="1"
                        placeholder="Amount"
                        onChange={(e) =>
                          handleChecklistChange(item.id, e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
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
              {Object.entries(checklist).map(([id, amount]) => {
                const item = supplies.find(
                  (supply) => supply.id === parseInt(id)
                );
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
                        type="button"
                        onClick={() => handleRemoveItem(id)}
                        className="remove-button"
                      >
                        REMOVE
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

export default Add_Session;
