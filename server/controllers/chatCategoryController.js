import ChatCategory from "../models/ChatCategory.js";
const GEMINI_API_URL = 'https://genai.googleapis.com/v1beta2/models/gemini-2.0-flash:generateContent';
const API_KEY = 'AIzaSyAU5kJKU_VrPu_Z5R2c7y0RL83jzI8l1SM';  // Replace with your actual API key

export const createChatCategory = async (req, res) => {
    try {
        const { userId, topic } = req.body;
        
        const chatCategory = new ChatCategory({ userId, topic });
        await chatCategory.save();
        
        // Send response with the category ID specifically highlighted
        res.status(201).json({
            success: true,
            chatId: chatCategory._id,
            category: chatCategory
        });
    } catch (error) {
        console.error("Error creating chat category:", error.message);
        res.status(500).json({ 
            success: false, 
            msg: "Failed to create chat category.", 
            error: error.message 
        });
    }
};
export const getChatCategoriesByUser = async (req, res) => {
    try {
        const chatCategories = await ChatCategory.find({ userId: req.params.userId });

        console.log(`Found ${chatCategories.length} chat categories for user: ${req.params.userId}`);
        res.status(200).json(chatCategories);
    } catch (error) {
        console.error("Error fetching chat categories:", error.message);
        res.status(500).json({ msg: "Failed to get chat categories.", error: error.message });
    }
};

export const deleteChatCategory = async (req, res) => {
    try {

        const chatCategory = await ChatCategory.findById(req.params.id);
        if (!chatCategory) {
            console.log(`Chat category not found: ${req.params.id}`);
            return res.status(404).json({ msg: "Chat category not found." });
        }

        await chatCategory.deleteOne();
        console.log(`Chat category deleted successfully: ${req.params.id}`);

        res.status(200).json({ msg: "Chat category deleted." });
    } catch (error) {
        console.error("Error deleting chat category:", error.message);
        res.status(500).json({ msg: "Failed to delete chat category.", error: error.message });
    }
};

export const updateChatCategory = async (req, res) => {
    try {
        const chatCategory = await ChatCategory.findById(req.params.id);
        if (!chatCategory) {
            console.log(`Chat category not found: ${req.params.id}`);
            return res.status(404).json({ msg: "Chat category not found." });
        }

        chatCategory.topic = req.body.topic;
        await chatCategory.save();

        console.log(`Chat category updated successfully: ${req.params.id}`);
        res.status(200).json(chatCategory);
    } catch (error) {
        console.error("Error updating chat category:", error.message);
        res.status(500).json({ msg: "Failed to update chat category.", error: error.message });
    }
};

export const classifyMessage = async (req, res) => {
    console.log('Classifying message:', req.body.message);
    const { message } = req.body;
  
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
  
    try {
      // Make a request to the Gemini API
      const response = await axios.post(
        GEMINI_API_URL,
        {
          model: 'gemini-2.0-flash',
          contents: `Classify the following message into one of the categories: Tech, Mental Health, General Talk, Knowledge, or any other related label. Message: "${message}"`,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Return the classified category
      const category = response.data.text.trim();
      res.json({ category });
    } catch (error) {
      console.error('Error classifying message:', error);
      res.status(500).json({ error: "Error classifying message" });
    }
  };
  
