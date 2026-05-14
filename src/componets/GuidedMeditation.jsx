import React from "react";
// Import the file so Vite can resolve the path from the assets folder
import meditationMusic from "../Assets/5 Minute Meditation Music - with Earth Resonance Frequency for Deeper Relaxation.mp3";

const MeditationTool = ({ onClose }) => {
  return (
    <div className="breathing-overlay">
      <div className="breathing-circle shrink"> 
        <span className="material-symbols-rounded" style={{ fontSize: '3rem' }}>graphic_eq</span>
      </div>
      <h2 className="breathing-instruction">5-Minute Calm</h2>
      <p className="breathing-subtext">Close your eyes and focus on the sound.</p>
      
      {/* Updated source to use the imported music variable */}
      <audio controls style={{ marginTop: '20px' }}>
        <source src={meditationMusic} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <button className="close-breathing-btn" onClick={onClose}>Stop & Exit</button>
    </div>
  );
};

export default MeditationTool;