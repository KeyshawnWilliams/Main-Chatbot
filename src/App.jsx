import React, { useRef, useState, useEffect } from "react";
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
  const [activeChatId, setActiveChatId] = useState(null); // Tracks if we are in an existing session
  const [showBreathing, setShowBreathing] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [prevConversations, setPrevConversations] = useState([]);

  const chatBodyRef = useRef();

  // --- PERSISTENCE & SIDEBAR LOGIC ---

  // 1. Initial Load: Get saved sessions from browser storage
  useEffect(() => {
    const savedSessions = localStorage.getItem("utech_chat_sessions");
    if (savedSessions) {
      setPrevConversations(JSON.parse(savedSessions));
    }
    
    const lastActive = localStorage.getItem("current_active_chat");
    const lastId = localStorage.getItem("active_chat_id");
    if (lastActive && lastId) {
      setChatHistory(JSON.parse(lastActive));
      setActiveChatId(JSON.parse(lastId));
    }
  }, []);

  // 2. Auto-save current chat and Update Sidebar entry
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem("current_active_chat", JSON.stringify(chatHistory));
      localStorage.setItem("active_chat_id", JSON.stringify(activeChatId));
      
      // Update the sidebar list immediately as the chat grows
      updateSidebarList(chatHistory);
    }
  }, [chatHistory]);

  //sidebar logics
  //save new conversation to sidebar list or update existing one based on activeChatId 
  const updateSidebarList = (currentHistory) => {
    setPrevConversations((prev) => {
      const existingIndex = prev.findIndex((conv) => conv.id === activeChatId);

      if (existingIndex !== -1) {
        // UPDATE EXISTING: Swap out the data for the active ID
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], data: currentHistory };
        localStorage.setItem("utech_chat_sessions", JSON.stringify(updated));
        return updated;
      } else if (currentHistory.length >= 2) { 
        // SAVE NEW: Create entry once user/bot have exchanged first messages
        const firstUserMsg = currentHistory.find(m => m.role === "user")?.text || "New Session";
        const newId = Date.now();
        setActiveChatId(newId);
        
        const newSession = {
          id: newId,
          title: firstUserMsg.substring(0, 25) + (firstUserMsg.length > 25 ? "..." : ""),
          data: currentHistory
        };
        const updated = [newSession, ...prev];
        localStorage.setItem("utech_chat_sessions", JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  const handleNewChat = () => {
    setChatHistory([]);
    setActiveChatId(null);
    localStorage.removeItem("current_active_chat");
    localStorage.removeItem("active_chat_id");
  };
  //logics to delete chat history 
  // Deletes a conversation from the sidebar and localStorage. If the deleted conversation is currently active, it also clears the chat screen.
  
  const deleteConversation = (e, id) => {
    e.stopPropagation(); 
    const updatedSessions = prevConversations.filter((conv) => conv.id !== id);
    setPrevConversations(updatedSessions);
    localStorage.setItem("utech_chat_sessions", JSON.stringify(updatedSessions));
    
    // If deleted chat was the one on screen, clear the screen
    if (activeChatId === id) handleNewChat();
  };

  const loadConversation = (conversation) => {
    setChatHistory(conversation.data);
    setActiveChatId(conversation.id);
  };

  // --- CHAT & API LOGIC ---

  const updateHistory = (text, isError = false) => {
    setChatHistory((prev) => [
      ...prev.filter((msg) => msg.text !== "thinking...."),
      { role: "model", text, error: isError },
    ]);
  };

  const generateChatBotResponse = async (prevChatHistory) => {
    const userLatestInput = prevChatHistory[prevChatHistory.length - 1].text;

    //filter user input for potential risks and trigger appropriate responses or interventions
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
    if (riskType === "STRESS_TRIGGER") {
      updateHistory("It is okay to feel this way. Remember to take breaks and reach out to friends, family, or the UTech Counselling Unit for support. You're not alone in this.");
    }

    // Show a temporary "thinking..." message while waiting for the API response
    const finalContents = [
      { role: SYSTEM_CONFIG.instruction.role, parts: [{ text: String(SYSTEM_CONFIG.instruction.parts[0].text).trim() }] },
      { role: SYSTEM_CONFIG.response.role, parts: [{ text: String(SYSTEM_CONFIG.response.parts[0].text).trim() }] },
      ...prevChatHistory.map((chat) => ({
        role: chat.role === "user" ? "user" : "model",
        parts: [{ text: String(chat.text || " ").trim() }],
      })),
    ];

    //connect to API and handle response
    //Third party web service call to mitigate API key exposure on client side. 
    // //This server acts as a secure proxy, forwarding the chatbot's conversation history to the actual AI API and returning the generated response back to the client. 
    // This way, the sensitive API key is kept hidden on the server, while still allowing the chatbot to function properly on the client side.
    try {
      const response = await fetch("https://main-chatbot-uk5i.onrender.com/API/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: finalContents }),
      });

      const data = await response.json();
      const apiResponseText = data.text || data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!apiResponseText) throw new Error("Invalid response");

      const cleanedText = apiResponseText.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(cleanedText);
    } catch (error) {
      updateHistory("I'm having trouble connecting. Please try again.", true);
    }
  };

  useEffect(() => {
    chatBodyRef.current?.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
  }, [chatHistory]);

  return (
    <>
      <div className="main-header">
        <ChatBotLogo />
        <h1 className="main-header-text">UTech Mental Health Support</h1>
        <ul className="navbar">
          <li className="ap" onClick={() => setShowAppointment(true)}>Set Appointments</li>
          <li className="as">About Us</li>
        </ul>
        <div className="disclaimer">
          <p className="disclaimer-text">
            <strong>Disclaimer:</strong>
            This chatbot is intended to provide general emotional support only
            and is not a substitute for professional mental health care. If you
            are experiencing a crisis or require immediate assistance, please
            contact a qualified mental health professional or emergency
            services.
            <br />
            <br />
            This chatbot is part of a school-based research project and is
            provided solely for demonstration purposes. It should not be shared
            or used outside of the scope of this specific study in which you are
            participating.
          </p>
          <button className="emergency-call-btn" onClick={() => window.open("tel:8886395433")}>
            <span className="ph">📞</span> 888-NEW-LIFE
          </button>
        </div>
      </div>

      {showBreathing && <BreathingTool onClose={() => setShowBreathing(false)} />}

      <div className={`app-body-wrapper ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <div className="sidebar">
          <button className="toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? "◀" : "▶"}
          </button>

          {isSidebarOpen && (
            <>
              <button className="new-chat-btn" onClick={handleNewChat}>+ New Chat</button>
              <div className="history-section">
                <h3 className="history-title">Recent Conversations</h3>
                {prevConversations.length === 0 && <p style={{fontSize: '0.8rem', opacity: 0.5, padding: '10px'}}>No saved chats</p>}
                {prevConversations.map((conv) => (
                  <div 
                    key={conv.id} 
                    className={`history-item ${activeChatId === conv.id ? 'active-history' : ''}`} 
                    onClick={() => loadConversation(conv)}
                  >
                    <div className="history-item-content">
                      <span className="history-icon">💬</span>
                      <span className="history-text">{conv.title}</span>
                    </div>
                    <button className="delete-chat-btn" onClick={(e) => deleteConversation(e, conv.id)}>❌</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="main-content-area">
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
                  <p className="message-text">Hi😊! I am your mental health support ChatBot, I am here to help.</p>
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

          <footer className="resource-footer">
            <h3 className="footer-title">Mental Wellness Resources</h3>
            <div className="resource-grid">
              <a href="https://www.stress.org/self-test" target="_blank" rel="noreferrer" className="resource-card">
                <div className="card-icon">📊</div>
                <div className="card-info">
                  <h4>Stress Test</h4>
                  <p>Quick assessment to check your current stress levels.</p>
                </div>
              </a>
              <div className="resource-card" style={{cursor: 'pointer'}} onClick={() => setShowBreathing(true)}>
                <div className="card-icon">🧘</div>
                <div className="card-info"><h4>Breathing Exercises</h4><p>Follow-along guides for calming techniques.</p></div>
              </div>
              <div className="resource-card" style={{cursor: 'pointer'}} onClick={() => window.open("tel:8886395433")}>
                <div className="card-icon">📞</div>
                <div className="card-info"><h4>Helpline</h4><p>Direct contact for immediate UTech campus support.</p></div>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {showAppointment && (
        <div className="modal-backdrop">
          <div className="appointment-modal">
            <h2>Book a Counselling Session</h2>
            <form onSubmit={(e) => { e.preventDefault(); setShowAppointment(false); alert("Request sent!"); }}>
              <input type="text" placeholder="Student ID" required />
              <select required><option value="">Select Campus</option><option value="papine">Papine</option><option value="western">Western</option></select>
              <input type="datetime-local" required />
              <div className="modal-btns">
                <button type="submit" className="confirm-btn">Confirm</button>
                <button type="button" onClick={() => setShowAppointment(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default App;