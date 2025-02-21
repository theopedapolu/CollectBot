import {Box, Card, Container, Typography} from "@mui/material";
import type {Message} from "../baml_client"

interface ChatMessageProps {
    isThinking: boolean;
    messages: Message[];
}

const ChatMessage = ({sender, text}: {sender: string, text: string }) => {
    const isUser = sender === "user";
    return (
      <Box
        display="flex"
        justifyContent={isUser ? "flex-end" : "flex-start"}
        sx = {{
          boxShadow: 0,
          margin: "15px 0"
        }}
      >
        <Card
          sx={{
            boxShadow:0,
            padding:2,
            maxWidth: "75%",
            backgroundColor: isUser ? "#9C27B0" : "#f5f5f5",
            color: isUser ? "#fff" : "#000",
            borderRadius: 5
          }}
        >
            <Typography variant="body1">{text}</Typography>
        </Card>
      </Box>
    );
};

const ChatDisplay: React.FC<ChatMessageProps> = ({isThinking, messages}) => {
    return (
        <Container
          maxWidth="md"
          sx={{
            height: "500px",
            overflowY: "auto",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: 0,
            padding: 2,
            backgroundColor: "#fff",
          }}
        >
          {messages && messages.filter((msg) => msg.role === "user" || msg.role === "assistant").map((msg, index) => (
            <ChatMessage key={index} sender={msg.role} text={msg.content} />
          ))}
          {isThinking && (
            <ChatMessage sender="assistant" text="..." />
          )}
        </Container>
      );
}

export default ChatDisplay;

