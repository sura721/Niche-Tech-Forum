import { axiosInstance } from "../utils/axiosInstance";
const POSTS_URL = '/posts';

export const createPost = async (postData) => {
    try {
        const response = await axiosInstance.post(POSTS_URL, postData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create post.');
    }
};

export const getAllPosts = async (limit = 0) => {
    try {
        const params = new URLSearchParams();
        if (limit > 0) {
            params.append('limit', limit);
        }
        const response = await axiosInstance.get(`${POSTS_URL}?${params.toString()}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch posts.');
    }
};

export const getPostsByCategory = async (categoryName) => {
    try {
        const response = await axiosInstance.get(`${POSTS_URL}/category/${encodeURIComponent(categoryName)}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || `Failed to fetch posts for category ${categoryName}.`);
    }
};

export const getPostById = async (postId) => {
    try {
        const response = await axiosInstance.get(`${POSTS_URL}/${postId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch post details.');
    }
};

export const createReply = async (postId, replyData) => {
    try {
        const response = await axiosInstance.post(`${POSTS_URL}/${postId}/replies`, replyData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to submit reply.');
    }
};

export const searchPosts = async (query) => {
    try {
        const params = new URLSearchParams({ q: query });
        const response = await axiosInstance.get(`${POSTS_URL}/search?${params.toString()}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to search posts.');
    }
};

export const updatePost = async (postId, postData) => {
    try {
        const response = await axiosInstance.put(`${POSTS_URL}/${postId}`, postData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update post.');
    }
};

export const deletePost = async (postId) => {
    try {
        const response = await axiosInstance.delete(`${POSTS_URL}/${postId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete post.');
    }
};

export const updateReply = async (postId, replyId, replyData) => {
    try {
        const response = await axiosInstance.put(`${POSTS_URL}/${postId}/replies/${replyId}`, replyData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update reply.');
    }
};

export const deleteReply = async (postId, replyId) => {
    try {
        const response = await axiosInstance.delete(`${POSTS_URL}/${postId}/replies/${replyId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete reply.');
    }
};
