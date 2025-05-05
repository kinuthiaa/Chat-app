import {StreamChat} from 'stream-chat';
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.error("Stream API is broken somewhere Check the .env");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    if (!userData || !userData.id) {
        throw new Error("Invalid user data provided");
    }

    try {
        const response = await streamClient.upsertUsers([userData]);
        console.log("Stream API Response:", response);
        return response.users[userData.id];
    } catch (error) {
        console.error("Error creating/updating stream user:", error);
        throw error; // Re-throw the error to be caught by the caller
    }
};

export const generateStreamToken = (userId) => {
    try {
        const userIStr = userId.toString();
        return streamClient.createToken(userIStr);
    } catch (error) {
        console.error("Error in generating Stream Token Bro",error.message);
        res.status(500).json({message: "Whoa there cowboy!, I don't think you got the memo there where's your token?"})
    }
}