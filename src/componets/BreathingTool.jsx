// Main-Chatbot/src/componets/BreathingTool.jsx
// This component provides a simple breathing exercise tool that can be triggered when 
// the chatbot detects signs of panic in the user's input. It uses a visual circle that 
// expands and contracts to guide the user's breathing rhythm, along with instructional text. 
// The user can close the tool once they feel calmer.

import React, { useState, useEffect } from "react";

const BreathingTool = ({ onClose }) => {
  
  const [phase, setPhase] = useState("Inhale...");
  const [isExpanding, setIsExpanding] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      // Toggle the circle size
      setIsExpanding((prev) => !prev);
      
      // Toggle the text - strictly using setPhase to match your state variable
      setPhase((prev) => (prev === "Inhale..." ? "Exhale..." : "Inhale..."));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="breathing-overlay">
      <div className={`breathing-circle ${isExpanding ? "expand" : "shrink"}`}>
        {/* The key={phase} forces React to re-render the span, triggering the CSS animation */}
        <span key={phase} className="breathing-text">{phase}</span>
      </div>
      <p className="breathing-instruction">{phase}</p>
      <p className="breathing-subtext">
        <strong>Focus your eyes on the circle and follow the rhythm</strong>
      </p>
      <button className="close-breathing-btn" onClick={onClose}>
        I feel calmer now
      </button>
    </div>
  );
};

export default BreathingTool;