// OL_Uniforms_Inventory.js
import React, { useEffect, useState } from "react";
import { FiArrowLeftCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./OL_Uniforms_Inventory.css";

function OL_Uniforms_Inventory() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/items/uniforms",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching uniforms:", error);
      }
    };

    fetchItems();
  }, []);

  const goToAdd = () => {
    navigate("/add-ol-uniforms");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const goToEdit = (id) => {
    navigate(`/edit-ol-uniforms/${id}`);
  };

  return (
    <div className="inventory">
      <div className="back-icon-container">
        <FiArrowLeftCircle onClick={goToDashboard} className="back-icon" />
        <h1 className="title">OL UNIFORMS</h1>
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
                <p className="item-detail">
                  Quantity Annex: {item.quantity_annex}
                </p>
                <p className="item-detail">Location HQ: {item.location_hq}</p>
                <p className="item-detail">Quantity HQ: {item.quantity_hq}</p>
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
    </div>
  );
}

export default OL_Uniforms_Inventory;
