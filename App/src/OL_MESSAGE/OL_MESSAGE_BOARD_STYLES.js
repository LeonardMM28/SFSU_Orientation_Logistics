import styled, { keyframes } from "styled-components";
import { GiCrossedChains } from "react-icons/gi";

export const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #a0acadff 0%, #97d8b2ff 100%);
  font-family: "VT323", monospace;
  position: relative;
`;

export const Grid = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  background: #ffd449ff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 420px;
  height: 540px;
`;

export const GridRow = styled.div`
  display: flex;
`;

export const GridCell = styled.div`
  width: 60px;
  height: 60px;
  border: 1px solid #331832ff;
  background-color: #f9a620ff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const EmptyCell = styled.div`
  width: 60px;
  height: 60px;
`;

export const Player = styled.div`
  position: absolute;
  background-color: #331832ff;
  border: 2px solid #97d8b2ff;
  border-radius: 50%;
  transition: top 0.3s, left 0.3s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

export const ArrowControls = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffd449ff;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

export const ArrowButton = styled.button`
  background-color: #331832ff;
  color: white;
  border: none;
  padding: 10px;
  margin: 5px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f9a620ff;
  }
`;

export const HeadshotWrapper = styled.div`
  position: relative;
  width: ${({ cellSize }) => cellSize}px;
  height: ${({ cellSize }) => cellSize}px;
`;

export const HeadshotCell = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease-in-out;
  opacity: ${({ isTalking }) => (isTalking ? 0.7 : 1)};
`;

export const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ChainIcon = styled(GiCrossedChains)`
  position: absolute;
  color: rgba(0, 0, 0, 0.2); /* Less opacity */
  width: 100%;
  height: 100%;
`;

export const LockImage = styled.img`
  position: absolute;
  bottom: 5%;
  right: 5%;
  width: ${({ cellSize }) => cellSize * 0.5}px;
  height: ${({ cellSize }) => cellSize * 0.5}px;
  transform: rotate(20deg); /* Tilt the lock */
`;

export const Popup = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffd449ff;
  padding: 20px;
  border: 2px solid #331832ff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const PopupMessage = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const PopupButton = styled.button`
  background-color: #331832ff;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f9a620ff;
  }
`;

export const DifficultyTag = styled.div`
  font-size: 14px;
  margin-left: 10px;
  display: flex;
  align-items: center;
`;

const getDifficultyColors = (level) => {
  const colors = [
    "green",
    "yellowgreen",
    "yellow",
    "orange",
    "orangered",
    "red",
    "darkred",
    "maroon",
  ];
  return colors.slice(0, level);
};

export const DifficultyIndicator = ({ difficulty }) => {
  const colors = getDifficultyColors(difficulty);
  const bars = colors.map((color, index) => (
    <svg key={index} width="20" height="20" style={{ margin: "0 2px" }}>
      <polygon points="10,0 15,10 10,20 5,10" fill={color} />
      <polygon points="12,2 18,10 12,18 6,10" fill="white" opacity="0.3" />
    </svg>
  ));

  return <div style={{ display: "flex" }}>{bars}</div>;
};

export const LargePopup = styled.div`
  position: absolute;
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
  background-color: #ffd449ff;
  padding: 20px;
  border: 2px solid #331832ff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const PopupPicture = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-bottom: 20px;
`;

export const PopupDialogue = styled.textarea`
  width: 100%;
  height: 100px;
  margin-bottom: 20px;
`;

export const MiniGameArea = styled.div`
  width: 100%;
  height: 300px;
  background-color: white;
  border: 2px solid #331832ff;
  position: relative; /* Ensure absolute positioning within this container */
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #331832ff;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f9a620ff;
  }
`;

export const DialogueContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  position: relative;
`;

export const DialogueBox = styled.div`
  position: relative;
  background-color: #ffd449ff;
  border: 2px solid #331832ff;
  border-radius: 10px;
  padding: 10px;
  width: calc(100% - 150px);
  margin-left: 10px;

  &:before {
    content: "";
    position: absolute;
    top: 25%;
    left: -20px;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-right: 20px solid #331832ff;
  }
`;

export const FightButton = styled.button`
  background-color: #331832ff;
  color: white;
  border: none;
  padding: 20px 40px;
  cursor: pointer;
  font-size: 24px;
  border-radius: 10px;
  transition: background-color 0.3s;
  position: absolute;

  &:hover {
    background-color: #f9a620ff;
  }
`;

const hitAnimation = keyframes`
  0% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.3);
  }
  100% {
    transform: scaleY(1);
  }
`;

export const Monster = styled.img`
  position: absolute;
  cursor: pointer;
  
  &.hit {
    animation: ${hitAnimation} 0.2s ease-out;
  }
`;

export const LifeBar = styled.div`
  width: ${({ maxWidth }) => maxWidth}%;
  height: 30px;
  background-color: #ffd449ff;
  border: 2px solid #331832ff;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
`;

export const Life = styled.div`
  height: 100%;
  background-color: red;
  width: ${({ width }) => width}%;
  transition: width 0.3s;
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
    font-size: 30px;
  }
  100% {
    opacity: 0;
    font-size: 0px;
    transform: translateY(-20px);
  }
`;

export const HitWord = styled.div`
  position: absolute;
  color: red;
  font-size: 30px;
  font-weight: bold;
  animation: ${fadeOut} 5s ease-out forwards;
  pointer-events: none; // To ensure hits can still be detected through the word animations
`;