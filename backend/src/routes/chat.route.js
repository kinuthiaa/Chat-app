import express from "express";
import { ProtectedRoute } from "../middleware/auth.middleware.js";
import { getStreamToken, removeChat } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/token", ProtectedRoute, getStreamToken);
router.delete("/:id", ProtectedRoute, removeChat);

export default router;