import { create } from 'zustand';
import {
    createPost as apiCreatePost,
    getAllPosts as apiGetAllPosts,
    getPostsByCategory as apiGetPostsByCategory,
    getPostById as apiGetPostById,
    createReply as apiCreateReply,
    searchPosts as apiSearchPosts,
    updatePost as apiUpdatePost,
    deletePost as apiDeletePost,
    updateReply as apiUpdateReply,
    deleteReply as apiDeleteReply,
} from '../services/postService';
import {
    getMyPosts as apiGetMyPosts
} from '../services/userService';

const initialState = {
    posts: [],
    myPosts: [],
    recentPosts: [],
    currentPost: null,
    isLoadingList: false,
    isLoadingMyPosts: false,
    isLoadingSingle: false,
    isSubmittingReply: false,
    isUpdatingPost: false,
    isDeletingPost: false,
    isUpdatingReply: false,
    isDeletingReply: false,
    error: null,
    myPostsError: null,
    replyError: null,
    editDeleteError: null,
    replyEditDeleteError: null,
    searchQuery: '',
};

export const usePostStore = create((set, get) => ({
    ...initialState,

    fetchAllPosts: async () => {
        set({ isLoadingList: true, error: null, posts: [], myPostsError: null, editDeleteError: null, replyEditDeleteError: null });
        try {
            const postsData = await apiGetAllPosts();
            set({ posts: postsData, isLoadingList: false });
        } catch (error) {
            set({ error: error.message, isLoadingList: false, posts: [] });
        }
    },

    fetchPostsByCategory: async (categoryName) => {
        set({ isLoadingList: true, error: null, posts: [], myPostsError: null, editDeleteError: null, replyEditDeleteError: null });
        try {
            const postsData = await apiGetPostsByCategory(categoryName);
            set({ posts: postsData, isLoadingList: false });
        } catch (error) {
            set({ error: error.message, isLoadingList: false, posts: [] });
        }
    },

    fetchPostById: async (postId) => {
        set({ isLoadingSingle: true, error: null, currentPost: null, myPostsError: null, editDeleteError: null, replyEditDeleteError: null });
        try {
            const postData = await apiGetPostById(postId);
            set({ currentPost: postData, isLoadingSingle: false });
        } catch (error) {
            set({ error: error.message, isLoadingSingle: false, currentPost: null });
        }
    },

    createPost: async (postData) => {
        set({ isLoadingSingle: true, error: null, myPostsError: null, editDeleteError: null, replyEditDeleteError: null });
        try {
            const newPost = await apiCreatePost(postData);
            set((state) => ({ currentPost: newPost, isLoadingSingle: false, error: null }));
            get().fetchMyPosts();
            return newPost;
        } catch (error) {
            set({ error: error.message, isLoadingSingle: false });
            throw error;
        }
    },

    fetchMyPosts: async () => {
        set({ isLoadingMyPosts: true, myPostsError: null });
        try {
            const userPosts = await apiGetMyPosts();
            set({ myPosts: userPosts, isLoadingMyPosts: false });
        } catch (error) {
            set({ myPostsError: error.message, isLoadingMyPosts: false, myPosts: [] });
        }
    },

    updatePost: async (postId, postData) => {
        set({ isUpdatingPost: true, editDeleteError: null });
        try {
            const updatedPost = await apiUpdatePost(postId, postData);
            set((state) => ({
                currentPost: state.currentPost?._id === postId ? updatedPost : state.currentPost,
                posts: state.posts.map(p => p._id === postId ? updatedPost : p),
                myPosts: state.myPosts.map(p => p._id === postId ? updatedPost : p),
                isUpdatingPost: false,
            }));
            return updatedPost;
        } catch (error) {
             set({ editDeleteError: error.message, isUpdatingPost: false });
             throw error;
        }
    },

    deletePost: async (postId) => {
        set({ isDeletingPost: true, editDeleteError: null });
        try {
            await apiDeletePost(postId);
            set((state) => ({
                posts: state.posts.filter(p => p._id !== postId),
                myPosts: state.myPosts.filter(p => p._id !== postId),
                currentPost: state.currentPost?._id === postId ? null : state.currentPost,
                isDeletingPost: false,
            }));
            return true;
        } catch (error) {
             set({ editDeleteError: error.message, isDeletingPost: false });
             throw error;
        }
    },

    addReplyToPost: async (postId, replyData) => {
        const currentPostId = get().currentPost?._id;
        if (postId !== currentPostId) {}
        set({ isSubmittingReply: true, replyError: null });
        try {
            const newReply = await apiCreateReply(postId, replyData);
            set((state) => {
                if (state.currentPost && state.currentPost._id === postId) {
                    const existingReplies = state.currentPost.replies || [];
                    return { currentPost: { ...state.currentPost, replies: [...existingReplies, newReply] }, isSubmittingReply: false };
                }
                return { isSubmittingReply: false };
            });
            return newReply;
        } catch (error) {
            set({ replyError: error.message, isSubmittingReply: false });
            throw error;
        }
    },

    fetchRecentPosts: async (limit = 3) => {
        set({ isLoadingRecent: true, recentPostsError: null });
        try {
            const recentData = await apiGetAllPosts(limit);
            set({ recentPosts: recentData, isLoadingRecent: false });
        } catch (error) {
            set({ recentPostsError: error.message, isLoadingRecent: false, recentPosts: [] });
        }
   },

    updateReplyInPost: async (postId, replyId, replyData) => {
        set({ isUpdatingReply: true, replyEditDeleteError: null });
        try {
            const updatedReply = await apiUpdateReply(postId, replyId, replyData);
             set((state) => {
                if (state.currentPost && state.currentPost._id === postId) {
                    const updatedReplies = (state.currentPost.replies || []).map(r =>
                        r._id === replyId ? updatedReply : r
                    );
                    return { currentPost: { ...state.currentPost, replies: updatedReplies }, isUpdatingReply: false };
                }
                return { isUpdatingReply: false };
            });
            return updatedReply;
        } catch (error) {
             set({ replyEditDeleteError: error.message, isUpdatingReply: false });
             throw error;
        }
    },

    deleteReplyFromPost: async (postId, replyId) => {
         set({ isDeletingReply: true, replyEditDeleteError: null });
         try {
            await apiDeleteReply(postId, replyId);
             set((state) => {
                 if (state.currentPost && state.currentPost._id === postId) {
                    const updatedReplies = (state.currentPost.replies || []).filter(r => r._id !== replyId);
                    return { currentPost: { ...state.currentPost, replies: updatedReplies }, isDeletingReply: false };
                }
                 return { isDeletingReply: false };
             });
             return true;
         } catch (error) {
             set({ replyEditDeleteError: error.message, isDeletingReply: false });
             throw error;
         }
    },

    clearCurrentPost: () => set({ currentPost: null, error: null }),
    clearError: () => set({ error: null, myPostsError: null, replyError: null, editDeleteError: null, replyEditDeleteError: null }),
    clearReplyError: () => set({ replyError: null }),
    clearMyPostsError: () => set({ myPostsError: null }),
    clearEditDeleteError: () => set({ editDeleteError: null }),
    clearReplyEditDeleteError: () => set({ replyEditDeleteError: null }),

    searchPosts: async (query) => {
        const trimmedQuery = query.trim();
        set({ error: null, myPostsError: null, editDeleteError: null, replyEditDeleteError: null });
        if (!trimmedQuery) {
             set({ posts: [], searchQuery: '', isLoadingList: false }); return;
        }
        set({ isLoadingList: true, searchQuery: trimmedQuery, posts: [] });
        try {
            const searchResults = await apiSearchPosts(trimmedQuery);
            set({ posts: searchResults, isLoadingList: false });
        } catch (error) {
            set({ error: error.message, isLoadingList: false, posts: [] });
        }
    },
}));

export const selectAllPosts = (state) => state.posts;
export const selectCurrentPost = (state) => state.currentPost;
export const selectPostsLoadingList = (state) => state.isLoadingList;
export const selectPostsLoadingSingle = (state) => state.isLoadingSingle;
export const selectPostsError = (state) => state.error;
export const selectSubmittingReply = (state) => state.isSubmittingReply;
export const selectReplyError = (state) => state.replyError;
export const selectSearchQuery = (state) => state.searchQuery;
export const selectMyPosts = (state) => state.myPosts;
export const selectLoadingMyPosts = (state) => state.isLoadingMyPosts;
export const selectMyPostsError = (state) => state.myPostsError;
export const selectIsUpdatingPost = (state) => state.isUpdatingPost;
export const selectIsDeletingPost = (state) => state.isDeletingPost;
export const selectEditDeleteError = (state) => state.editDeleteError;
export const selectIsUpdatingReply = (state) => state.isUpdatingReply;
export const selectIsDeletingReply = (state) => state.isDeletingReply;
export const selectReplyEditDeleteError = (state) => state.replyEditDeleteError;
export const selectRecentPosts = (state) => state.recentPosts;
export const selectIsLoadingRecent = (state) => state.isLoadingRecent;
export const selectRecentPostsError = (state) => state.recentPostsError;