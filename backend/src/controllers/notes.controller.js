import Notes from "../models/Notes.js";

export const getNotebooks = async (req, res) => {
    try {
        const notebooks = await Notes.find({ user: req.user._id });
        res.status(200).json(notebooks);
    } catch (error) {
        console.error("Error getting notebooks:", error);
        res.status(500).json({ message: "Failed to fetch notebooks" });
    }
};

export const createNotebook = async (req, res) => {
    try {
        const { notebookName } = req.body;
        const notebook = await Notes.create({
            notebookName,
            user: req.user._id,
            notes: []
        });
        res.status(201).json(notebook);
    } catch (error) {
        console.error("Error creating notebook:", error);
        res.status(500).json({ message: "Failed to create notebook" });
    }
};

export const addNote = async (req, res) => {
    try {
        const { notebookId } = req.params;
        const { title, content = '' } = req.body;

        const notebook = await Notes.findById(notebookId);
        if (!notebook) {
            return res.status(404).json({ message: "Notebook not found" });
        }

        const newNote = {
            title,
            content: content || 'lorem ipsum dolor ci amet....',
            updatedAt: new Date()
        }

        notebook.notes.push({ title, content });
        await notebook.save();

        res.status(201).json(notebook);
    } catch (error) {
        console.error("Error adding note:", error);
        res.status(500).json({ message: "Failed to add note" });
    }
};

export const updateNote = async (req, res) => {
    try {
        const { notebookId, noteId } = req.params;
        const { title, content } = req.body;

        const notebook = await Notes.findOneAndUpdate(
            {
                _id: notebookId,
                "notes._id": noteId
            },
            {
                $set: {
                    "notes.$.title": title,
                    "notes.$.content": content,
                    "notes.$.updatedAt": Date.now()
                }
            },
            { new: true }
        );

        res.status(200).json(notebook);
    } catch (error) {
        console.error("Error updating note:", error);
        res.status(500).json({ message: "Failed to update note" });
    }
};

export const deleteNote = async (req, res) => {
    try {
        const { notebookId, noteId } = req.params;

        const notebook = await Notes.findByIdAndUpdate(
            notebookId,
            { $pull: { notes: { _id: noteId } } },
            { new: true }
        );

        res.status(200).json(notebook);
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ message: "Failed to delete note" });
    }
};