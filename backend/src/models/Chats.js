import express from 'express'
import "dotenv/config"
import CookieParser from "cookie-parser"
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    attachments: [{
        type: String, // URLs to uploaded files
        url: String,
        fileType: String
    }],
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, { timestamps: true });

const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    messages: [messageSchema],
    lastMessage: {
        type: messageSchema,
        default: null
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    groupName: {
        type: String,
        trim: true,
        // Required only for group chats
        required: function() {
            return this.isGroupChat;
        }
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // Required only for group chats
        required: function() {
            return this.isGroupChat;
        }
    },
    unreadCount: {
        type: Map,
        of: Number,
        default: new Map()
    },
    status: {
        type: String,
        enum: ["active", "archived", "deleted"],
        default: "active"
    }
}, { timestamps: true });

// Indexes for better query performance
chatSchema.index({ participants: 1 });
chatSchema.index({ status: 1 });
chatSchema.index({ updatedAt: -1 });

// Method to mark messages as read
chatSchema.methods.markMessagesAsRead = async function(userId) {
    const unreadCount = this.unreadCount.get(userId.toString()) || 0;
    if (unreadCount > 0) {
        this.unreadCount.set(userId.toString(), 0);
        await this.save();
    }
};

// Method to increment unread count
chatSchema.methods.incrementUnreadCount = async function(excludeUserId) {
    this.participants.forEach(participantId => {
        if (participantId.toString() !== excludeUserId.toString()) {
            const currentCount = this.unreadCount.get(participantId.toString()) || 0;
            this.unreadCount.set(participantId.toString(), currentCount + 1);
        }
    });
    await this.save();
};

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
