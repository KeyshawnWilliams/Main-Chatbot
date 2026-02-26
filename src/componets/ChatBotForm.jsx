import { useRef } from "react";

const ChatBotForm = ({ chatHistory, setChatHistory, generateChatBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userInput = inputRef.current.value.trim();
    if (!userInput) return;

    inputRef.current.value = "";
    // Reset the height of the box back to its original size after sending
    inputRef.current.style.height = "auto";

    setChatHistory((prevChatHistory) => [...prevChatHistory, { role: "user", text: userInput }]);

    setTimeout(() => {
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { role: "model", text: "thinking...." }
      ]);
      generateChatBotResponse([...chatHistory, { role: "user", text: userInput }]);
    }, 600);
  };

  return (
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
      {/* 1. Changed <input> to <textarea> for wrapping */}
      <textarea
        ref={inputRef}
        className="message-box"
        placeholder="Type message here.."
        required
        onInput={(e) => {
          // 2. This logic makes the box expand vertically instead of scrolling horizontally
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
        onKeyDown={(e) => {
          // 3. Allows 'Enter' to send, but 'Shift + Enter' to start a new line
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleFormSubmit(e);
          }
        }}
      />
      <button className="material-symbols-rounded">arrow_upward</button>
    </form>
  );
}

export default ChatBotForm;