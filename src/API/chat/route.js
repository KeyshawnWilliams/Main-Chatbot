// app/api/chat/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { contents } = await req.json();
    
    // The key is pulled from the server environment, NOT the browser
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent({ contents });
    const response = await result.response;
    
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}