// utils/apiService.ts
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000/api/chat/classify'; // Replace with your backend URL

// Function to classify message via the backend
export const classifyMessage = async (message: string) => {
  try {
    const response = await axios.post(
      BACKEND_URL,
      {
        message: message,
      }
    );
    return response.data.category; // Return the classification result
  } catch (error) {
    console.error("Error classifying message:", error);
    return "General Talk";  // Default label in case of error
  }
};
