import React, { useState, useEffect } from "react";
import { SendAppointmentEmail } from "../componets/Emailconfirmation"; // Adjust this path to your email utility folder
import "./style.css";

const AppointmentPage = ({ onBack }) => {
  const [appointmentDetails, setAppointmentDetails] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    campus: "",
    phone: "",
    email: "",
    meetingType: "select",
    description: "",
    date: "",
    time: "",
  });

  const [status, setStatus] = useState("");
  const [isAvailable, setIsAvailable] = useState(null);

  // Check availability when date and time are set
  useEffect(() => {
    if (appointmentDetails.date && appointmentDetails.time) {
      checkSlotAvailability();
    }
  }, [appointmentDetails.date, appointmentDetails.time]);

  const checkSlotAvailability = async () => {
    setIsAvailable(null);
    setStatus("Checking availability...");
    try {
      // Ensure the URL matches your backend route casing
      const response = await fetch("https://main-chatbot-uk5i.onrender.com/api/check-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          date: appointmentDetails.date, 
          time: appointmentDetails.time 
        }),
      });
      const data = await response.json();
      if (data.available) {
        setIsAvailable(true);
        setStatus("Slot is available! ✅");
      } else {
        setIsAvailable(false);
        setStatus("That slot is already booked. ❌");
      }
    } catch (error) {
      setStatus("Error checking availability.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAvailable === false) return;

    setStatus("Finalizing booking...");

    try {
      // 1. Send to Backend (Google Calendar & Database)
      const response = await fetch("https://main-chatbot-uk5i.onrender.com/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentDetails),
      });

      if (response.ok) {
        // 2. Send emails using EmailJS utility
        await SendAppointmentEmail(appointmentDetails);

        alert("Appointment Booked & Confirmation Email Sent!");
        if (onBack) onBack();
      } else {
        setStatus("Error booking calendar slot.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setStatus("Failed to complete request.");
    }
  };

  // Define the back navigation handler
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back(); // Fallback to browser history
    }
  };

  return (
    <div className="appointment-page-container">
      <h2>Book a Counselling Session</h2>
      <p>Fill out the details below to request your consultation.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="appointment-form-grid">
          <div className="appointment-form-group">
            <label>First Name</label>
            <input 
              type="text" 
              placeholder="John" 
              value={appointmentDetails.firstName}
              onChange={(e) => setAppointmentDetails({...appointmentDetails, firstName: e.target.value})}
              required 
            />
          </div>
          <div className="appointment-form-group">
            <label>Last Name</label>
            <input 
              type="text" 
              placeholder="Doe" 
              value={appointmentDetails.lastName}
              onChange={(e) => setAppointmentDetails({...appointmentDetails, lastName: e.target.value})}
              required 
            />
          </div>
        </div>

        <div className="appointment-form-grid">
          <div className="appointment-form-group">
            <label>Student ID</label>
            <input 
              type="text" 
              placeholder="620000000" 
              value={appointmentDetails.studentId}
              onChange={(e) => setAppointmentDetails({...appointmentDetails, studentId: e.target.value})}
              required 
            />
          </div>
          <div className="appointment-form-group">
            <label>Campus</label>
            <select 
              value={appointmentDetails.campus}
              onChange={(e) => setAppointmentDetails({...appointmentDetails, campus: e.target.value})}
              required 
            >
              <option value="">Select Campus</option>
              <option value="papine">Papine</option>
              <option value="western">Western</option>
            </select>
          </div>
        </div>

        <div className="appointment-form-grid">
          <div className="appointment-form-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              placeholder="876-555-5555" 
              value={appointmentDetails.phone}
              onChange={(e) => setAppointmentDetails({...appointmentDetails, phone: e.target.value})}
              required 
            />
          </div>
          <div className="appointment-form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="john.doe@utech.edu.jm" 
              value={appointmentDetails.email}
              onChange={(e) => setAppointmentDetails({...appointmentDetails, email: e.target.value})}
              required 
            />
          </div>
        </div>

        <div className="appointment-form-group">
          <label>Meeting Type</label>
          <select 
            value={appointmentDetails.meetingType}
            onChange={(e) => setAppointmentDetails({...appointmentDetails, meetingType: e.target.value})}
            required
          >
            <option value="select" disabled hidden>Select an option</option>
            <option value="face-to-face">Face-to-Face</option>
            <option value="online">Online</option>
          </select>
        </div>

        <div className="appointment-form-grid">
          <div className="appointment-form-group">
            <label>Date</label>
            <input 
              type="date" 
              value={appointmentDetails.date}
              onChange={(e) => setAppointmentDetails({...appointmentDetails, date: e.target.value})}
              required 
            />
          </div>
          <div className="appointment-form-group">
            <label>Time</label>
            <input 
              type="time" 
              value={appointmentDetails.time}
              onChange={(e) => setAppointmentDetails({...appointmentDetails, time: e.target.value})}
              required 
            />
          </div>
        </div>

        <div className="appointment-form-group">
          <label>Description</label>
          <textarea 
            placeholder="Briefly state why you want to book this session..." 
            rows="4" 
            value={appointmentDetails.description}
            onChange={(e) => setAppointmentDetails({...appointmentDetails, description: e.target.value})}
            required
          ></textarea>
        </div>

        {status && (
          <p className={isAvailable === false ? "status-error-text" : "status-success-text"}>
            {status}
          </p>
        )}

        <div className="appointment-btn-group">
          <button 
            type="submit" 
            className="appointment-submit-btn" 
            disabled={isAvailable === false || !appointmentDetails.date || !appointmentDetails.time}
          >
            Submit
          </button>
          <button type="button" onClick={handleBack} className="appointment-cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentPage;