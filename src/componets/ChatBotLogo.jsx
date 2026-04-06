// Main-Chatbot/src/componets/ChatBotLogo.jsx
// This component renders the logo for the chatbot. It imports an image file and displays it with an alt text for accessibility. 
// The logo can be styled using CSS to fit the design of the application.
import React from 'react';
// Importing ensures the bundler processes the file correctly
import logo from '../Assets/Let’s Talk!!.png'; 

const ChatBotLogo = () => {
    return (
        <img 
            src={logo} 
            alt="chatbot logo" 
            className="chatbot-logo"
        />
    );
};

export default ChatBotLogo;