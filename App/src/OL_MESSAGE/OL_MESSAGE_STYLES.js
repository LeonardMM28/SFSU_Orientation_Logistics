import styled from "styled-components";

export const Body = styled.div`
  background: linear-gradient(to bottom right, #4b2e83, #ffcc00);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  font-family: "Roboto", sans-serif;
`;

export const Container = styled.div`
  text-align: center;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  padding: 40px;
  width: 350px;
  max-width: 90%;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled.h1`
  font-size: 24px;
  color: #4b2e83;
  margin-bottom: 10px;
  font-weight: bold;
`;

export const Label = styled.label`
  font-size: 16px;
  color: #555;
  margin-bottom: 20px;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  padding-left: 40px;
  border: 2px solid #4b2e83;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 16px;
`;

export const Button = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  background-color: #ffcc00;
  color: #4b2e83;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #4b2e83;
    color: #ffcc00;
  }
`;

export const IconWrapper = styled.div`
  margin-bottom: 20px;
`;

export const ToggleIcon = styled.div`
  position: absolute;
  right: 10px;
  top: 40%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 1.5rem;
  color: #4b2e83;
`;
