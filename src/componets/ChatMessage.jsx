import ChatBotIcon from "./chatbotIcon";


const ChatMessage = ({chat}) => {
    return (
        <div className={`message ${chat.role === "model" ? 'bot' : 'user'}-message 
        ${chat.error ? "error" : ""}`}>

            {chat.role === "model" && <ChatBotIcon />}
            <p className="message-text">{chat.text}</p>
        </div>
    );
}

export default ChatMessage;