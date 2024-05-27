import React, { useEffect, useState } from "react"; // Import React hooks
import axios from "axios";
import {
  PiArrowSquareDownRightFill,
  PiArrowSquareUpRightFill,
} from "react-icons/pi";
import { FiArrowLeftCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./Orientation_Supplies_Inventory.css";

function Orientation_Supplies_Inventory() {
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentItem, setCurrentItem] = useState(null);
  const [amount, setAmount] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/items/supplies",
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
        `http://localhost:3000/${endpoint}`,
        { itemId: currentItem.id, amount: Number(amount) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(response.data.message);

      // Log the action
      const actionDescription =
        modalType === "store"
          ? `Stored ${amount} of item ${currentItem.name} into the Annex`
          : `Retrieved ${amount} of item ${currentItem.name} to the HQ`;

      await axios.post(
        `http://localhost:3000/logAction`,
        {
          action: actionDescription,
        },
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

  return (
    <div className="orientation-inventory">
      <div className="back-icon-container">
        <FiArrowLeftCircle onClick={goToDashboard} className="back-icon" />
        <h1 className="title">ORIENTATION SUPPLIES</h1>
      </div>
      <div className="search-container">
        <input type="text" className="search-input" placeholder="Search..." />
        <button className="button" onClick={goToAdd}>
          ADD ITEM
        </button>
      </div>
      <div className="items-container">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="item">
              {item.image && (
                <img src={item.image} alt={item.name} className="item-image" />
              )}
              <div className="item-details">
                <h2 className="item-title">{item.name}</h2>
                <p className="item-detail">
                  Location Annex: {item.location_annex}
                </p>
                <p className="item-detail">Location HQ: {item.location_hq}</p>
              </div>
              <div className="item-actions">
                <div className="item-quantities">
                  <button
                    className="button"
                    onClick={() => handleActionClick(item, "retrieve")}
                  >
                    <PiArrowSquareUpRightFill className="button-icon" />
                    RETRIEVE
                  </button>
                  <div className="quantities">
                    <p className="quantity">HQ: {item.quantity_hq}</p>
                    <p className="quantity">Annex: {item.quantity_annex}</p>
                  </div>
                  <button
                    className="button"
                    onClick={() => handleActionClick(item, "store")}
                  >
                    STORE <PiArrowSquareDownRightFill className="button-icon" />
                  </button>
                </div>
                <button
                  onClick={() => goToEdit(item.id)}
                  className="edit-button"
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-uniforms">No uniforms available.</p>
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
    </div>
  );
}

export default Orientation_Supplies_Inventory;
