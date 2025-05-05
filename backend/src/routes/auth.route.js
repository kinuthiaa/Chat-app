import express from 'express'
import { ProtectedRoute } from '../middleware/auth.middleware.js';
import { login, logout, onboard, signup } from '../controllers/auth.controller.js'

const router = express.Router()

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/onboarding", ProtectedRoute, onboard);

router.get("/me", ProtectedRoute, (req,res) =>{
    res.status(200).json({success: true, user: req.user});
});

export default router;