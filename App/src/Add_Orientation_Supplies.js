import axios from "axios";
import React, { useEffect, useState } from "react";
import { PiArrowSquareLeftDuotone } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import "./Add_Edit_Orientation_Supplies.css";
import Modal from "./Modal";

function Add_Orientation_Supplies() {
  const [name, setName] = useState("");
  const [picture, setPicture] = useState(null);
  const [consumible, setConsumible] = useState(0);
  const category = "SUPPLIES";
  const [locationAnnex, setLocationAnnex] = useState("");
  const [quantityAnnex, setQuantityAnnex] = useState(0);
  const [locationHQ, setLocationHQ] = useState("");
  const [quantityHQ, setQuantityHQ] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [modalAltText, setModalAltText] = useState("");
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

  if (!isAuthorized) {
    return null;
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPicture(null);
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
    formData.append("consumible", Number(consumible));

    try {
      const response = await axios.post(
        // "http://localhost:3000/add/items",
        "https://sfsulogistics.online:3000/add/items",

        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert("Item added successfully");
        navigate("/orientation-supplies-inventory");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === "Item name already exists"
      ) {
        alert("Item name already exists");
      }
    }
  };

  const goToInventory = () => {
    navigate("/orientation-supplies-inventory");
  };

  const handleOpenModal = (imageUrl, altText) => {
    setModalImage(imageUrl);
    setModalAltText(altText);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="add-edit-orientation-resources">
      <div className="back-icon-container">
        <PiArrowSquareLeftDuotone
          onClick={goToInventory}
          className="back-icon"
        />

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
              <img
                src={imagePreview}
                alt="Preview"
                className="image-preview"
                onClick={() => handleOpenModal(imagePreview, "Preview")}
              />
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
          <div className="consumable-label">
            <input
              type="checkbox"
              id="consumable"
              name="consumable"
              checked={consumible === 1}
              onChange={(e) => setConsumible(e.target.checked ? 1 : 0)}
            />
            <span>Consumable</span>
          </div>

          <button type="submit">Confirm</button>
        </form>
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
export default Add_Orientation_Supplies;
