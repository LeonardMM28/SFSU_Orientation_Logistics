import axios from "axios";
import React, { useEffect, useState } from "react"; // Import React hooks
import { FaArrowUp } from "react-icons/fa"; // Import the arrow up icon
import {
  PiArrowSquareDownRightFill,
  PiArrowSquareLeftDuotone,
  PiArrowSquareUpRightFill,
} from "react-icons/pi";

import { useNavigate } from "react-router-dom";
import Modal from "./Modal"; // Import the Modal component
import "./Orientation_Supplies_Inventory.css";

function Orientation_Supplies_Inventory() {
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentItem, setCurrentItem] = useState(null);
  const [amount, setAmount] = useState("");
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [modalImage, setModalImage] = useState(""); // State to store the image URL
  const [modalAltText, setModalAltText] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [showScrollButton, setShowScrollButton] = useState(false); // State to show or hide scroll button

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
    const handleScroll = () => {
      if (window.pageYOffset > 200) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          "https://sfsulogistics.online:3000/items/supplies",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in localStorage
            },
          }
        );
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching supplies:", error);
      }
    };

    fetchItems();
  }, []);

  const goToAdd = () => {
    navigate("/add-orientation-supplies");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const goToEdit = (id) => {
    navigate(`/edit-orientation-supplies/${id}`);
  };

  const handleActionClick = (item, type) => {
    setCurrentItem(item);
    setModalType(type);
    setModalOpen(true);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleActionConfirm = async () => {
    try {
      const endpoint = modalType === "store" ? "store/item" : "retrieve/item";
      const response = await axios.post(
        `https://sfsulogistics.online:3000/${endpoint}`,
        { itemId: currentItem.id, amount: Number(amount) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(response.data.message);

      const actionDescription =
        modalType === "store"
          ? `Stored ${amount} of item ${currentItem.name} into the Annex`
          : `Retrieved ${amount} of item ${currentItem.name} to the HQ`;

      await axios.post(
        `https://sfsulogistics.online:3000/logAction`,
        { action: actionDescription },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setModalOpen(false);
      window.location.reload(); // To fetch updated items
    } catch (error) {
      console.error(`Error ${modalType}ing item:`, error);
      alert(error.response.data.message || "Error processing request");
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location_annex.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="orientation-inventory">
      <div className="back-icon-container">
        <PiArrowSquareLeftDuotone
          onClick={goToDashboard}
          className="back-icon"
        />
        <h1 className="title">ORIENTATION SUPPLIES</h1>
      </div>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="button" onClick={goToAdd}>
          ADD ITEM
        </button>
      </div>
      <div className="items-container">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item.id} className="item">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="item-image"
                  onClick={() => handleOpenModal(item.image, item.name)}
                />
              )}
              <div className="item-details">
                <h2 className="item-title">{item.name}</h2>
                <div className="item-info">
                  <p className="item-detail">Location: {item.location_annex}</p>
                  <p className="quantity">Quantity: {item.quantity_annex}</p>
                  {item.consumible === 1 && (
                    <p className="item-legend">Consumable</p>
                  )}
                </div>
              </div>
              <div className="item-actions">
                <button
                  className="button small-button store-button"
                  onClick={() => handleActionClick(item, "store")}
                >
                  <PiArrowSquareDownRightFill className="button-icon" />
                  STORE
                </button>
                <button
                  className="button small-button retrieve-button"
                  onClick={() => handleActionClick(item, "retrieve")}
                >
                  <PiArrowSquareUpRightFill className="button-icon" />
                  RETRIEVE
                </button>
                <button
                  onClick={() => goToEdit(item.id)}
                  className="button small-button edit-button"
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-supplies">No supplies available.</p>
        )}
      </div>

      {modalOpen && (
        <div className="modal-overlay-uniform">
          <div className="modal-content">
            <h2>{modalType === "store" ? "Store Item" : "Retrieve Item"}</h2>
            <p>Amount to {modalType === "store" ? "Store" : "Retrieve"}:</p>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              min="0"
            />
            <button className="button" onClick={handleActionConfirm}>
              Confirm
            </button>
            <button
              className="button close-button"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
      {showScrollButton && (
        <button className="scroll-to-top-button" onClick={scrollToTop}>
          <FaArrowUp />
        </button>
      )}
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

export default Orientation_Supplies_Inventory;
