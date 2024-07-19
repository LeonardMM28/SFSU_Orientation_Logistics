import { GiCrossedChains, GiSnakeSpiral } from "react-icons/gi";
import styled, { keyframes } from "styled-components";

export const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  font-family: "VT323", monospace;
  position: relative;
`;

export const Grid = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  background: linear-gradient(
    135deg,
    #6a1b9a 0%,
    #fdd835 100%
  ); /* Purple to Gold gradient */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 420px;
  height: 540px;
  border-radius: 10px;
`;

export const GridRow = styled.div`
  display: flex;
`;

export const GridCell = styled.div`
  width: 60px;
  height: 60px;
  border: 1px solid #2c3e50;
  background: linear-gradient(
    100deg,
    #7d5ba6 0%,
    #fdd835 50%,
    #7d5ba6 100%
  ); /* Purple to Gold gradient */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 5px;
`;

export const EmptyCell = styled.div`
  width: 60px;
  height: 60px;
`;

export const Player = styled.div`
  position: absolute;
  background-color: transparent;

  transition: top 0.3s, left 0.3s;
  box-shadow: 0 20px 20px rgba(0, 0, 0, 0.8);
  background-size: cover;
  background-position: center;
  border-radius: 50%;
`;

export const ArrowControls = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: linear-gradient(135deg, #5a2d82 0%, #a67c00 100%);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
`;

export const ArrowButton = styled.button`
  background-color: #f1c40f;
  color: #2c3e50;
  border: none;
  height: 70px;
  width: 70px;
  padding: 20px;
  margin: 10px;
  cursor: pointer;
  font-size: 32px;
  border-radius: 10px;
  transition: background-color 0.3s, transform 0.3s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);

  &:hover {
    background-color: #f39c12;
    transform: scale(1.1);
  }

  &:active {
    background-color: #d35400;
    transform: scale(0.9);
  }
`;

export const HeadshotWrapper = styled.div`
  position: relative;
  width: ${({ cellSize }) => cellSize}px;
  height: ${({ cellSize }) => cellSize}px;
`;

export const HeadshotCell = styled.img`
  width: 110%;
  top: -10%;
  left: -5%;
  position: absolute;
  height: 110%;
  object-fit: cover;
  transition: opacity 0.3s ease-in-out;
  opacity: ${({ isTalking }) => (isTalking ? 0.7 : 1)};
  border-radius: 5px;
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
  background: linear-gradient(
    135deg,
    #7d5ba6 0%,
    #fdd835 100%
  ); /* Purple to Gold gradient */
  padding: 20px;
  border: 2px solid #2c3e50;
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
  font-family: "VT323", monospace;

  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1abc9c;
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
  background: linear-gradient(
    135deg,
    #7d5ba6 0%,
    #fdd835 100%
  ); /* Purple to Gold gradient */
  padding: 20px;
  border: 2px solid #2c3e50;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const PopupPicture = styled.img`
  height: 150px;
  object-fit: cover;
  margin-bottom: 20px;
`;

export const PopupDialogue = styled.textarea`
  font-family: "VT323", monospace;
  font-size: 18px;
  width: 100%;
  height: 150px;
  background-color: #fff9c4;
  border: none;
  overflow-y: auto; /* Enable vertical scrolling */
`;

export const MiniGameArea = styled.div`
  width: 100%;
  height: 430px;
  top: 30%;
  background-color: #ede7f6;
  border: 2px solid #2c3e50;
  position: absolute; /* Ensure absolute positioning within this container */
`;

export const CloseButton = styled.button`
  font-family: "VT323", monospace;

  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1abc9c;
  }
`;

export const DialogueContainer = styled.div`
  display: flex;

  justify-content: flex-start;
  width: 95%;
  position: absolute;
  top: 2%;
  left: 0%;
`;

export const DialogueBox = styled.div`
  position: relative;
  background-color: #fff9c4;
  border: 2px solid #2c3e50;
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
    border-right: 20px solid #2c3e50;
  }
`;

export const FightButton = styled.button`
  font-family: "VT323", monospace;

  background-color: #4a148c;
  color: white;
  border: none;
  padding: 20px 40px;
  cursor: pointer;
  font-size: 60px;
  transition: background-color 0.3s;
  position: absolute;
  left: 8svh;
  top: 40%;

  /* Custom border shape */
  border: 4px solid #7b1fa2;
  border-width: 4px 8px;
  clip-path: polygon(
    0% 10%,
    10% 0%,
    90% 0%,
    100% 10%,
    100% 90%,
    90% 100%,
    10% 100%,
    0% 90%
  );

  &:hover {
    background-color: #7b1fa2;
    border-color: #4a148c;
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
  transition: all 0.3s ease-in-out; /* Smooth transitions */
  &.hit {
    animation: ${hitAnimation} 0.2s ease-out;
  }
  &.defeated {
    transform: rotate(90deg);
    z-index: 10; /* Ensure it's on top */
  }
`;

export const LifeBar = styled.div`
  width: ${({ maxWidth }) => maxWidth}%;
  height: 30px;
  background-color: #ffffff;
  border: 2px solid #2c3e50;
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

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const Symbol = styled(GiSnakeSpiral)`
  position: absolute;
  font-size: 30px;
  color: #ff0000;
  z-index: 11; /* Ensure it's on top of the monster */
  animation: ${spin} 2s linear infinite;
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

const borderShrink = keyframes`
  0% {
    border-width: 5px;
  }
  100% {
    border-width: 0;
  }
`;

const dashArray = 283;
const dashOffset = dashArray;

export const TimerOverlay = ({ timer }) => {
  const dashOffsetValue = (dashOffset * timer) / 30;

  return (
    <SvgWrapper>
      <Svg viewBox="0 0 100 100">
        <CircleBackground cx="50" cy="50" r="45" />
        <CircleTimer
          cx="50"
          cy="50"
          r="45"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffsetValue}
        />
      </Svg>
      <TimeText>{timer}s</TimeText>
    </SvgWrapper>
  );
};

const SvgWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 100px;
  height: 100px;
  z-index: 12;
`;

const Svg = styled.svg`
  transform: rotate(-90deg);
`;

const CircleBackground = styled.circle`
  fill: red;
  stroke: rgba(0, 0, 0, 0.1);
  stroke-width: 10;
`;

const CircleTimer = styled.circle`
  fill: none;
  stroke: yellow;
  stroke-width: 10;
  transition: stroke-dashoffset 1s linear;
`;

const TimeText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 40px;
  color: white;
`;

export const OLPowerContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

export const OLPowerLabel = styled.div`
  font-size: 18px;
  margin-right: 10px;
`;

export const OLPowerDiamond = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${({ color }) => color};
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); /* Diamond shape */
  margin: 0 5px;
`;

export const getOLPowerColors = (maxTier) => {
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
  return colors.slice(0, maxTier);
};

export const OLPowerIndicator = ({ maxTier }) => {
  const colors = getOLPowerColors(maxTier);

  return (
    <OLPowerContainer>
      <OLPowerLabel>OL Power:</OLPowerLabel>
      {colors.map((color, index) => (
        <OLPowerDiamond key={index} color={color} />
      ))}
    </OLPowerContainer>
  );
};

export const LargePurplePopup = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #7d5ba6; /* Full purple color */
  padding: 40px; /* Increased padding for larger size */
  border: 2px solid #2c3e50;
  border-radius: 20px; /* Larger border radius for a more distinct look */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80%; /* Adjust width and height as needed */
  height: 80%;
`;

export const LargePurplePopupMessage = styled.div`
  font-size: 24px; /* Larger font size */
  color: white; /* White text color for better contrast */
  margin-top: 20px;
  text-align: center; /* Center-align text */
`;

export const LargePurplePopupButton = styled.button`
  font-family: "VT323", monospace;
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 15px 30px; /* Increased padding for a larger button */
  cursor: pointer;
  font-size: 20px; /* Larger font size */
  border-radius: 10px; /* Larger border radius */
  transition: background-color 0.3s;
  margin-top: 20px;

  &:hover {
    background-color: #1abc9c;
  }
`;

export const LargePurplePopupPicture = styled.img`
  width: 300px; /* Increased size */
  height: 300px; /* Increased size */
  object-fit: cover;
  margin-bottom: 20px;
  border-radius: 10%;
`;

export const InstructionsOverlay = styled.div`
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
  font-family: "VT323", monospace;
`;

export const InstructionsBox = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  max-width: 600px;
  margin: 0 20px;
`;

export const InstructionsButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  border: none;
  background-color: #2c3e50;
  color: white;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1abc9c;
  }
`;

export const InstructionsScreen = ({ onClose, playerName }) => {
  return (
    <InstructionsOverlay>
      <InstructionsBox>
        <h2>Hi {playerName}, welcome to the OL Adventure game!</h2>
        <h2>Instructions:</h2>
        <ul>
          <li>Use the arrow buttons to move your player.</li>
          <li>Rescue characters by defeating monsters.</li>
          <li>Progress through the levels to gain more power.</li>
          <li>You have to rescue everyone to get your reward</li>

          <li>Good luck and have fun!</li>
        </ul>
        <InstructionsButton onClick={onClose}>Got it!</InstructionsButton>
      </InstructionsBox>
    </InstructionsOverlay>
  );
};

export { CircleBackground, CircleTimer, Svg, SvgWrapper, TimeText };
