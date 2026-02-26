// src/componets/RiskDetector.js

export const HIGH_RISK_TERMS = [
  "kill myself",
  "end my life",
  "suicide",
  "hurt myself",
  "i want to die",
  "i can't go on",
  "i don't want to live",
  "i wish i were dead",
  "i want to end it all",
  "i feel hopeless",
  "i feel worthless",
  "i feel like a burden",
  "i have no reason to live",
  "i want to disappear",
  "i feel anxious",
  "i feel scared",
  "i feel lonely",
  "i feel abandoned",
  "i feel heartbroken",
];

/**
 * Detects if the input text contains any high-risk keywords.
 * @param {string} text - The user's input message.
 * @returns {boolean} - Returns true if a risk is detected.
 */
export const detectRisk = (text) => {
  if (!text) return false;
  return HIGH_RISK_TERMS.some(term => text.toLowerCase().includes(term));
};