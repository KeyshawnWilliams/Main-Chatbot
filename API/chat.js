import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// This stays on the server. The frontend never sees this key.
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
  try {
    const { contents } = req.body;

    // Use the official Gemini 3 Flash string for 2026
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview" 
    });

    const result = await model.generateContent({ contents });
    const response = await result.response;
    const text = response.text();

    // Send the text back to your React app
    res.json({ text });
  } catch (error) {
    console.error("Shielded Error:", error.message);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Secure Backend LIVE on port ${PORT}`));