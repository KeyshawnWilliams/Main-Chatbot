// src/components/exercises/ReflectionTool.jsx
import React, { useState } from "react";
const ReflectionTool = ({ onClose }) => {
  const questions = [
    "What is one thing that made you smile today?",
    "What is something you're looking forward to this week?",
    "How did you handle a challenge today?"
  ];
  const [randomQ] = useState(questions[Math.floor(Math.random() * questions.length)]);

  return (
    <div className="breathing-overlay">
      <div className="appointment-modal"> {/* Reusing your white modal style */}
        <h3 style={{ marginBottom: '15px' }}>Reflection of the Day</h3>
        <p style={{ fontStyle: 'italic', marginBottom: '20px' }}>"{randomQ}"</p>
        <textarea 
          className="message-box" 
          placeholder="Type your thoughts here..." 
          style={{ width: '100%', height: '100px', background: '#f5f5f5', padding: '10px' }}
        />
        <button className="new-chat-btn" style={{ width: '100%', marginTop: '15px' }} onClick={onClose}>
          Save Reflection
        </button>
      </div>
    </div>
  );
};

export default ReflectionTool;