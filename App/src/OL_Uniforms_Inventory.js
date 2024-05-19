import React from "react";
import { FiArrowLeftCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./OL_Uniforms_Inventory.css";

function OL_Uniforms_Inventory() {

    const navigate = useNavigate();

    const goToAddEdit = () => {
      navigate("/add-edit-ol-uniforms");
    };
  
   const goToDashboard = () => {
    navigate("/dashboard");
  };
  
  return (
    <div className="inventory">
      <div className="back-icon-container">
        <FiArrowLeftCircle
          onClick={goToDashboard}
          className="back-icon"
        />
        <h1 className="title">OL UNIFORMS</h1>
      </div>
      <div className="search-container">
        <input type="text" className="search-input" placeholder="Search..." />
        <button className="button" onClick={goToAddEdit}>ADD ITEM</button>
      </div>
    </div>
  );
}

export default OL_Uniforms_Inventory;
