import ChatCategory from "../models/ChatCategory.js";

export const createChatCategory = async (req, res) => {
    try {
        const { userId, topic } = req.body;

        const chatCategory = new ChatCategory({ userId, topic });
        await chatCategory.save();

        res.status(201).json(chatCategory);
    } catch (error) {
        console.error("Error creating chat category:", error.message);
        res.status(500).json({ msg: "Failed to create chat category.", error: error.message });
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
