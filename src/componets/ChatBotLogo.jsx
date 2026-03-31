
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