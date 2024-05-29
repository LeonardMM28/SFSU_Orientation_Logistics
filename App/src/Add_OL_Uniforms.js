import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiArrowLeftCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./Add_Edit_OL_Uniforms.css";
import Modal from "./Modal"; // Import the Modal component

function Add_OL_Uniforms() {
  const [name, setName] = useState("");
  const [picture, setPicture] = useState(null);
  const category = "UNIFORMS";
  const [locationAnnex, setLocationAnnex] = useState("");
  const [quantityAnnex, setQuantityAnnex] = useState(0);
  const [locationHQ, setLocationHQ] = useState("");
  const [quantityHQ, setQuantityHQ] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [modalImage, setModalImage] = useState(""); // State to store the image URL
  const [modalAltText, setModalAltText] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkAuthorization = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth-check", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.status === 401 && isMounted) {
          // Invalid or expired token, show unauthorized message and delete session
          alert("Your session has expired, please log in again.");

          const token = localStorage.getItem("token");
          if (token) {
            localStorage.removeItem("token");
            await axios.post("http://localhost:3000/logout", null, {
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
    return null; // Render a loading state while authorization check is in progress
  }

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
      // await axios.post("http://localhost:3000/add/items", formData, {
      await axios.post("https://sfsulogistics.online:3000/add/items", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in local storage
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/ol-uniforms-inventory");
    } catch (error) {
      console.error("Error adding item:", error);
      // Handle error appropriately
    }
  };

  const goToInventory = () => {
    navigate("/ol-uniforms-inventory");
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
    <div className="add-edit-ol-uniforms">
      <div className="back-icon-container">
        <FiArrowLeftCircle onClick={goToInventory} className="back-icon" />
        <h1 className="title">Add OL Uniforms</h1>
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

export default Add_OL_Uniforms;
