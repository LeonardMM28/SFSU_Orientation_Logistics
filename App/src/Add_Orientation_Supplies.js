import React, { useState } from "react";
import axios from "axios";

import { FiArrowLeftCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./Add_Edit_Orientation_Supplies.css";

function Add_Orientation_Supplies() {
  const [name, setName] = useState("");
  const [picture, setPicture] = useState(null);
  const category = "SUPPLIES";
  const [locationAnnex, setLocationAnnex] = useState("");
  const [quantityAnnex, setQuantityAnnex] = useState(0);
  const [locationHQ, setLocationHQ] = useState("");
  const [quantityHQ, setQuantityHQ] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPicture(file); // Update picture state
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPicture(null); // Clear picture state
      setImagePreview(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("picture", picture);
    formData.append("category", category);
    formData.append("locationAnnex", locationAnnex);
    formData.append("quantityAnnex", quantityAnnex);
    formData.append("locationHQ", locationHQ);
    formData.append("quantityHQ", quantityHQ);

    try {
      await axios.post("http://localhost:3000/add/items", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in local storage
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/orientation-supplies-inventory");
    } catch (error) {
      console.error("Error adding item:", error);
      // Handle error appropriately
    }
  };

  const goToInventory = () => {
    navigate("/orientation-supplies-inventory");
  };

  return (
    <div className="add-edit-orientation-resources">
      <div className="back-icon-container">
        <FiArrowLeftCircle onClick={goToInventory} className="back-icon" />
        <h1 className="title">Add Orientation Supplies</h1>
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="form-fields">
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
              <label>
                Picture:
                <input
                  type="file"
                  name="picture"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="image-preview" />
            )}
          </div>
          <div className="location-quantity">
            <label>
              Location Annex:
              <input
                type="text"
                name="locationAnnex"
                value={locationAnnex}
                onChange={(e) => setLocationAnnex(e.target.value)}
                required
              />
            </label>
            <label>
              Quantity:
              <input
                type="number"
                name="quantityAnnex"
                value={quantityAnnex}
                onChange={(e) => setQuantityAnnex(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="location-quantity">
            <label>
              Location HQ:
              <input
                type="text"
                name="locationHQ"
                value={locationHQ}
                onChange={(e) => setLocationHQ(e.target.value)}
                required
              />
            </label>
            <label>
              Quantity:
              <input
                type="number"
                name="quantityHQ"
                value={quantityHQ}
                onChange={(e) => setQuantityHQ(e.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit">Confirm</button>
        </form>
      </div>
    </div>
  );
}
export default Add_Orientation_Supplies;
