import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/posts" element={<PostsPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/signup" element={<SignupPage />} />
                                <Route path="/posts/:postId" element={<PostDetailPage />} />
                                <Route path="/search" element={<SearchPage />} />
                                <Route path="/category/:categoryName" element={<CategoryPostsPage />} />

                                <Route path="/profile" element={
                                    <ProtectedRoute>
                                        <ProfilePage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/posts/new" element={
                                    <ProtectedRoute>
                                        <CreatePostPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/posts/:postId/edit" element={
                                    <ProtectedRoute>
                                        <EditPostPage />
                                    </ProtectedRoute>
                                } />
                            </Routes>
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