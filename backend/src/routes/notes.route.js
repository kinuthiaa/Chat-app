import express from "express";
import { ProtectedRoute } from "../middleware/auth.middleware.js";
import {
    getNotebooks,
    createNotebook,
    addNote,
    updateNote,
    deleteNote
} from "../controllers/notes.controller.js";

const router = express.Router();

router.use(ProtectedRoute);

router.get("/", getNotebooks);
router.post("/", createNotebook);
router.post("/:notebookId/notes", addNote);
router.put("/:notebookId/notes/:noteId", updateNote);
router.delete("/:notebookId/notes/:noteId", deleteNote);

export default router;
