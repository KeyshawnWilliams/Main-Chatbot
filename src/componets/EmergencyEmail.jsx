import emailjs from "@emailjs/browser";

export const SendEmail = (userMessage) => {

    const templateMessage = {
        expert_name: "university Counselor",
        Student_Message: userMessage,
        alert_time: new Date().toLocaleString(),
        subject: "Urgent: Student in Distress",
    };

    const serviceID = "keyshawn563@gmail.com";
    const templateID = "template_9h8l7qj";
    const userID = "user_9h8l7qj";
    const publicKey = "9h8l7qj";

    return emailjs.send(serviceID, templateID, templateMessage, publicKey)
        .then((response) => {
            console.log("Email sent successfully!", response.status, response.text);
        })
        .catch((error) => {
            console.error("Failed to send email:", error);
        });
};