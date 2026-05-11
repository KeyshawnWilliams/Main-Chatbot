// src/components/exercises/GroundingTool.jsx
import React, { useState } from 'react';

const GroundingTool = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const instructions = [
    { id: 1, text: "Name 3 things you can SEE right now.", sub: "Look around and notice the details." },
    { id: 2, text: "Name 2 things you can FEEL right now.", sub: "Focus on your touch (e.g., your chair, your clothes)." },
    { id: 3, text: "Name 1 thing you can HEAR right now.", sub: "Listen closely to the background noise." }
  ];

  return (
    <div className="breathing-overlay">
      <div className="exercise-card" style={{ textAlign: 'center', padding: '20px' }}>
        <h2 style={{ color: '#4bc0e8' }}>1-2-3 Grounding</h2>
        <div className="step-indicator" style={{ margin: '20px 0' }}>Step {step} of 3</div>
        
        <p className="breathing-instruction">{instructions[step-1].text}</p>
        <p className="breathing-subtext">{instructions[step-1].sub}</p>

        <div style={{ marginTop: '40px' }}>
          {step < 3 ? (
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