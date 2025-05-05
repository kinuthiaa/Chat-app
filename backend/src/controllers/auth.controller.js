import { response } from "express";
import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from 'jsonwebtoken';

export async function signup(req, res) {
    const { Email, Password, fullName } = req.body;

    try {
        if (!Email || !Password || !fullName) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (Password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        //email checks expressions
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(Email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existent = await User.findOne({ Email });
        if (existent) { return res.status(400).json({ message: "Just login mahn.....!!!!" }) }

        const idx = Math.floor(Math.random() * 100) + 1;

        const randAvatar = `https://avatar.iran.liara.run/public/${idx}.png`

        const newUser = await User.create({
            Email,
            Password,
            fullName,
            ProfilePic: randAvatar
        });

        //Stream API Setup starts here
        try {
            const streamUser = await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName, 
                image: newUser.ProfilePic || ""
            });
            
            if (streamUser) {
                console.log(`Stream User created successfully: ${newUser.fullName}`);
            } else {
                console.warn("Stream user creation returned no data");
            }
        } catch (error) {
            console.error("Error Creating Stream user:", error.message);
            // Optionally handle the error in your response
            return res.status(500).json({ message: "Error creating stream user" });
        }

        //Json web tokens generation
        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" }
        );

        res.cookie("jwt", token, { maxAge: 7 * 24 * 3600 * 1000, httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production" })

        res.status(201).json({ success: true, User: newUser });
    } catch (error) {
        console.log("Error in Signup COntroller", error);
        res.status(500).json({ message: "Hold on it's not you it's the server again, just let her cool off for a while" });
    }
}
export async function login(req, res) {
    try {
        const { Email, Password } = req.body;
        if (!Email || !Password) { return res.status(400).json({ message: "All Fields are required to Login" }); }

        const user = await User.findOne({ Email });
        if (!user) { return res.status(404).json({ message: "Something is missing here...." }); }
        const isPassCorrect = await user.matchPassword(Password);
        if (!isPassCorrect) return res.status(401).json({ message: "Sth must be missing can you check your password for any errors?" })

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" }
        );

        res.cookie("jwt", token, { maxAge: 7 * 24 * 3600 * 1000, httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production" })

        res.status(200).json({success: true, user});
    } catch (error) {
        console.log("Error in Login Controller", error);
        res.status(500).json({ message: "Well, server's acting like a weanie again, can't get it to work properly" });
    }
}
export async function logout(req, res) {
    res.clearCookie("jwt");
    res.status(200).json({success: true, message: "Bye bye see you soon!"})
}

export async function onboard(req, res){
    try {
        const userId = req.user._id;

        const {fullName, Bio, NativeLanguage, LearningLanguage, Location } = req.body;

        if(!fullName || !Bio || !NativeLanguage || !LearningLanguage || !Location){ 
            return res.status(400).json(
                {
                    message: "I know you're ugly but take heart God could have done much worse", 
                    missingFiedls:[
                        !fullName && "fullName",
                        !Bio && "Bio",
                        !NativeLanguage && "NativeLanguage",
                        !LearningLanguage && "LearningLanguage",
                        !Location && "Location",
                    ].filter(Boolean),
                }
            );
        }
        const updatedUser =  await User.findByIdAndUpdate(userId, {...req.body, isOnboarded: true,}, {new:true}).select("-Password");

        if(!updatedUser) return res.status(404).json({message: "Well who the fuck are you mate?"});

        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                Image: updatedUser.ProfilePic || "",
            });
            console.log(`Welcome aboard.. ${updatedUser.fullName}` );
        } catch (stremError) {
            console.log("Sorry mate change takes time but now is not your time", stremError.message);
        }


        res.status(200).json({success: true, user:updatedUser, message: "Looking Good...." })
    } catch (error) {
        console.error("Error trying to sweep your details under the rug mate!", error);
        res.status(500).json({message:"They didn't forget who you are!!"});
    }
}