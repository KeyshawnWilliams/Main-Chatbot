import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();

// 1. IMPROVED CORS: Allows your group to test from any website link
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Load the key from Render's Environment Variables
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
  try {
    const { contents } = req.body;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview" 
    });

    const result = await model.generateContent({ contents });
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (error) {
    console.error("Shielded Error:", error.message);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// 2. DYNAMIC PORT: Uses Render's assigned port OR 5000 for local testing
const PORT = process.env.PORT || 5000;

// 3. 0.0.0.0 BINDING: Required for Render to see the traffic
app.listen(PORT, '0.0.0.0', () => {
  console.log(`UTech Backend is LIVE on port ${PORT}`);
});