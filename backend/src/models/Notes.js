import mongoose from 'mongoose'

const NotesSchema = new mongoose.Schema({
    notebookName: {
        type: String,
        required: true
    },
    notes: [{
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            default: '',
            required: false
        },
        attachments: [{
            url: String,
            fileType: String,
            name: String
        }],
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const Notes = mongoose.model("Notes", NotesSchema);
export default Notes;