const { GoogleGenAI } = require("@google/genai");
const fs = require('fs').promises;
const path = require('path');

// Define the file path for the chat history
const HISTORY_FILE = path.join(process.cwd(), 'history.json');
const MODEL_NAME = "gemini-2.5-flash";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

/**
 * Loads the chat history from the JSON file.
 * Returns an array of Content objects or an empty array if the file doesn't exist.
 */
async function loadHistory() {
  try {
    const data = await fs.readFile(HISTORY_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    // Ensure it's an array and not empty string
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === 'ENOENT' || error.name === 'SyntaxError') {
      console.log("No existing history file found. Starting a new chat.");
      return [];
    }
    console.error("Error loading history:", error);
    return [];
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

async function cherry(requestData) {
  try {
    // Extract question from request data
    const question = requestData.question || requestData.message || '';
    
    if (!question) {
      return { error: "No question provided" };
    }

    console.log("Received question:", question);

    // Load previous history
    const initialHistory = await loadHistory();

    // Create the chat session with the loaded history
    const chat = ai.models.chat({
      model: MODEL_NAME,
      history: initialHistory,
    });

    // Send the user's message
    const response = await chat.sendMessage(question);
    
    // Get the response text
    const responseText = response.text;
    console.log("AI Response:", responseText);

    // Get the updated history and save it
    const currentHistory = chat.history || [];
    await saveHistory(currentHistory);

    return { message: responseText };
  } catch (error) {
    console.error("Error in chat:", error);
    return { error: error.message || "An error occurred" };
  }
}

module.exports = cherry;
