import React from "react";
import { FiArrowLeftCircle } from "react-icons/fi";
import "./OL_Uniforms_Inventory.css";

function OL_Uniforms_Inventory() {
  return (
    <div className="inventory">
      <div className="back-icon-container">
        <FiArrowLeftCircle
          onClick={() => window.history.back()}
          className="back-icon"
        />
        <h1 className="title">OL UNIFORMS</h1>
      </div>
      <div className="search-container">
        <input type="text" className="search-input" placeholder="Search..." />
        <button className="button">ADD ITEM</button>
      </div>
    </div>
  );
}

export default OL_Uniforms_Inventory;
