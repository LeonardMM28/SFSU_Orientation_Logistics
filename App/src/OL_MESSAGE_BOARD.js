import React, { useState, useEffect, useRef } from "react";
import {
  BoardContainer,
  Grid,
  GridRow,
  GridCell,
  EmptyCell,
  Player,
  ArrowControls,
  ArrowButton,
  HeadshotCell,
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

// Order of headshots based on the layout you provided
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
  // New row added
  "Tyler.png",
  "Xitali.png",
];

function OL_MESSAGE_BOARD() {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const gridRef = useRef(null);
  const [cellSize, setCellSize] = useState(60); // Default cell size

  const updateCellSize = () => {
    if (gridRef.current) {
      const gridWidth = gridRef.current.clientWidth;
      const newSize = gridWidth / 7; // Since there are 7 cells in a row
      setCellSize(newSize);

      const gridRect = gridRef.current.getBoundingClientRect();
      const initialTop = gridRect.top + newSize * 7; // Adjusted for 8 rows
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

      if (direction === "up" && prevPosition.top > gridRect.top) {
        newTop -= cellSize;
      } else if (
        direction === "down" &&
        prevPosition.top < gridRect.top + 7 * cellSize
      ) {
        newTop += cellSize;
      } else if (direction === "left" && prevPosition.left > gridRect.left) {
        newLeft -= cellSize;
      } else if (
        direction === "right" &&
        prevPosition.left < gridRect.left + 6 * cellSize
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
                    <HeadshotCell
                      src={headshots[imageName]}
                      alt={`Headshot ${cellIndex + 1}`}
                      cellSize={cellSize}
                    />
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
