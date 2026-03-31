import React, { useState, useEffect } from "react";
//import "./index.css";

const BreathingTool = ({ onClose }) => {
  const [phase, setPhase] = useState("Inhale...");
  const [isExpanding, setIsExpanding] = useState(true);

  useEffect(() => {
    // 5000ms (4 seconds) is the standard for "Box Breathing"
    const timer = setInterval(() => {
      setIsExpanding((prev) => !prev);
      setInstruction((prev) => (prev === "Inhale..." ? "Exhale..." : "Inhale..."));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

    // Update the instruction text based on the current phase
    //
  return (
    <div className="breathing-overlay">
      <div className={`breathing-circle ${isExpanding ? "expand" : "shrink"}`}>
        <span className="breathing-text">{phase}</span>
      </div>
      <p className="breathing-instruction">{phase}</p>
      <p className="breathing-subtext"><strong>Focus your eyes on the circle and follow the rhythm</strong></p>
      <button className="close-breathing-btn" onClick={onClose}>
        I feel calmer now
      </button>
    </div>
  );
};

export default BreathingTool;