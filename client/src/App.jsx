import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import SearchPage from './pages/SearchPage';
import CategoryPostsPage from './pages/CategoryPostsPage';
import EditPostPage from './pages/EditPostPage';
import PostsPage from './pages/PostsPage';

import { useAuthStore, selectIsAuthChecked } from './store/authStore.store';
import { AnimatePresence, motion } from 'framer-motion';

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
                <Route path="/posts" element={<PageWrapper><PostsPage /></PageWrapper>} />
                <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
                <Route path="/signup" element={<PageWrapper><SignupPage /></PageWrapper>} />
                <Route path="/posts/:postId" element={<PageWrapper><PostDetailPage /></PageWrapper>} />
                <Route path="/search" element={<PageWrapper><SearchPage /></PageWrapper>} />
                <Route path="/category/:categoryName" element={<PageWrapper><CategoryPostsPage /></PageWrapper>} />

                <Route path="/profile" element={
                    <ProtectedRoute>
                        <PageWrapper><ProfilePage /></PageWrapper>
                    </ProtectedRoute>
                } />
                <Route path="/posts/new" element={
                    <ProtectedRoute>
                        <PageWrapper><CreatePostPage /></PageWrapper>
                    </ProtectedRoute>
                } />
                <Route path="/posts/:postId/edit" element={
                    <ProtectedRoute>
                        <PageWrapper><EditPostPage /></PageWrapper>
                    </ProtectedRoute>
                } />
            </Routes>
        </AnimatePresence>
    );
}

const PageWrapper = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            {children}
        </motion.div>
    );
};

function App() {
    const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);
    const isAuthChecked = useAuthStore(selectIsAuthChecked);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    if (!isAuthChecked) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-900">
                <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                    <span className="text-gray-300">Loading application...</span>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <div className="min-h-screen bg-gray-900 flex flex-col">
                <Navbar />
                <main className="flex-grow">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                        <div className="bg-gray-800/50 rounded-xl shadow-xl border border-gray-700 min-h-[calc(100vh-180px)]">
                            <AnimatedRoutes />
                        </div>
                    </div>
                </main>
                <footer className="bg-gray-800 border-t border-gray-700 py-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
                        <p>© {new Date().getFullYear()} JS Forum - All rights reserved by dev sura</p>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;