import React, { useRef, useState, useEffect } from "react";
import ChatBotLogo from "./componets/ChatBotLogo";
import { SYSTEM_CONFIG } from "./componets/SystemConfig";
import { detectRisk } from "./componets/RiskDetection";
import { SendEmail } from "./componets/EmergencyEmail";
import BreathingTool from "./componets/BreathingTool";

// Separate Page Imports
import Home from "./pages/Home";
import AppointmentPage from "./pages/appointment";
import About from "./pages/About";
import "./index.css";
import "./pages/style.css";

const App = () => {
  // 1. STATE DECLARATIONS 
  const [view, setView] = useState("home");
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [showBreathing, setShowBreathing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [prevConversations, setPrevConversations] = useState([]);
  
  const chatBodyRef = useRef();

  // --- PERSISTENCE & SIDEBAR LOGIC ---

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

  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem("current_active_chat", JSON.stringify(chatHistory));
      localStorage.setItem("active_chat_id", JSON.stringify(activeChatId));
      updateSidebarList(chatHistory);
    }
  }, [chatHistory]);

  const updateSidebarList = (currentHistory) => {
    setPrevConversations((prev) => {
      const existingIndex = prev.findIndex((conv) => conv.id === activeChatId);

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], data: currentHistory };
        localStorage.setItem("utech_chat_sessions", JSON.stringify(updated));
        return updated;
      } else if (currentHistory.length >= 2) { 
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

  const deleteConversation = (e, id) => {
    e.stopPropagation(); 
    const updatedSessions = prevConversations.filter((conv) => conv.id !== id);
    setPrevConversations(updatedSessions);
    localStorage.setItem("utech_chat_sessions", JSON.stringify(updatedSessions));
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
      updateHistory("It is okay to feel this way. Remember to take breaks and reach out to friends, family, or the UTech Counselling Unit for support.");
    }

    const finalContents = [
      { role: SYSTEM_CONFIG.instruction.role, parts: [{ text: String(SYSTEM_CONFIG.instruction.parts[0].text).trim() }] },
      { role: SYSTEM_CONFIG.response.role, parts: [{ text: String(SYSTEM_CONFIG.response.parts[0].text).trim() }] },
      ...prevChatHistory.map((chat) => ({
        role: chat.role === "user" ? "user" : "model",
        parts: [{ text: String(chat.text || " ").trim() }],
      })),
    ];

    try {
      const response = await fetch("https://main-chatbot-uk5i.onrender.com/API/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: finalContents }),
      });

      const data = await response.json();
      const apiResponseText = data.text || data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
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

        <div className="main-header-text">
          <h1>Mental Health Chatbot</h1>
        </div>
        <br />
        <ChatBotLogo />
        <ul className="navbar">
          <li onClick={() => setView("home")}>Home</li>
          <li onClick={() => setView("appointment")}>Set Appointments</li>
          <li onClick={() => setView("about")}>About Us</li>
        </ul>
      </div>

      {showBreathing && <BreathingTool onClose={() => setShowBreathing(false)} />}

      {view === "home" && (
        <Home 
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          prevConversations={prevConversations}
          activeChatId={activeChatId}
          chatBodyRef={chatBodyRef}
          generateChatBotResponse={generateChatBotResponse}
          handleNewChat={handleNewChat}
          loadConversation={loadConversation}
          deleteConversation={deleteConversation}
          setShowBreathing={setShowBreathing}
        />
      )}

      {view === "appointment" && <AppointmentPage onBack={() => setView("home")} />}
      
      {view === "about" && <About />}
    </>
  );
};

export default App;