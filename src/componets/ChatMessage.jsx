// Main-Chatbot/src/componets/ChatMessage.jsx
// This component is responsible for rendering individual chat messages in the conversation. It takes a chat object as a prop, which contains the message text, the role (user or model), and an optional error flag. 
// Based on the role, it displays either the chatbot icon or the user icon next to the message bubble. 
// The message bubble's styling can also change if there is an error, allowing for visual feedback in case of issues with generating a response.

import ChatBotIcon from "./chatbotIcon";
import UserIcon from "./UserIcon";
const ChatMessage = ({ chat }) => {
  return (
    <div className={`message ${chat.role === "model" ? 'bot' : 'user'}-message ${chat.error ? "error" : ""}`}>
      
      {/* Icon */}
      {chat.role === "model" ? <ChatBotIcon /> : <UserIcon />}

      {/* The Bubble - Keep only ONE of these */}
      <div className="chat-bubble">
        <p className="message-text">{chat.text}</p>
      </div>
      
    </div>
  );
}

export default ChatMessage;