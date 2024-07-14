import React from "react";
import {
  Body,
  Button,
  Container,
  Content,
  Input,
  Label,
  Title,
  IconWrapper,
  InputWrapper,
} from "./OL_MESSAGE_STYLES";
import { FaLock } from "react-icons/fa";

function OL_MESSAGE() {
  return (
    <Body>
      <Container>
        <Content>
          <IconWrapper>
            <FaLock size={40} color="#4b2e83" />
          </IconWrapper>
          <Title>Secure Access</Title>
          <Label>Please type your PIN and click Enter</Label>
          <InputWrapper>
            <Input type="password" placeholder="Enter your PIN" />
          </InputWrapper>
          <Button>Enter</Button>
        </Content>
      </Container>
    </Body>
  );
}

export default OL_MESSAGE;
