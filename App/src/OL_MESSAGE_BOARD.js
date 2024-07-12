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
} from "./OL_MESSAGE_BOARD_STYLES";

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
      const initialTop = gridRect.top + newSize * 6;
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
        prevPosition.top < gridRect.top + 6 * cellSize
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
        <GridRow>
          <GridCell />
          <GridCell />
          <GridCell />
          <GridCell />
          <GridCell />
          <GridCell />
          <GridCell />
        </GridRow>
        <GridRow>
          <GridCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <GridCell />
        </GridRow>
        <GridRow>
          <GridCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <GridCell />
        </GridRow>
        <GridRow>
          <GridCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <GridCell />
        </GridRow>
        <GridRow>
          <GridCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <GridCell />
        </GridRow>
        <GridRow>
          <GridCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <GridCell />
        </GridRow>
        <GridRow>
          <GridCell />
          <GridCell />
          <GridCell />
          <EmptyCell />
          <GridCell />
          <GridCell />
          <GridCell />
        </GridRow>
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
