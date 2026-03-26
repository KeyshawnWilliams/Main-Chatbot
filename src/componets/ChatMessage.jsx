import ChatBotIcon from "./chatbotIcon";
import UserIcon from "./UserIcon";


const ChatMessage = ({chat}) => {
    return (
        <div className={`message ${chat.role === "model" ? 'bot' : 'user'}-message 
        ${chat.error ? "error" : ""}`}>

            {chat.role === "model" ? <ChatBotIcon /> : <UserIcon />}
            {/* The Bubble */}
            <div className="chat-bubble">
                {chat.text}
            </div>
            <p className="message-text">{chat.text}</p>
        </div>
    );
}

export default ChatMessage;