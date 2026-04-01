import React, { useRef } from "react";

const ChatBotForm = ({ chatHistory, setChatHistory, generateChatBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userInput = inputRef.current.value.trim();
    if (!userInput) return;

    inputRef.current.value = "";
    inputRef.current.style.height = "auto";

    // Create the updated history snapshot
    const updatedHistory = [...chatHistory, { role: "user", text: userInput }];
    setChatHistory(updatedHistory);

    setTimeout(() => {
      setChatHistory((prev) => [...prev, { role: "model", text: "thinking...." }]);
      // Pass the snapshot so the API gets the latest message
      generateChatBotResponse(updatedHistory);
    }, 600);
  };

  return (
    <form className="chat-form" onSubmit={handleFormSubmit}>
      <textarea
        ref={inputRef}
        className="message-box"
        placeholder="Type message here.."
        required
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleFormSubmit(e);
          }
        }}
      />
      <button type="submit" className="material-symbols-rounded">arrow_upward</button>
    </form>
  );
};

export default ChatBotForm;