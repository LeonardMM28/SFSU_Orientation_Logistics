import React, { useState, useEffect, useRef } from "react";
import { GiCrossedChains } from "react-icons/gi";
import {
  BoardContainer,
  Grid,
  GridRow,
  GridCell,
  EmptyCell,
  Player,
  ArrowControls,
  ArrowButton,
  HeadshotWrapper,
  HeadshotCell,
  ChainIcon,
  LockImage,
  OverlayContainer,
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
  "Adrian.png",
  "Atiksha.png",
  "Bobbie.png",
  "Briseyda.png",
  "Casey.png",
  "Daniel.png",
  "Drew.png",
  "Evelio.png",
  null,
  null,
  null,
  null,
  null,
  "Gio.png",
  "Giovanna.png",
  null,
  null,
  null,
  null,
  null,
  "Gracie.png",
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
  "Leo.png",
  null,
  null,
  null,
  null,
  null,
  "Mariah.png",
  "Matt.png",
  null,
  null,
  null,
  null,
  null,
  "Mia.png",
  "Nadia.png",
  "Seth.png",
  "Tamanna.png",
  null,
  "Tullah.png",
  "Tyler.png",
  "Xitali.png",
];

function OL_MESSAGE_BOARD() {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const gridRef = useRef(null);
  const [cellSize, setCellSize] = useState(60);

  const updateCellSize = () => {
    if (gridRef.current) {
      const gridWidth = gridRef.current.clientWidth;
      const newSize = gridWidth / 7;
      setCellSize(newSize);

      const gridRect = gridRef.current.getBoundingClientRect();
      const initialTop = gridRect.top + newSize * 7;
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
        newTop < gridRect.top + cellSize * 7 // Updated to 7 rows
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

      return { top: newTop, left: newLeft };
    });
  };

  return (
    <BoardContainer>
      <Grid ref={gridRef}>
        {Array.from({ length: 8 }).map((_, rowIndex) => (
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
    </BoardContainer>
  );
}

export default OL_MESSAGE_BOARD;
