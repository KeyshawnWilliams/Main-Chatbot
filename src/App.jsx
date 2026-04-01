import React from "react"; 
import { useRef, useState, useEffect } from "react";
import ChatBotForm from "./componets/ChatBotForm";
import ChatBotIcon from "./componets/chatbotIcon";
import ChatMessage from "./componets/ChatMessage";
import ChatBotLogo from "./componets/ChatBotLogo";
import { SYSTEM_CONFIG } from "./componets/SystemConfig";
import { detectRisk } from "./componets/RiskDetection";
import { SendEmail } from "./componets/EmergencyEmail";
import BreathingTool from "./componets/BreathingTool";
import "./index.css";

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [showBreathing, setShowBreathing] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);
  const chatBodyRef = useRef();

  const updateHistory = (text, isError = false) => {
    setChatHistory((prev) => [
      ...prev.filter((msg) => msg.text !== "thinking...."),
      { role: "model", text, error: isError },
    ]);
  };

  const generateChatBotResponse = async (prevChatHistory) => {
    const userLatestInput = prevChatHistory[prevChatHistory.length - 1].text;

    // 1. RISK DETECTION
    const riskType = detectRisk(userLatestInput);
    if (riskType === "CRISIS") {
      await SendEmail(userLatestInput);
      updateHistory("I'm very concerned about you. Please call 888-NEW-LIFE (639-5433) or visit the UTech Counselling Unit immediately.", true);
      return;
    }
    if (riskType === "PANIC") {
      setShowBreathing(true);
      updateHistory("It sounds like you're overwhelmed. I've opened a breathing exercise for you.");
      return;
    }

    // 2. CONSTRUCT DATA USING YOUR STRUCTURED SYSTEM_CONFIG
    const finalContents = [
      {
        role: SYSTEM_CONFIG.instruction.role,
        parts: [{ text: String(SYSTEM_CONFIG.instruction.parts[0].text).trim() }]
      },
      {
        role: SYSTEM_CONFIG.response.role,
        parts: [{ text: String(SYSTEM_CONFIG.response.parts[0].text).trim() }]
      },
      ...prevChatHistory.map((chat) => ({
        role: chat.role === "user" ? "user" : "model",
        parts: [{ text: String(chat.text || " ").trim() }],
      })),
    ];

    try {
      // Calling your node server (Terminal 1)
      const response = await fetch("http://https://main-chatbot-uk5i.onrender.com/API/chat", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: finalContents }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.details || data?.error || "API failed");
      }

      // Extraction logic for Gemini 3 via Proxy
      const apiResponseText = data.text || data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!apiResponseText) throw new Error("Invalid response structure");

      const cleanedText = apiResponseText.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(cleanedText);

    } catch (error) {
      console.error("ERROR:", error);
      updateHistory("I'm having trouble connecting. Please try again or reach out to a counselor.", true);
    }
  };

  useEffect(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  return (
    <>
      <div className="main-header">
        <ChatBotLogo />
        <h1 className="main-header-text">UTech Mental Health Support</h1>
        <ul className="navbar">
          <li onClick={() => setShowAppointment(true)}>Set Appointments</li>
          <li>About Us</li>
        </ul>
      </div>

      {showBreathing && <BreathingTool onClose={() => setShowBreathing(false)} />}

      {showAppointment && (
        <div className="modal-backdrop">
          <div className="appointment-modal">
            <h2>Book a Counselling Session</h2>
            <form onSubmit={(e) => { e.preventDefault(); setShowAppointment(false); alert("Request sent!"); }}>
              <input type="text" placeholder="Student ID" required />
              <select required>
                <option value="">Select Campus</option>
                <option value="papine">Papine</option>
                <option value="western">Western</option>
              </select>
              <input type="datetime-local" required />
              <div className="modal-btns">
                <button type="submit" className="confirm-btn">Confirm</button>
                <button type="button" onClick={() => setShowAppointment(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="disclaimer">
        <p className="disclaimer-text">
          <strong>Disclaimer:</strong> 
          This chatbot is intended to provide general emotional support only and is not a substitute for professional mental health care. If you are experiencing a crisis or require immediate assistance, please contact a qualified mental health professional or emergency services.
          <br /><br />
          This chatbot is part of a school-based research project and is provided solely for demonstration purposes. It should not be shared or used outside of the scope of this specific study in which you are participating.
        </p>
        <button className="emergency-call-btn" onClick={() => window.open("tel:8886395433")}>📞 888-NEW-LIFE</button>
      </div>
      
      <div className="container">
        <div className="chat-popup">
          <div className="chat-header">
            <div className="header-info">
              <ChatBotIcon />
              <h2 className="Logo-text">Counselling Bot</h2>
            </div>
          </div>

          <div ref={chatBodyRef} className="chat-body">
            <div className="message bot-message">
              <ChatBotIcon />
              <p className="message-text">How can I assist you today? ❤️</p>
            </div>
            {chatHistory.map((chat, index) => <ChatMessage key={index} chat={chat} />)}
          </div>

          <div className="chat-footer">
            <ChatBotForm
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              generateChatBotResponse={generateChatBotResponse}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;