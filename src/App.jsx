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

  // Update chat safely
  const updateHistory = (text, isError = false) => {
    setChatHistory((prev) => [
      ...prev.filter((msg) => msg.text !== "thinking...."),
      { role: "model", text, error: isError },
    ]);
  };

  //generate response from Gemini API and handle risk detection
  const generateChatBotResponse = async (prevChatHistory) => {
    const userLatestInput =
      prevChatHistory[prevChatHistory.length - 1].text;

    //RISK DETECTION
    const riskType = detectRisk(userLatestInput);

    if (riskType === "CRISIS") {
      await SendEmail(userLatestInput);
      updateHistory(
        "I'm very concerned about you. Please call 888-NEW-LIFE (639-5433) or visit the UTech Counselling Unit immediately.",
        true
      );
      return;
    }

    if (riskType === "PANIC") {
      setShowBreathing(true);
      updateHistory(
        "It sounds like you're overwhelmed. I've opened a breathing exercise for you."
      );
      return;
    }

    if (riskType === "STRESS_TRIGGER") {
      updateHistory(
        "I hear you. You can also book a session with a UTech counselor using the appointment option above."
      );
    }

    // Gemin API Request Construction
    const finalContents = [
      SYSTEM_CONFIG.instruction,
      SYSTEM_CONFIG.response,
      ...prevChatHistory.map((chat) => ({
      role: chat.role === "user" ? "user" : "model",
      parts: [{ text: String(chat.text) }],
      })),
  ];

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: finalContents }),
    };

    try {
      

      const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: finalContents }),
      });

      const data = await response.json();
      console.log("FULL RESPONSE:", data);

      // Handle API errors
      if (!response.ok) {
        throw new Error(data?.error?.message || "API failed");
      }

      // Handle empty responses
      if (!data.candidates || data.candidates.length === 0) {
        updateHistory(
          "I couldn't generate a response right now. Try again."
        );
        return;
      }

      // Safe extraction
      const apiResponseText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!apiResponseText) {
        throw new Error("Invalid response structure");
      }
      // Clean formatting (e.g., remove markdown bold)
      const cleanedText = apiResponseText
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();

      updateHistory(cleanedText);
    } catch (error) {
      console.error("ERROR:", error);
      updateHistory(
        "I'm having trouble connecting. Please try again or reach out to a counselor.",
        true
      );
    }
  };

  // Auto scroll for new messages
  useEffect(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  // Initial system prompt setup
  //make sure this runs only once at the start of the conversation
  return (
    <>
      {/* HEADER */}
      <div className="main-header">
        <ChatBotLogo />
        <h1 className="main-header-text">
          UTech Mental Health Support
        </h1>

        <ul className="navbar">
          <li onClick={() => setShowAppointment(true)}>
            Set Appointments
          </li>
          <li>About Us</li>
        </ul>
      </div>

      {/* BREATHING TOOL */}
      {showBreathing && (
        <BreathingTool onClose={() => setShowBreathing(false)} />
      )}

      {/* APPOINTMENT MODAL */}
      {showAppointment && (
        <div className="modal-backdrop">
          <div className="appointment-modal">
            <h2>Book a Counselling Session</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowAppointment(false);
                alert("Request sent to UTech Counselling!");
              }}
            >
              <input
                type="text"
                placeholder="Student ID"
                required
              />

              <select required>
                <option value="">Select Campus</option>
                <option value="papine">Papine</option>
                <option value="western">Western</option>
              </select>

              <input type="datetime-local" required />

              <div className="modal-btns">
                <button type="submit" className="confirm-btn">
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setShowAppointment(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISCLAIMER */}
      <div className="disclaimer">
        <p className="disclaimer-text">
          <strong>Disclaimer:</strong> 
          This chatbot is intended to provide general emotional support only and is not a substitute for professional mental health care. If you are experiencing a crisis or require immediate assistance, please contact a qualified mental health professional or emergency services.

          This chatbot is part of a school-based research project and is provided solely for demonstration purposes. It should not be shared or used outside of the scope of this specific study in which you are participating.
          </p>{/* END OF DISCLAIMER */}
          {/* EMERGENCY CALL BUTTON */}
      <button
          className="emergency-call-btn"
          onClick={() => window.open("tel:8886395433")}
        >
          📞 888-NEW-LIFE
        </button>
      </div>{/* END OF HEADER */}
      
      {/* CHAT UI */}
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
              <p className="message-text">
                How can I assist you today? Remember, I'm here to listen and support you. You can share anything on your mind, and I'll do my best to help. ❤️
              </p>
            </div>

            {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}
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