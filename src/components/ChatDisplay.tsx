import {Container} from "@mui/material";
import type {Message} from "@baml_client/types";
import ChatMessage from "@components/ChatMessage";

interface ChatDisplayProps {
    isThinking: boolean;
    messages: Message[];
}

/**
 * A component that displays a chat log, with messages from the user and assistant.
 * If the chatbot is "thinking", it displays a message indicating this.
 * @param isThinking whether the chatbot is currently thinking
 * @param messages the messages to display in the chat log
 * @returns a JSX element that displays the chat log
 */
const ChatDisplay: React.FC<ChatDisplayProps> = ({isThinking, messages}) => {
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
          {messages.filter((msg) => msg.role === "user" || msg.role === "assistant").map((msg, index) => (
            <ChatMessage key={index} sender={msg.role} text={msg.content} />
          ))}
          {isThinking && (
            <ChatMessage sender="assistant" text="..." />
          )}
        </Container>
      );
}

export default ChatDisplay;

