
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function main(question) {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
  });
console.log(question)
  const responce = await chat.sendMessage({
    message: question.question,
  });
  

  return responce
}

export default main;