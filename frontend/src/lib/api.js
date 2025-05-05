import { axiosInstance } from "./axios"

export const signup = async (signupData) => {
    const response  = await axiosInstance.post("/auth/signup", signupData);
    return response.data
}

export const login = async (loginData) => {
    const response  = await axiosInstance.post("/auth/login", loginData);
    return response.data
}

export const logout = async () => {
    const response  = await axiosInstance.post("/auth/logout");
    return response.data
}

export const getAuthUser = async () => {
    try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
    } catch (error) {
        if (error.response?.status === 401){
            return null;
        }
        console.error("Error fetching auth user:", error);
        throw error;
    }
}

export const completeOnboarding = async (userData) => {
    const response = await axiosInstance.post("/auth/onboarding", userData);
    return response.data;
}

export async function getUserFriends(){
    const response = await axiosInstance.get("/users/friends");
    return response.data;
}
export async function getRecommendedUsers(){
    try {
        const response = await axiosInstance.get("/users");
        return response.data; 
    } catch (error) {
        console.error("Error fetching recommended users:", error);
        throw(error);
    }
}
export async function getOutgoingFriendReqs(){
    const response = await axiosInstance.get("/users/outgoing-friend-requests");
    return response.data;
}
export async function sendFriendRequest(userId){
    const response = await axiosInstance.post(`/users/friend-request/${userId}`);
    return response.data;
}

export async function getFriendRequests(){
    const response = await axiosInstance.get("/users/friend-requests");
    return response.data;
}

export async function getCalls(){
    const response = await axiosInstance.get("/users/calls");
    return response.data;
}

export async function getAllChats(){
    const response = await axiosInstance.get("/users/allchats");
    return response.data;
}

export async function acceptFriendRequest({ friendId }) {
    try {
        const response = await axiosInstance.put(`/users/friend-request/${friendId}/accept`);
        return response.data;
    } catch (error) {
        console.error("Error in acceptFriendRequest:", error);
        throw error;
    }
}

export async function rejectFriendRequest(userId){
    const response = await axiosInstance.post(`/users/reject-friend-request/${userId}`);
    return response.data;
}

export async function removeFriend(userId){
    const response = await axiosInstance.post(`/users/remove-friend/${userId}`);
    return response.data;
}

export async function getStreamToken(){
    const response = await axiosInstance.get("/chat/token");
    return response.data;
}

export async function removeChat(chatId) {
    try {
        const response = await axiosInstance.delete(`/chat/${chatId}`);
        return response.data;
    } catch (error) {
        console.error("Error removing chat:", error);
        throw error;
    }
}
export async function removeCall(callId) {
    try {
        const response = await axiosInstance.delete(`/chat/${callId}`);
        return response.data;
    } catch (error) {
        console.error("Error removing call:", error);
        throw error;
    }
}