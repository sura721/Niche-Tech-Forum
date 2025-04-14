import { create } from 'zustand';
import {
    loginUser as apiLoginUser,
    registerUser as apiRegisterUser,
    logoutUser as apiLogoutUser,
    getLoggedInUserProfile as apiGetLoggedInUserProfile,
} from '../services/authService'; 

const initialState = {
    userInfo: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isAuthChecked: false,
};

export const useAuthStore = create((set, get) => ({
    ...initialState,

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const userData = await apiLoginUser(credentials);
            set({
                userInfo: userData,
                isAuthenticated: true,
                isLoading: false,
                error: null,
                isAuthChecked: true,
            });
            return userData; 
        } catch (error) {
            set({
                userInfo: null,
                isAuthenticated: false,
                isLoading: false,
                error: error.message, 
                isAuthChecked: true,
            });
            throw error; 
        }
    },

    register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const newUser = await apiRegisterUser(userData);
            set({
                userInfo: newUser,
                isAuthenticated: true,
                isLoading: false,
                error: null,
                isAuthChecked: true, 
            });
            return newUser;
        } catch (error) {
            set({
                userInfo: null,
                isAuthenticated: false,
                isLoading: false,
                error: error.message, 
                isAuthChecked: true, 
            });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await apiLogoutUser(); 
            set({
                ...initialState, 
                isLoading: false,
                isAuthChecked: true, 
            });
        } catch (error) {
            set({
                ...initialState,
                isLoading: false,
                error: "Logout failed on server, but you are logged out locally.", 
                isAuthChecked: true, 
            });
        }
    },

    checkAuthStatus: async () => {
        if (get().isAuthChecked || get().isLoading) {
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const userData = await apiGetLoggedInUserProfile();
            set({
                userInfo: userData,
                isAuthenticated: true,
                isLoading: false,
                error: null,
                isAuthChecked: true,
            });
        } catch (error) {
            let errorMessage = null;
            if (error.response?.status !== 401) {
                errorMessage = "Error checking session."; 
            }
            set({
                userInfo: null,
                isAuthenticated: false,
                isLoading: false,
                error: errorMessage,
                isAuthChecked: true, 
            });
        }
    },

    clearError: () => {
        set({ error: null });
    },

    updateUserInfo: (updatedUserData) => {
        set((state) => {
            const currentUserInfo = state.userInfo || {};
            return {
                userInfo: {
                    ...currentUserInfo, 
                    ...updatedUserData, 
                },
                error: null,
            };
        });
    },

    resetAuthStore: () => {
        set({ ...initialState });
    }
}));

export const selectIsAuthenticated = (state) => state.isAuthenticated;
export const selectUserInfo = (state) => state.userInfo;
export const selectAuthLoading = (state) => state.isLoading;
export const selectAuthError = (state) => state.error;
export const selectIsAuthChecked = (state) => state.isAuthChecked;
