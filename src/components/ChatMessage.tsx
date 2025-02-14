import { Box, Card, Typography } from "@mui/material";
/**
 * A single message in the chat log.
 * @param {{sender: string, text: string}} props
 * @prop {string} sender The role of the sender. If "user", the message is displayed as sent by the user,
 * otherwise it is displayed as sent by the AI.
 * @prop {string} text The text of the message.
 * @returns {JSX.Element} A rendered message component.
 */
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

export default ChatMessage;