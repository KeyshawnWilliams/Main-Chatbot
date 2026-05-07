

export const Emailcornfirmation = async (details) => {
    const serviceID = import.meta.env.VITE_EMAIL_SERVICE_ID;
    const templateID = import.meta.env.VITE_APPEMAIL_TEMPLATE_ID; // Use your new template ID
    const publicKey = import.meta.env.VITE_EMAIL_PUBLIC_KEY;

    if (!serviceID || !templateID || !publicKey) {
        console.error("EmailJS Error: Missing keys.");
        return;
    }

    // Map your form state to the EmailJS Template variables
    const templateParams = {
        user_name: `${details.firstName} ${details.lastName}`,
        user_email: details.email,
        student_id: details.studentId,
        appointment_date: details.date,
        appointment_time: details.time,
        meeting_type: details.meetingType,
        campus: details.campus,
        message: details.description,
        subject: `New Appointment: ${details.firstName} ${details.lastName}`
    };

    try {
        const response = await emailjs.send(serviceID, templateID, templateParams, publicKey);
        console.log("Appointment email sent!", response.status);
        return response;
    } catch (error) {
        console.error("Appointment Email Failed:", error);
        throw error;
    }
};