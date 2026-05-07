// Main-Chatbot/API/chat.js
// This file sets up an Express server to handle chat requests from the frontend 
// and communicate with Gemini 3 via Proxy.


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { google } from 'googleapis'; 
import nodemailer from 'nodemailer'; 

dotenv.config();
const app = express();

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// --- 1. GEMINI SETUP (STRICTLY VERSION 3) ---
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

// --- 2. GOOGLE CALENDAR SETUP ---
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  SCOPES
);
const calendar = google.calendar({ version: 'v3', auth });

// --- ENDPOINT: CHATBOT (STRICTLY GEMINI-3) ---
app.post('/api/chat', async (req, res) => {
  try {
    const { contents } = req.body;
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview" 
    });
    const result = await model.generateContent({ contents });
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error) {
    res.status(500).json({ error: "Chat Error", details: error.message });
  }
});

// --- ENDPOINT: CHECK AVAILABILITY ---
app.post('/api/check-availability', async (req, res) => {
  const { date, time } = req.body;
  const startDateTime = new Date(`${date}T${time}:00`).toISOString();
  const endDateTime = new Date(new Date(startDateTime).getTime() + 60 * 60 * 1000).toISOString();

  try {
    const check = await calendar.freebusy.query({
      requestBody: {
        timeMin: startDateTime,
        timeMax: endDateTime,
        items: [{ id: 'primary' }]
      }
    });
    const busySlots = check.data.calendars.primary.busy;
    res.json({ available: busySlots.length === 0 });
  } catch (error) {
    res.status(500).json({ error: "Calendar Check Failed", details: error.message });
  }
});

// --- ENDPOINT: BOOK & EMAIL ---
app.post('/api/schedule', async (req, res) => {
  const { firstName, lastName, studentId, email, phone, campus, meetingType, date, time, description } = req.body;

  try {
    // A. Create Calendar Event
    await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: `Support Session (${meetingType}): ${firstName} ${lastName}`,
        location: meetingType === "face-to-face" ? `Campus: ${campus}` : "Online",
        description: `Student ID: ${studentId}\nPhone: ${phone}\nNotes: ${description}`,
        start: { dateTime: new Date(`${date}T${time}:00`).toISOString() },
        end: { dateTime: new Date(new Date(`${date}T${time}:00`).getTime() + 60 * 60 * 1000).toISOString() },
      },
    });

    // B. Send Email Notice
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
      }
    });

    await transporter.sendMail({
      from: '"UTech Counselling" <no-reply@utech.edu.jm>',
      to: email,
      subject: "Appointment Confirmed",
      text: `Hi ${firstName},\n\nYour ${meetingType} session is confirmed for ${date} at ${time}.\n\nCampus: ${campus}\nStudent ID: ${studentId}`
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`UTech Integrated Backend is LIVE on port ${PORT}`);
});