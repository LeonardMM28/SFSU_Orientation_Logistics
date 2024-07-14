import React, { useEffect, useRef, useState } from "react";
import {
  ArrowButton,
  ArrowControls,
  BoardContainer,
  ChainIcon,
  EmptyCell,
  Grid,
  GridCell,
  GridRow,
  HeadshotCell,
  HeadshotWrapper,
  LockImage,
  OverlayContainer,
  Player,
  Popup,
  PopupMessage,
  PopupButton,
  DifficultyTag,
  DifficultyIndicator,
  LargePopup,
  PopupPicture,
  PopupDialogue,
  MiniGameArea,
  CloseButton,
} from "./OL_MESSAGE_BOARD_STYLES";

// Function to import images dynamically
const importAll = (r) => {
  let images = {};
  r.keys().map((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
};

const headshots = importAll(
  require.context("./Headshots", false, /\.(png|jpe?g|svg)$/)
);

const headshotsTalking = importAll(
  require.context("./Headshots/Talking", false, /\.(png|jpe?g|svg)$/)
);

const lockImage = require("./Headshots/lock.png");

// Mapping headshots to difficulty levels (1 to 7)
const difficultyMapping = {
  "Xitali.png": 3,
  "Gio.png": 3,
  "Matt.png": 4,
  "Evan.png": 5,
  "Chris.png": 6,
  "Miguel.png": 7,
  "Lyn.png": 8,
  "Daniel.png": 1,
  "Drew.png": 2,
  "Gracie.png": 2,
  "Giovanna.png": 1,
  "Hannah.png": 1,
  "Isabella.png": 1,
  "Jacob.png": 1,
  "Jay.png": 1,
  "Mariah.png": 1,
  "Mia.png": 1,
  "Nadia.png": 1,
  "Seth.png": 1,
  "Tamanna.png": 1,
  "Tullah.png": 1,
  "Tyler.png": 1,
  "Adrian.png": 1,
  "Atiksha.png": 1,
  "Bobbie.png": 1,
  "Briseyda.png": 1,
  "Casey.png": 1,
  "Evelio.png": 1,
};

const cellImageMapping = [
  "Xitali.png",
  "Gio.png",
  "Matt.png",
  "Evan.png",
  "Chris.png",
  "Miguel.png",
  "Lyn.png",
  "Daniel.png",
  null,
  "Drew.png",
  null,
  "Gracie.png",
  null,
  "Giovanna.png",
  "Hannah.png",
  null,
  null,
  null,
  null,
  null,
  "Isabella.png",
  "Jacob.png",
  null,
  null,
  null,
  null,
  null,
  "Jay.png",
  "Mariah.png",
  null,
  null,
  null,
  null,
  null,
  "Mia.png",
  "Nadia.png",
  null,
  null,
  null,
  null,
  null,
  "Seth.png",
  "Tamanna.png",
  null,
  null,
  null,
  null,
  null,
  "Tullah.png",
  "Tyler.png",
  null,
  null,
  null,
  null,
  null,
  "Adrian.png",
  "Atiksha.png",
  "Bobbie.png",
  "Briseyda.png",
  null,
  null,
  "Casey.png",
  "Evelio.png",
];

function OL_MESSAGE_BOARD() {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [popup, setPopup] = useState({
    visible: false,
    name: "",
    difficulty: 0,
  });
  const [largePopup, setLargePopup] = useState({ visible: false, name: "" });
  const [currentDialogue, setCurrentDialogue] = useState("");
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState("");
  const [isTalking, setIsTalking] = useState(false);
  const gridRef = useRef(null);
  const [cellSize, setCellSize] = useState(60);

  const dialogues = [
    "Hello there! How can I help you today?",
    "It seems like you need some assistance.",
    "Let's work together to solve this problem.",
    "Thank you for your patience.",
  ];

  const updateCellSize = () => {
    if (gridRef.current) {
      const gridWidth = gridRef.current.clientWidth;
      const newSize = gridWidth / 7;
      setCellSize(newSize);

      const gridRect = gridRef.current.getBoundingClientRect();
      const initialTop = gridRect.top + newSize * 7; // Updated to 8 rows
      const initialLeft = gridRect.left + newSize * 3;

      setPosition({ top: initialTop, left: initialLeft });
    }
  };

  useEffect(() => {
    updateCellSize();
    window.addEventListener("resize", updateCellSize);
    return () => window.removeEventListener("resize", updateCellSize);
  }, [gridRef]);

  useEffect(() => {
    let typingInterval;
    let talkingInterval;
    if (largePopup.visible) {
      typingInterval = setInterval(() => {
        setCurrentDialogue((prev) => {
          if (letterIndex < dialogues[dialogueIndex].length) {
            setLetterIndex(letterIndex + 1);
            return prev + dialogues[dialogueIndex][letterIndex];
          } else {
            clearInterval(typingInterval);
            clearInterval(talkingInterval);
            setTimeout(() => {
              setLetterIndex(0);
              setDialogueIndex(
                (prevIndex) => (prevIndex + 1) % dialogues.length
              );
              setCurrentDialogue("");
              setIsTalking(false);
            }, 2000); // Pause before showing the next dialogue
            return prev;
          }
        });
      }, 100);

      talkingInterval = setInterval(() => {
        setIsTalking((prev) => !prev);
      }, 100); // Switch between talking and normal every 50ms

      return () => {
        clearInterval(typingInterval);
        clearInterval(talkingInterval);
      };
    }
  }, [largePopup.visible, dialogueIndex, letterIndex]);

  useEffect(() => {
    if (largePopup.visible) {
      setCurrentImage(
        isTalking
          ? headshotsTalking[`${largePopup.name}.png`]
          : headshots[`${largePopup.name}.png`]
      );
    }
  }, [isTalking, largePopup.visible, largePopup.name]);

  const movePlayer = (direction) => {
    setPosition((prevPosition) => {
      const gridRect = gridRef.current.getBoundingClientRect();
      let newTop = prevPosition.top;
      let newLeft = prevPosition.left;

      if (direction === "up" && newTop > gridRect.top) {
        newTop -= cellSize;
      } else if (
        direction === "down" &&
        newTop < gridRect.top + cellSize * 8 // Updated to 8 rows
      ) {
        newTop += cellSize;
      } else if (direction === "left" && newLeft > gridRect.left) {
        newLeft -= cellSize;
      } else if (
        direction === "right" &&
        newLeft < gridRect.left + cellSize * 6
      ) {
        newLeft += cellSize;
      }

      // Determine the name of the person at the new position
      const colIndex = (newLeft - gridRect.left) / cellSize;
      const rowIndex = (newTop - gridRect.top) / cellSize;
      const cellIndex = rowIndex * 7 + colIndex;
      const imageName = cellImageMapping[cellIndex];

      if (imageName) {
        const name = imageName.split(".")[0];
        const difficulty = difficultyMapping[imageName];
        setPopup({ visible: true, name, difficulty });
      } else {
        setPopup({ visible: false, name: "", difficulty: 0 });
      }

      return { top: newTop, left: newLeft };
    });
  };

  const handleRescueClick = () => {
    setLargePopup({ visible: true, name: popup.name });
    setPopup({ visible: false, name: "", difficulty: 0 });
  };

  const closeLargePopup = () => {
    setLargePopup({ visible: false, name: "" });
    setCurrentDialogue("");
    setDialogueIndex(0);
    setLetterIndex(0);
    setIsTalking(false);
  };

  return (
    <BoardContainer>
      <Grid ref={gridRef}>
        {Array.from({ length: 9 }).map((_, rowIndex) => (
          <GridRow key={rowIndex}>
            {Array.from({ length: 7 }).map((_, colIndex) => {
              const cellIndex = rowIndex * 7 + colIndex;
              const imageName = cellImageMapping[cellIndex];

              if (imageName) {
                return (
                  <GridCell key={colIndex}>
                    <HeadshotWrapper cellSize={cellSize}>
                      <HeadshotCell
                        src={headshots[imageName]}
                        alt={`Headshot ${cellIndex + 1}`}
                        cellSize={cellSize}
                        isTalking={isTalking}
                      />
                      <OverlayContainer>
                        <ChainIcon size={cellSize} />
                        <LockImage
                          src={lockImage}
                          alt="Lock"
                          cellSize={cellSize}
                        />
                      </OverlayContainer>
                    </HeadshotWrapper>
                  </GridCell>
                );
              } else {
                return <EmptyCell key={colIndex} />;
              }
            })}
          </GridRow>
        ))}
      </Grid>
      <Player
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: `${cellSize}px`,
          height: `${cellSize}px`,
        }}
      />
      <ArrowControls>
        <ArrowButton onClick={() => movePlayer("up")}>↑</ArrowButton>
        <div>
          <ArrowButton onClick={() => movePlayer("left")}>←</ArrowButton>
          <ArrowButton onClick={() => movePlayer("down")}>↓</ArrowButton>
          <ArrowButton onClick={() => movePlayer("right")}>→</ArrowButton>
        </div>
      </ArrowControls>
      {popup.visible && (
        <Popup>
          <PopupMessage>
            Do you want to rescue {popup.name}?
            <DifficultyTag>
              Difficulty: <DifficultyIndicator difficulty={popup.difficulty} />
            </DifficultyTag>
          </PopupMessage>
          <PopupButton onClick={handleRescueClick}>YES!</PopupButton>
        </Popup>
      )}
      {largePopup.visible && (
        <LargePopup>
          <CloseButton onClick={closeLargePopup}>X</CloseButton>
          <PopupPicture src={currentImage} alt={largePopup.name} />
          <PopupDialogue value={currentDialogue} readOnly rows="4" cols="50" />
          <MiniGameArea>Mini Game Area</MiniGameArea>
        </LargePopup>
      )}
    </BoardContainer>
  );
}

export default OL_MESSAGE_BOARD;
