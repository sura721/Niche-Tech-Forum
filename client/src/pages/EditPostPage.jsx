import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    usePostStore,
    selectCurrentPost,
    selectPostsLoadingSingle,
    selectEditDeleteError,
    selectIsUpdatingPost
} from '../store/postStore';
import { useAuthStore, selectUserInfo } from '../store/authStore.store';

const ALLOWED_CATEGORIES = ['JavaScript', 'React', 'Node.js', 'Next.js'];

function EditPostPage() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const fetchPostById = usePostStore((state) => state.fetchPostById);
    const updatePostAction = usePostStore((state) => state.updatePost);
    const postToEdit = usePostStore(selectCurrentPost);
    const isLoadingFetch = usePostStore(selectPostsLoadingSingle);
    const isUpdating = usePostStore(selectIsUpdatingPost);
    const error = usePostStore(selectEditDeleteError);
    const clearEditDeleteError = usePostStore((state) => state.clearEditDeleteError);
    const userInfo = useAuthStore(selectUserInfo);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [fetchError, setFetchError] = useState('');

    useEffect(() => {
        clearEditDeleteError();
        setFetchError('');
        if (postId) {
            fetchPostById(postId).catch(err => {
                setFetchError(err.message || 'Failed to load post data for editing.');
            });
        }
        return () => {
            clearEditDeleteError();
        };
    }, [postId, fetchPostById, clearEditDeleteError]);

    useEffect(() => {
        if (postToEdit && postToEdit._id === postId) {
            if (userInfo && postToEdit.user?._id === userInfo._id) {
                setTitle(postToEdit.title);
                setContent(postToEdit.content);
                setCategory(postToEdit.category);
            } else if (userInfo && postToEdit.user?._id !== userInfo._id) {
                setFetchError('You are not authorized to edit this post.');
            }
        }
    }, [postToEdit, postId, userInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearEditDeleteError();
        if (!title.trim() || !content.trim() || !category) {
            alert('Please fill in title, content, and select a category.');
            return;
        }
        if (!userInfo || !postToEdit || postToEdit.user?._id !== userInfo._id) {
            alert('Authorization error. Cannot update post.');
            return;
        }
        try {
            const postData = { title, content, category };
            const updatedPost = await updatePostAction(postId, postData);
            if (updatedPost && updatedPost._id === postId) {
                navigate(`/posts/${postId}`);
            } else {
                alert("Post might have been updated, but couldn't redirect automatically.");
            }
        } catch (err) {}
    };

    if (isLoadingFetch && !postToEdit && !fetchError) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-800 border border-gray-700 rounded-xl text-center">
                <p className="text-red-400 mb-4">{fetchError}</p>
                <Link 
                    to={postToEdit ? `/posts/${postId}` : '/'} 
                    className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-300"
                >
                    Go Back
                </Link>
            </div>
        );
    }

    if (postToEdit && (!userInfo || postToEdit.user?._id !== userInfo._id)) {
        return (
            <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-800 border border-gray-700 rounded-xl text-center">
                <p className="text-red-400 mb-4">You are not authorized to edit this post.</p>
                <Link 
                    to={`/posts/${postId}`} 
                    className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-300"
                >
                    View Post
                </Link>
            </div>
        );
    }

    if (!postToEdit && !fetchError && !isLoadingFetch) {
        return (
            <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-800 border border-gray-700 rounded-xl text-center text-gray-400">
                Could not load post data.
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                Edit Post
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-center">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-300">
                        Post Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        maxLength="150"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-200 transition-all duration-300"
                    />
                </div>

                <div>
                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-300">
                        Category
                    </label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-200 transition-all duration-300"
                    >
                        <option value="" disabled className="text-gray-500">-- Select a Category --</option>
                        {ALLOWED_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat} className="text-gray-200">
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-300">
                        Content
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows="10"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-200 resize-y transition-all duration-300"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <Link
                        to={`/posts/${postId}`}
                        className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold rounded-lg shadow transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isUpdating}
                        className="py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUpdating ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </span>
                        ) : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditPostPage;