//main app component that will render the chatbot interface and handle the logic for generating responses from the chatbot
import ChatBotForm from "./componets/ChatBotForm";
import ChatBotIcon from "./componets/chatbotIcon";
import ChatMessage from "./componets/ChatMessage";
import ChatBotLogo from "./componets/ChatBotLogo";
import {SYSTEM_CONFIG} from "./componets/SystemConfig";
import {detectRisk} from "./componets/RiskDetection";
import {SendEmail} from "./componets/EmergencyEmail";
import "./index.css";

//import { useState } from "react"; // moved to the top of the file to avoid issues with hooks being called conditionally
import { useRef, useState } from "react";
import { useEffect } from "react";

const App = () => {
  //note need to add a feature to filter out specific text to give alert if the users are 
  // spiralling into a negative thought pattern and need to seek help from a mental health professional

  const[chatHistory, setChatHistory] = useState([]);
  const chatBodyRef = useRef();

  //genrate chatbot response
  const generateChatBotResponse = async (prevChatHistory) => {
    // 1. Combine everything into one "contents" array
    // We put the instructions first, then the history

    const userLatestInput = prevChatHistory[prevChatHistory.length - 1].text;
    if (detectRisk(userLatestInput)) {
      setChatHistory((prev) => [
        ...prev.filter(msg => msg.text !== "thinking...."), 
        { role: "model", text: "I'm concerned about you. Please reach out to a professional or call the Mental Health Hotline at 888-NEW-LIFE (639-5433).", error: true }

      ]);
      SendEmail(userLatestInput); // Optionally send an email alert to the support team about the detected risk
      return; // Stop further processing if risk is detected

      
    }

    const finalContents = [
      SYSTEM_CONFIG.instruction, // Your Patois/Safety rules
      SYSTEM_CONFIG.response,    // The AI's "Respect, I understand"
      ...prevChatHistory.map(chat => ({
        role: chat.role === "user" ? "user" : "model",
        parts: [{ text: chat.text }]
      }))
    ];

    const updateHistory = (text, chaterror = false) => {
      setChatHistory((prev) => [
        ...prev.filter(msg => msg.text !== "thinking...."), 
        { role: "model", text, error: chaterror }
      ]);
    };

    // 2. IMPORTANT: Use finalContents here, not formattedContents
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: finalContents }) 
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}?key=${import.meta.env.VITE_GEMINI_API_KEY}`, 
        requestOptions
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      // Digging into the Gemini response structure
      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1") // Clean up bold markdown
        .trim();

      updateHistory(apiResponseText);
    } catch (error) {
      console.error("Error generating chatbot response:", error);
      updateHistory("I'm sorry, I'm having trouble connecting to my brain right now.", true);
    }
  };

  useEffect(() =>{
    //this allow the chatbot to auto scroll when the chat history is updated
    chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behavior: "smooth"});
  }, [chatHistory]);


  return (
    //add general page header for navigation options and the name of the chatbot
    //add the main body of the chatbot with the conversation and the form for user input

    <>
      <div className="main-header">
         {/* These two stay on the top line together */}
         
            <ChatBotLogo />
          <h1 className="main-header-text">Mental Health Chatbot</h1>
          <p></p>
          {/* This will drop to the next line because of flex-basis: 100% */}
          <div>
            <ul className="navbar">
              <li>Offices</li>
              <li>AboutUs</li>
              <li>Set Appointments</li>
            </ul>
          </div>
      </div>
      
      <div className="container">

        <div className="chat-popup">


          {/* header of the chatbot */}
          <div className="chat-header">
            <div className="header-info">
              <ChatBotIcon />
              <h2 className="Logo-text">Mental health Chatbot</h2>
            </div>

          </div>

          {/* body of the chatbot */}
          <div ref={chatBodyRef} className="chat-body">

            <div className="message bot-message">
              <ChatBotIcon />
              <p className="message-text">Hello! I'm here to help you with your mental health. How can I assist you today?</p>
            </div>

            {/* user message */}

            {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}

          </div>

          {/* footer of the chatbot*/}
          <div className="chat-footer">
            <ChatBotForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateChatBotResponse={generateChatBotResponse} />
          </div>


        </div>

      </div></>

    //add a page footer with some information about the chatbot and the developer
  );
}

export default App;