import axios from "axios";
import React, { useEffect, useState } from "react";
import { PiArrowSquareLeftDuotone } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";
import "./Add_Edit_Orientation_Supplies.css";
import Modal from "./Modal"; // Import the Modal component

function Edit_Orientation_Supplies() {
  const { itemId } = useParams();
  const [name, setName] = useState("");
  const [picture, setPicture] = useState(null);
  const [consumible, setConsumible] = useState(false); // Add consumible state

  const category = "SUPPLIES";
  const [locationAnnex, setLocationAnnex] = useState("");
  const [quantityAnnex, setQuantityAnnex] = useState(0);
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
    const fetchItem = async () => {
      try {
        const response = await axios.get(
          `https://sfsulogistics.online/items/${itemId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const item = response.data;
        setName(item.name);
        setConsumible(Boolean(item.consumible)); // Convert to boolean
        setLocationAnnex(item.location_annex);
        setQuantityAnnex(item.quantity_annex);
        setImagePreview(item.image);
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };

    fetchItem();
  }, [itemId]);

  if (!isAuthorized) {
    return null; // Render a loading state while authorization check is in progress
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
    formData.append("locationHQ", ""); // Send as blank
    formData.append("quantityHQ", 0); // Send as blank
    formData.append("consumible", consumible ? 1 : 0); // Append consumible state

    try {
      await axios.put(
        `https://sfsulogistics.online/edit/item/${itemId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate("/orientation-supplies-inventory");
    } catch (error) {
      console.error("Error updating item:", error);
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
        <h1 className="title">Edit Orientation Supplies</h1>
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
          <div className="consumable-label">
            <input
              type="checkbox"
              id="consumable"
              name="consumable"
              checked={consumible} // Check if consumible state is true
              onChange={(e) => setConsumible(e.target.checked)} // Set consumible state directly
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

export default Edit_Orientation_Supplies;
