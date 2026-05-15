// Main-Chatbot/src/componets/ChatBotForm.jsx
// This component renders the input form for the chatbot, allowing users to type their messages. 
// It handles form submission, updates the chat history with the user's message, and triggers 
// the generation of the chatbot's response. The textarea automatically resizes based on content, 
// and pressing "Enter" submits the form while "Shift + Enter" allows for new lines.

import React, { useRef } from "react";

const ChatBotForm = ({ chatHistory, setChatHistory, generateChatBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    if (e) e.preventDefault(); // e might be null if called from startListening
    const userInput = inputRef.current.value.trim();
    if (!userInput) return;

    inputRef.current.value = "";
    inputRef.current.style.height = "auto";

    const updatedHistory = [...chatHistory, { role: "user", text: userInput }];
    setChatHistory(updatedHistory);

    setTimeout(() => {
      setChatHistory((prev) => [...prev, { role: "model", text: "thinking...." }]);
      generateChatBotResponse(updatedHistory);
    }, 600);
  };
  
// add voice input functionality
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Browser not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      inputRef.current.value = transcript;
      
      // Manually trigger height adjustment for textarea
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
      
      // Automatically submit after speaking
      handleFormSubmit();
    };

    recognition.start();
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
      
      {/* The Mic Button (visible when empty) */}
      <button 
        type="button" 
        className="material-symbols-rounded mic-btn" 
        onClick={startListening}
      >
        mic
      </button>

      {/* The Send Button (visible when typing) */}
      <button type="submit" className="material-symbols-rounded send-btn">
        arrow_upward
      </button>
    </form>
  );
};

export default ChatBotForm;