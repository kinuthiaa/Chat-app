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

export async function getNotebooks() {
    const response = await axiosInstance.get("/notes");
    return response.data;
}

export async function createNotebook(notebookName) {
    const response = await axiosInstance.post("/notes", { notebookName });
    return response.data;
}

export async function getNotes(notebookId) {
    try {
        console.log('Making API request to:', `/notes/${notebookId}/notes`);
        const response = await axiosInstance.get(`/notes/${notebookId}/notes`);
        console.log('Raw API response:', response);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error('API error:', error);
        throw error;
    }
}

export async function createNote(notebookId, noteData) {
    if (!notebookId) {
        throw new Error('Notebook ID is required');
    }

    try {
        const response = await axiosInstance.post(`/notes/${notebookId}/notes`, {
            title: noteData.title?.trim(),
            content: noteData.content || ''
        });
        return response.data;
    } catch (error) {
        console.error("Error creating note:", error);
        if (error.response?.status === 500) {
            console.error("Server Error Details:", error.response.data);
        }
        throw error;
    }
}

export async function updateNote(notebookId, noteId, noteData){
    const response = await axiosInstance.put(`/notes/${notebookId}/notes/${noteId}`, noteData);
    return response.data;
}

export async function deleteNote(notebookId, noteId){
    const response = await axiosInstance.delete(`/notes/${notebookId}/notes/${noteId}`);
    return response.data;
}