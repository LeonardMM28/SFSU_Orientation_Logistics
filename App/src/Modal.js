import React from "react";
import { FiX } from "react-icons/fi";
import "./Modal.css";

const Modal = ({ imageUrl, altText, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <img src={imageUrl} alt={altText} className="modal-image" />
        <button className="close-button" onClick={onClose}>
          <FiX />
        </button>
      </div>
    </div>
  );
};

export default Modal;
