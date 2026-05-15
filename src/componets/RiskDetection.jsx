// src/componets/RiskDetector.js
// Main-Chatbot/src/componets/RiskDetection.jsx
// This module defines a function to detect potential risks in the user's input message. 
// It categorizes the input into three risk levels: CRISIS, PANIC, and STRESS_TRIGGER, based on the presence of specific keywords or phrases. 
// The function returns the detected risk category or null if no risks are identified, allowing the chatbot to respond appropriately based on the user's emotional state.
export const RISK_CATEGORIES = {
  CRISIS: [
    "kill myself", "end my life", "suicide", "hurt myself", "want to die", 
    "wish i were dead", "end it all", "no reason to live", "disappear", "die alone", "can't go on", "give up", "self-harm", "cut myself", "overdose", "hang myself", "jump off", "take my life"
  ],
  PANIC: [
    "anxious", "scared", "panic attack", "can't breathe", "heart racing", 
    "hyperventilating", "feeling overwhelmed", "losing control", "overwhelmed", "terrified", "frightened", "dread", "uneasy", "nervous", "worried", "fearful"
  ],
  STRESS_TRIGGER: [
    "hopeless", "worthless", "burden", "lonely", "abandoned", 
    "heartbroken", "failed", "exam stress", "dropout", "relationship issues", "family problems", "financial stress", "academic pressure", "social isolation", "feeling alone", "overwhelmed by responsibilities"
  ]
};

/**
 * Detects the type of risk and returns the category.
 * @param {string} text - The user's input message.
 * @returns {string|null} - Returns 'CRISIS', 'PANIC', 'STRESS_TRIGGER' or null.
 */
export const detectRisk = (text) => {
  if (!text) return null;
  const input = text.toLowerCase();

  if (RISK_CATEGORIES.CRISIS.some(term => input.includes(term))) return "CRISIS";
  if (RISK_CATEGORIES.PANIC.some(term => input.includes(term))) return "PANIC";
  if (RISK_CATEGORIES.STRESS_TRIGGER.some(term => input.includes(term))) return "STRESS_TRIGGER";

  return null;
};