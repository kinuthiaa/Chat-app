import mongoose from "mongoose";

const callSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    recipient:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["missed", "answered", "declined"],
        default: "missed"
    },
    duration:{
        type: Number,
        default: 0
    },
    type:{
        type: String,
        enum: ["audio", "video"],
        default: "audio",
        required: true
    },
    startedAt: {
        type: Date,
        default: Date.now,
    }
}, {timestamps: true});

const Call = mongoose.model("Call", callSchema);

export default Call;