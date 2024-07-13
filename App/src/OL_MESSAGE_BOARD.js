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

const lockImage = require("./Headshots/lock.png");

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
  const [popup, setPopup] = useState({ visible: false, name: "" });
  const gridRef = useRef(null);
  const [cellSize, setCellSize] = useState(60);

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
        setPopup({ visible: true, name });
      } else {
        setPopup({ visible: false, name: "" });
      }

      return { top: newTop, left: newLeft };
    });
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
          <PopupMessage>Do you want to rescue {popup.name}?</PopupMessage>
          <PopupButton onClick={() => alert(`You rescued ${popup.name}!`)}>
            YES!
          </PopupButton>
        </Popup>
      )}
    </BoardContainer>
  );
}

export default OL_MESSAGE_BOARD;
