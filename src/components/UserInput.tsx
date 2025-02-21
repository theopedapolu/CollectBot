import React, { useState } from 'react';
import {Container, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface UserInputProps {
  sendMessage: (userMessage: string) => void;
}

const UserInput: React.FC<UserInputProps> = ({ sendMessage }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  }

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue(''); // Clear input after sending
    }
  };

  const containerStyles = {
    display: 'flex',
    alignItems: 'center',
    p: 2,
    backgroundcolor: '#fff',
    borderRadius: 1
  }

  return (
    <Container maxWidth="md" sx={containerStyles}>
      <TextField
        variant="standard"
        fullWidth
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
      />
      <IconButton 
        onClick={handleSend}
        color="primary"
      >
        <SendIcon />
      </IconButton>
    </Container>
  );
};

export default UserInput;

