// Main-Chatbot/src/componets/EmergencyEmail.jsx
// This module defines a function to send an emergency email using the EmailJS service. 
// It retrieves necessary configuration values from environment variables, constructs the email content based on the user's message, and handles the API call to send the email. 
// The function includes error handling to log any issues that arise during the email sending process.

import emailjs from "@emailjs/browser";

export const SendEmail = async (userMessage) => {
    //for future configurations, 
    //we can add more fields to the templateMessage object and reference them in the EmailJS template
    // 1. Pull values from the .env file
    const serviceID = import.meta.env.VITE_EMAIL_SERVICE_ID;
    const templateID = import.meta.env.VITE_EMAIL_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAIL_PUBLIC_KEY;

    // 2. Safety Check: Ensure keys exist before trying to send
    if (!serviceID || !templateID || !publicKey) {
        console.error("EmailJS Error: Environment variables are missing. Check your .env file.");
        return;
    }

    const templateMessage = {
        expert_name: "University Counselor",
        Student_Message: userMessage,
        alert_time: new Date().toLocaleString(),
        subject: "Urgent: Student in Distress",
        Phone_Number: "876-256-8976", // Placeholder - ideally this would be dynamic or configured
        student_Alias: "Soft Cat" // Placeholder - ideally this would be dynamic or configured
    };

    try {
        const response = await emailjs.send(
            serviceID, 
            templateID, 
            templateMessage, 
            publicKey
        );
        console.log("Email sent successfully!", response.status, response.text);
        return response; // Return so your UI can show a success message
    } catch (error) {
        console.error("Failed to send email:", error);
        throw error; // Throw so your UI can show an error message
    }
};