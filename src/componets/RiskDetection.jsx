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
  "i want to end it all"
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