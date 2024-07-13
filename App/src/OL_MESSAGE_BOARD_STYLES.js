import styled from "styled-components";
import { GiCrossedChains } from "react-icons/gi";

export const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #a0acadff 0%, #97d8b2ff 100%);
  font-family: "Roboto", sans-serif;
  position: relative;
`;

export const Grid = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  background: #ffd449ff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 420px;
  height: 480px; /* Adjusted height for the correct rows */
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
