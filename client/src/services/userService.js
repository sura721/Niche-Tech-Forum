import { axiosInstance } from "../utils/axiosInstance";
const USER_URL = '/users';

export const getUserProfile = async () => {
    try {
        const response = await axiosInstance.get(`${USER_URL}/profile`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUserProfile = async (profileData) => {
    try {
        const response = await axiosInstance.put(`${USER_URL}/profile`, profileData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Profile update failed.');
    }
};

export const getMyPosts = async () => {
    try {
        const response = await axiosInstance.get(`${USER_URL}/my-posts`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch your posts.');
    }
};

export const getUserPublicProfile = async (username) => {
    try {
        const response = await axiosInstance.get(`${USER_URL}/username/${username}`);
        return response.data;
    } catch (error) {
         throw new Error(error.response?.data?.message || 'Could not fetch user profile');
    }
};