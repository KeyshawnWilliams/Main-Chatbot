// src/components/exercises/GroundingTool.jsx
import React, { useState } from 'react';

const GroundingTool = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const instructions = [
  { id: 1, text: "Name 5 things you can SEE right now.", sub: "Look for small details like patterns, colors, or shadows." },
  { id: 2, text: "Name 4 things you can TOUCH right now.", sub: "Notice textures like your clothes, a table, or the floor." },
  { id: 3, text: "Name 3 things you can HEAR right now.", sub: "Listen for distant sounds or the hum of electronics." },
  { id: 4, text: "Name 2 things you can SMELL right now.", sub: "Try to catch a scent in the air or nearby objects." },
  { id: 5, text: "Name 1 thing you can TASTE right now.", sub: "Focus on the lingering taste of a drink or your breath." }
];

  return (
    <div className="breathing-overlay">
      <div className="exercise-card" style={{ textAlign: 'center', padding: '20px' }}>
        <h2 style={{ color: '#4bc0e8' }}>1-2-3 Grounding</h2>
        <div className="step-indicator" style={{ margin: '20px 0' }}>Step {step} of 5</div>
        
        <p className="breathing-instruction">{instructions[step-1].text}</p>
        <p className="breathing-subtext">{instructions[step-1].sub}</p>

        <div style={{ marginTop: '40px' }}>
          {step < 5 ? (
            <button className="new-chat-btn" onClick={() => setStep(step + 1)}>Next</button>
          ) : (
            <button className="close-breathing-btn" onClick={onClose}>Finish & Close</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroundingTool;