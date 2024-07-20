// FinalMessagePopup.js
import React from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const SlideUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const PopupBox = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  max-width: 600px;
  margin: 0 20px;
  animation: ${SlideUp} 0.5s ease-in-out;
`;

const PopupTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

const PopupMessage = styled.p`
  font-size: 18px;
  color: #333;
`;

const CloseButton = styled.button`
  font-family: "VT323", monospace;
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 18px;
  border-radius: 5px;
  margin-top: 20px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1abc9c;
  }
`;

const FinalMessagePopup = ({ message, onClose }) => (
  <PopupOverlay>
    <PopupBox>
      <PopupTitle>Congratulations!</PopupTitle>
      <PopupMessage>{message}</PopupMessage>
      <CloseButton onClick={onClose}>Close</CloseButton>
    </PopupBox>
  </PopupOverlay>
);

export default FinalMessagePopup;
