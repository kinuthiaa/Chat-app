import { json } from "express";
import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recommendedUsers = await User.find(
            {
                $and: [
                    { _id: { $ne: currentUserId } },
                    { _id: { $nin: currentUser.friends } },
                    { isOnboarded: true }
                ]
            }
        );
        res.status(200).json({ recommendedUsers });
    } catch (error) {
        console.error("Error in getRecommendedUsers controller", error.message);
        res.status(500).json({ message: "Sorry mate you're as lonely as Diddy after his jail sentence!" });
    }
}

export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id).select("friends").populate("friends", "fullName ProfilePic NativeLanguage LearningLanguage");
        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getFriends Controller", error.message);
        res.status(500).json({ message: "Sorry buddy, looks like you're the weird kid lonely kid at lunch today" });
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user.id;
        const { id: recipientId } = req.params;

        if (myId === recipientId) { return res.status(400).json({ message: "You can't befriend yourself when you're your own worst enemy!" }); }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: "I don't think we can find your imaginary friends here trust me I tried too" })
        }

        if (recipient.friends.includes(myId)) { return res.status(400), json({ message: "This ain't tinder buddy you can't match twice in one day!" }) }

        const existingRequest = await FriendRequest.findOne({
            $or: [

                { sender: myId, recipient: recipientId },
                { sender: recipientId, receiver: myId }

            ],
        });
        if(existingRequest){return res.status(400).json({message: "You're already friends mate and most likely you'll be stuck there"})}
        const newFriendRequest = await FriendRequest.create({
            sender: myId, recipient: recipientId,
        });

        res.status(201).json(newFriendRequest);
    } catch (error) {
        console.error("Error in getRecommendedUsers controller", error.message);
        res.status(500).json({ message: "Probably the world doesn't know you exist or worse that some of you have survived this long" });
    }
}

export async function acceptFriendRequest(req, res){
    try {
        const {id:requestId} = req.params;
        const friendRequest = await FriendRequest.findById(requestId);

        if(!friendRequest) return res.status(404).json({message: "Friend request not found"});

        

        if(friendRequest.recipient.toString() !== req.user.id){return res.status(403).json({message: "You're not authorized to accept this request"});}

        friendRequest.status = "accepted";
        await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: {friends: friendRequest.recipient},
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: {friends: friendRequest.sender},
        });

        res.status(200).json({message: "Great you're now friends"});
    } catch (error) {
        console.error("Error in acceptFriendRequest", error.message);
        res.status(500).json({message: "Sorry mate maybe that's not your type"});
    }
}

export async function getFriendRequests(req, res) {
    try {
        const incomingReqs = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending",
        }).populate("sender", "fullName ProfilePic NativeLanguage LearningLanguage");

        const acceptedReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted",
        }).populate("recipient", "fullName ProfilePic");

        res.status(200).json({incomingReqs, acceptedReqs});
    } catch (error) {
        console.log("Error in getPendingFriendRequests controller", error.message);
        res.status(500).json({message: "The Server wants you to remain alone"});
    }
}

export async function getOutgoingFriendRequests(req, res) {
    try {
        const outgoingreqs = await FriendRequest.find({
            sender: req.user.id,
            status: "pending",
        }).populate("recipient", "fullName ProfilePic NativeLanguage LearningLanguage");
        res.status(200).json(outgoingreqs);
    } catch (error) {
        console.log("Error in the Outgoing friend request", error.message);
        res.status(500).json({message: "Maybe you were meant to be the lonely cat lady, ever thought of that?"});
    }
}

export async function rejectFriendRequest(req, res) {
    try {
        const { id: requestId } = req.params;
        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) return res.status(404).json({ message: "Friend request not found" });

        if (friendRequest.recipient.toString() !== req.user.id) { return res.status(403).json({ message: "You're not authorized to reject this request" }); }

        await FriendRequest.findByIdAndDelete(requestId);

        res.status(200).json({ message: "Friend request rejected" });
    } catch (error) {
        console.error("Error in rejectFriendRequest", error.message);
        res.status(500).json({ message: "Sorry mate maybe that's not your type" });
    }
}


export async function getCalls(req, res){
    try {
        res.status(200).json([]);
       /*  const calls =  await Call.Find({
            $or: [
                { sender: req.user.id},
                { recipient: req.user.id },
            ]
        }).populate("sender recipient", "fullName ProfilePic");
        res.status(200).json(calls); */
    } catch (error) {
        console.error("Error fetching calls", error.message);
        res.status(500).json({message: "Sorry mate maybe that's not your type"});
    }
}

export async function getChats(req, res){
    try {
        res.status(200).json([]);
       /*  const chats =  await Chat.Find({
            $or: [
                { sender: req.user.id},
                { recipient: req.user.id },
            ]
        }).populate("sender recipient", "fullName ProfilePic");
        res.status(200).json(chats); */
    } catch (error) {
        console.error("Error fetching chats", error.message);
        res.status(500).json({message: "Sorry mate maybe that's not your type"});
    }
}