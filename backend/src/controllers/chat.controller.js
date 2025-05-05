import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
    try {
        const token = generateStreamToken(req.user.id);
        res.status(200).json({ token });
    } catch (error) {
        console.log("error getting Stream Token",  error.message);
        res.status(500).json({message: "Yeah we don't like the riff raffs talking to our members all bubbly around here"})
    }
}

export async function getChats(req, res) {
    try {
        const chats = await Chat.find({
            participants: req.user.id,
            status: "active"
        })
        .populate("participants", "fullName ProfilePic")
        .populate("lastMessage")
        .sort("-updatedAt");

        res.status(200).json(chats);
    } catch (error) {
        console.error("Error fetching chats:", error);
        res.status(500).json({ message: "Failed to fetch chats" });
    }
}

export async function removeChat(req, res) {
    try {
        const chatId = req.params.id;
        const userId = req.user.id;

        const chat = await Chat.findOne({
            _id: chatId,
            participants: userId
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // Soft delete - update status to deleted
        chat.status = "deleted";
        await chat.save();

        res.status(200).json({ message: "Chat removed successfully" });
    } catch (error) {
        console.error("Error removing chat:", error);
        res.status(500).json({ message: "Failed to remove chat" });
    }
}