import React, { useState } from "react";
import { FiArrowLeftCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./Add_Edit_OL_Uniforms.css";

function Add_Edit_OL_Uniforms() {
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const goToInventory = () => {
    navigate("/ol-uniforms-inventory");
  };

  return (
    <div className="add-edit-ol-uniforms">
      <div className="back-icon-container">
        <FiArrowLeftCircle
          onClick={goToInventory}
          className="back-icon"
        />
        <h1 className="title">Add/Edit OL Uniforms</h1>
      </div>
      <div className="form-container">
        <form>
          <div className="form-group">
            <div className="form-fields">
              <label>
                Name:
                <input type="text" name="name" />
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
              <input type="text" name="locationAnnex" />
            </label>
            <label>
              Quantity:
              <input type="number" name="quantityAnnex" />
            </label>
          </div>
          <div className="location-quantity">
            <label>
              Location HQ:
              <input type="text" name="locationHQ" />
            </label>
            <label>
              Quantity:
              <input type="number" name="quantityHQ" />
            </label>
          </div>
          <button type="submit">Confirm</button>
        </form>
      </div>
    </div>
  );
}

export default Add_Edit_OL_Uniforms;
