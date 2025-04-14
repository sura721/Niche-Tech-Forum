import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostStore, selectPostsLoadingSingle, selectPostsError } from '../store/postStore';

const ALLOWED_CATEGORIES = ['JavaScript', 'React', 'Node.js', 'Next.js'];

function CreatePostPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const navigate = useNavigate();
    const createPost = usePostStore((state) => state.createPost);
    const isLoading = usePostStore(selectPostsLoadingSingle);
    const error = usePostStore(selectPostsError);
    const clearError = usePostStore((state) => state.clearError);

    useEffect(() => {
        return () => {
            clearError();
        };
    }, [clearError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();
        if (!title.trim() || !content.trim() || !category) {
            alert('Please fill in title, content, and select a category.');
            return;
        }

        try {
            const postData = { title, content, category };
            const newPost = await createPost(postData);
            if (newPost && newPost._id) {
                navigate(`/posts/${newPost._id}`);
            } else {
                alert("Post created successfully, but couldn't redirect automatically. Please navigate to the homepage or profile to find your post.");
            }
        } catch (err) {
     
        }
    };

    return (
  
        <div className="max-w-3xl mx-auto mt-8 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                Create New Post
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-3 bg-red-900/40 text-red-300 text-sm text-center rounded-md">
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
                        className="w-full p-3 bg-gray-700/80 border border-gray-600/70 rounded-md focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-500 focus:bg-gray-700 outline-none text-gray-200 placeholder-gray-500 transition-colors duration-200"
                        placeholder="Enter a clear and concise title"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">{title.length} / 150</p>
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
                        className="w-full p-3 bg-gray-700/80 border border-gray-600/70 rounded-md focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-500 focus:bg-gray-700 outline-none text-gray-200 transition-colors duration-200 appearance-none bg-no-repeat bg-right-3"
                        style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="text-gray-400 w-5 h-5"><path fill-rule="evenodd" d="M10 12.586l-4.293-4.293a1 1 0 011.414-1.414L10 9.758l3.879-3.879a1 1 0 111.414 1.414L10 12.586z" clip-rule="evenodd"/></svg>')`, backgroundSize: '1.25rem' }}
                    >
                        <option value="" disabled className="text-gray-500">Select a Category </option>
                        {ALLOWED_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat} className="text-gray-200 bg-gray-700">
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
                        rows="12"
                        className="w-full p-1.5 bg-gray-700/80 border border-gray-600/70 rounded-md focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-500 focus:bg-gray-700 outline-none text-gray-200 placeholder-gray-500 resize-y transition-colors duration-200"
                        placeholder="Write your post content here. Markdown is supported for basic formatting..."
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Post...
                            </span>
                        ) : 'Publish Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreatePostPage;