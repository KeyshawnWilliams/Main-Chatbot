import React from "react";
import ChatBotForm from "../componets/ChatBotForm";
import ChatBotIcon from "../componets/chatbotIcon";
import ChatMessage from "../componets/ChatMessage";

const Home = ({
  isSidebarOpen,
  setIsSidebarOpen,
  handleNewChat,
  prevConversations,
  activeChatId,
  loadConversation,
  deleteConversation,
  chatBodyRef,
  chatHistory,
  setChatHistory,
  generateChatBotResponse,
  setShowBreathing,
}) => {
  return (

        <><div className="disclaimer">
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
          <br />
          <div>Once you are finish please feel frees to use the link below to navigate to the second form. <br/>
          <p>Link: <a href="https://docs.google.com/forms/d/e/1FAIpQLSdEBYKEf8h5EeiTB1os__UYTz4p0ZGnc-GU6LHEpuy7vKcu_A/viewform?usp=publish-editor"> FORM 2</a></p></div>
          <button
              className="emergency-call-btn"
              onClick={() => window.open("tel:8886395433")}
          >
              <span className="ph">📞</span> 888-NEW-LIFE
          </button>
      </div><div
          className={`app-body-wrapper ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
      >
              {/* SIDEBAR SECTION */}
              <div className="sidebar">
                  <button
                      className="toggle-btn"
                      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  >
                      {isSidebarOpen ? "◀" : "▶"}
                  </button>
                  {isSidebarOpen && (
                      <>
                          <button className="new-chat-btn" onClick={handleNewChat}>
                              + New Chat
                          </button>
                          <div className="history-section">
                              <h3 className="history-title">Recent Conversations</h3>
                              {prevConversations.length === 0 && (
                                  <p
                                      style={{ fontSize: "0.8rem", opacity: 0.5, padding: "10px" }}
                                  >
                                      No saved chats
                                  </p>
                              )}
                              {prevConversations.map((conv) => (
                                  <div
                                      key={conv.id}
                                      className={`history-item ${activeChatId === conv.id ? "active-history" : ""}`}
                                      onClick={() => loadConversation(conv)}
                                  >
                                      <div className="history-item-content">
                                          <span className="history-icon">💬</span>
                                          <span className="history-text">{conv.title}</span>
                                      </div>
                                      <button
                                          className="delete-chat-btn"
                                          onClick={(e) => deleteConversation(e, conv.id)}
                                      >
                                          ❌
                                      </button>
                                  </div>
                              ))}
                          </div>
                      </>
                  )}
              </div>

              <div className="main-content-area">


                  {/* CHAT POPUP SECTION */}
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
                                      Hi😊! I am your mental health support ChatBot, I am here to
                                      help. You can talk to me about anything that's on your mind, whether it's stress, anxiety, or just how your day is going. I'm here to listen and provide support in any way I can. Feel free to share your thoughts and feelings with me, and I'll do my best to assist you.
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
                                  generateChatBotResponse={generateChatBotResponse} />
                          </div>
                      </div>
                  </div>

                  {/* ORIGINAL RESOURCES FOOTER */}
                  <footer className="resource-footer">
                      <h3 className="footer-title">Mental Wellness Resources</h3>
                      <div className="resource-grid">
                          <a
                              href="https://www.stress.org/self-test"
                              target="_blank"
                              rel="noreferrer"
                              className="resource-card"
                          >
                              <div className="card-icon">📊</div>
                              <div className="card-info">
                                  <h4>Stress Test</h4>
                                  <p>Quick assessment to check your current stress levels.</p>
                              </div>
                          </a>
                          <div
                              className="resource-card"
                              style={{ cursor: "pointer" }}
                              onClick={() => setShowBreathing(true)}
                          >
                              <div className="card-icon">🧘</div>
                              <div className="card-info">
                                  <h4>Breathing Exercises</h4>
                                  <p>Follow-along guides for calming techniques.</p>
                              </div>
                          </div>
                          <div
                              className="resource-card"
                              style={{ cursor: "pointer" }}
                              onClick={() => window.open("tel:8886395433")}
                          >
                              <div className="card-icon">📞</div>
                              <div className="card-info">
                                  <h4>Helpline</h4>
                                  <p>Direct contact for immediate UTech campus support.</p>
                              </div>
                          </div>
                          <div></div>
                          <div className="resource-grid">
                              {/* Academic/Focus */}
                              <div className="resource-card">
                                  <div className="card-icon">⏱️</div>
                                  <div className="card-info">
                                      <h4>Study Focus</h4>
                                      <p>Use Pomodoro to beat burnout.</p>
                                  </div>
                              </div>

                              {/* Peer Support */}
                              <div className="resource-card">
                                  <div className="card-icon">📱</div>
                                  <div className="card-info">
                                      <h4>U-Matter</h4>
                                      <p>WhatsApp 'SUPPORT' to 876-838-4897.</p>
                                  </div>
                              </div>

                              {/* Existing Helpline */}
                              <div
                                  className="resource-card"
                                  onClick={() => window.open("tel:8886395433")}
                              >
                                  <div className="card-icon">📞</div>
                                  <div className="card-info">
                                      <h4>Utech Councelling</h4>
                                      <p>Call 888-NEW-LIFE anytime.</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </footer>
              </div>
          </div></>
  );
};

export default Home;
