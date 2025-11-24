import { GoogleGenAI } from "@google/genai";
import * as fs from 'fs/promises';
import path from 'path';

// Define the file path for the chat history
const HISTORY_FILE = path.join(process.cwd(), 'history.json');
const MODEL_NAME = "gemini-2.5-flash";

const ai = new GoogleGenAI({});

/**
 * Loads the chat history from the JSON file.
 * Returns an array of Content objects or an empty array if the file doesn't exist.
 */
async function loadHistory() {
  try {
    const data = await fs.readFile(HISTORY_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log("No existing history file found. Starting a new chat.");
      return [];
    }
    throw error;
  }
}

/**
 * Saves the current chat history to the JSON file.
 */
async function saveHistory(history) {
  try {
    // Write the history array in JSON format
    await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf-8');
    console.log(`\nChat history saved to ${HISTORY_FILE}`);
  } catch (error) {
    console.error("Error saving history:", error);
  }
}

async function main(question) {
  // Load previous history
  const initialHistory = await loadHistory();

  // Create the chat session with the loaded history
  const chat = ai.chats.create({
    model: MODEL_NAME,
    history: initialHistory, 
  });

  // Start New Conversation Logic
  if (initialHistory.length === 0) {
      // First run: Ask the initial questions
      const response1 = await chat.sendMessage({
        message: "I have 2 dogs in my house.",
      });
      console.log("Chat response 1:", response1.text);

      const response2 = await chat.sendMessage({
        message: "How many paws are in my house?",
      });
      console.log("Chat response 2:", response2.text);

  } else {
      // Subsequent run: Ask a new question based on the loaded history
      console.log("Continuing previous conversation...");

      const response3 = await chat.sendMessage({
        message: question,
      });
      console.log("Chat response 3 (using loaded history):", response3.text);
  }

  // Get the updated history and save it
  const currentHistory = await chat.getHistory();
  await saveHistory(currentHistory);
}

export default main;