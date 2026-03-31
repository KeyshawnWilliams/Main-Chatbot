import ChatBotIcon from "./ChatBotIcon";
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