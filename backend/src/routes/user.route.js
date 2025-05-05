import express from "express";
import { ProtectedRoute } from "../middleware/auth.middleware.js";
import { getRecommendedUsers, getChats , rejectFriendRequest, getFriendRequests, getMyFriends, getCalls, acceptFriendRequest, sendFriendRequest, getOutgoingFriendRequests } from "../controllers/user.controller.js";


const router = express.Router();

router.use(ProtectedRoute);

router.get("/",  getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getFriendRequests);
router.post("/reject-friend-request/:id", rejectFriendRequest);
router.get("/outgoing-friend-requests", getOutgoingFriendRequests);

router.get("/calls", ProtectedRoute,  getCalls);
router.get("/allchats", ProtectedRoute, getChats);

export default router
