import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
  try {
    const { contents } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash" });
    const result = await model.generateContent({ contents });
    const response = await result.response;
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch Gemini" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));