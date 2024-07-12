import styled from "styled-components";

export const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f0f0f0;
  font-family: "Roboto", sans-serif;
  position: relative;
`;

export const Grid = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  background: #fff;
  border: 2px solid #333;
  width: 420px;
  height: 420px;
`;

export const GridRow = styled.div`
  display: flex;
`;

export const GridCell = styled.div`
  width: 60px;
  height: 60px;
  border: 2px solid #333;
  background-color: #fff;
`;

export const EmptyCell = styled.div`
  width: 60px;
  height: 60px;
`;

export const Player = styled.div`
  position: absolute;
  background-color: blue;
  border-radius: 50%;
  transition: top 0.3s, left 0.3s;
`;

export const ArrowControls = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ArrowButton = styled.button`
  background-color: #4b2e83;
  color: white;
  border: none;
  padding: 10px;
  margin: 5px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;

  &:hover {
    background-color: #372563;
  }
`;
