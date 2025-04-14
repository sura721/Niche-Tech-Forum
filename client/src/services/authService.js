import { axiosInstance } from "../utils/axiosInstance"; 

const AUTH_URL = '/auth'; 

export const loginUser = async (credentials) => {
    try {
        const response = await axiosInstance.post(`${AUTH_URL}/login`, credentials);
        return response.data; 
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed. Please check credentials.');
    }
};

export const registerUser = async (userData) => {
    try {

        const response = await axiosInstance.post(`${AUTH_URL}/register`, userData);
        return response.data; 
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
};


export const logoutUser = async () => {
    try {
        const response = await axiosInstance.post(`${AUTH_URL}/logout`);
        return response.data;
    } catch (error) {

        throw new Error(error.response?.data?.message || 'Logout failed.');
    }
};


export const getLoggedInUserProfile = async () => {
    try {
      
        const response = await axiosInstance.get(`users/profile`);
        return response.data;
    } catch (error) {
        throw error;
    }
};