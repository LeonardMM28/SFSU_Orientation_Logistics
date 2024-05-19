import React, { useState } from "react";
import { FiArrowLeftCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./Add_Edit_Planner.css";

function Add_Edit_Planner() {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);
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
    navigate("/planner-inventory");
  };

  const handleButtonClick = (buttonType) => {
    setSelectedButton(buttonType);
  };

  return (
    <div className="add-edit-sessions">
      <div className="back-icon-container">
        <FiArrowLeftCircle onClick={goToInventory} className="back-icon" />
        <h1 className="title">Add/Edit Session</h1>
      </div>
      <div className="main-content">
        <div className="form-container">
          <form>
            <div className="form-group">
              <div className="form-fields">
                <label>
                  Date:
                  <input type="date" name="date" />
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
                  <input type="number" name="attendees" />
                </label>
              </div>
            </div>
            <label>
              Add items to checklist:
              <input type="text" name="locationAnnex" />
            </label>
            <button type="submit" className="submit-button">
              Confirm
            </button>
          </form>
        </div>
        <div className="item-display">
          <h2>Items checklist:</h2>
          {/* Display the items needed here */}
        </div>
      </div>
    </div>
  );
}

export default Add_Edit_Planner;
