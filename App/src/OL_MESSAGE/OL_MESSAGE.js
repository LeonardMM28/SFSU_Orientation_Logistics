import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  Body,
  Button,
  Container,
  Content,
  IconWrapper,
  Input,
  InputWrapper,
  Label,
  Title,
  ToggleIcon,
} from "./OL_MESSAGE_STYLES";

// List of valid codes
const validCodes = [
  "QOVZJTF",
  "6N3VCWQ",
  "FN83J3O",
  "WR4SUBS",
  "CP79H4M",
  "UFZ8HHI",
  "XA23AJO",
  "3DZRKB4",
  "32EBO8Q",
  "Y0CCBJW",
  "H1028KP",
  "CMF9OFQ",
  "785QLH2",
  "ZAQABXK",
  "PCZEX37",
  "PN21SMP",
  "V16U0T2",
  "MLAYUQ1",
  "QUY9TFS",
  "0F8MMUT",
  "LPPUW3W",
  "FVTL4HF",
  "W9MUGQ0",
  "GE0BSKX",
  "7KFPOBA",
  "ATJESPA",
  "9999999",
];

function OL_MESSAGE() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [showPin, setShowPin] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setPin(e.target.value);
  };

  const handleLogin = () => {
    if (pin) {
      if (validCodes.includes(pin)) {
        localStorage.setItem("playerCode", pin);
        navigate("/mission-board");
      } else {
        setError("Invalid PIN. Please try again.");
      }
    } else {
      setError("Please enter your PIN.");
    }
  };

  const togglePinVisibility = () => {
    setShowPin(!showPin);
  };

  return (
    <Body>
      <Container>
        <Content>
          <Label>(Look inside your envelope)</Label>

          <IconWrapper>
            <FaLock size={40} color="#4b2e83" />
          </IconWrapper>
          <Title>Secure Access</Title>
          <Label>Please type your PIN and click Enter</Label>
          <InputWrapper>
            <Input
              type={showPin ? "text" : "password"}
              placeholder="Enter your PIN"
              value={pin}
              onChange={handleInputChange}
            />
            <ToggleIcon onClick={togglePinVisibility}>
              {showPin ? <FaEyeSlash /> : <FaEye />}
            </ToggleIcon>
          </InputWrapper>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Button onClick={handleLogin}>Enter</Button>
        </Content>
      </Container>
    </Body>
  );
}

export default OL_MESSAGE;
