import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePostStore, selectAllPosts, selectPostsLoadingList, selectPostsError } from '../store/postStore';
import PostList from '../components/PostList';

const VALID_CATEGORIES = ['javascript', 'react', 'node.js', 'next.js'];

const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

function CategoryPostsPage() {
    const { categoryName } = useParams();

    const posts = usePostStore(selectAllPosts);
    const isLoading = usePostStore(selectPostsLoadingList);
    const error = usePostStore(selectPostsError);
    const fetchPostsByCategory = usePostStore((state) => state.fetchPostsByCategory);

    const isValidCategory = categoryName && VALID_CATEGORIES.includes(categoryName.toLowerCase());
    const displayCategoryName = isValidCategory ? capitalize(categoryName.replace('-', ' ')) : categoryName;

    useEffect(() => {
        if (isValidCategory) {
            const backendCategoryName = VALID_CATEGORIES.find(cat => cat.toLowerCase() === categoryName.toLowerCase());
            let apiCategoryName = backendCategoryName;
            if (apiCategoryName === 'node.js') apiCategoryName = 'Node.js';
            if (apiCategoryName === 'next.js') apiCategoryName = 'Next.js';
            if (apiCategoryName === 'javascript') apiCategoryName = 'JavaScript';
            if (apiCategoryName === 'react') apiCategoryName = 'React';

            fetchPostsByCategory(apiCategoryName || categoryName);
        } else {
            usePostStore.setState({ posts: [], isLoadingList: false, error: `Invalid category: ${categoryName}` });
        }

        return () => {
            usePostStore.setState({ posts: [], error: null });
        };
    }, [categoryName, fetchPostsByCategory, isValidCategory]);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-gray-800/50 rounded-xl p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                    Posts in Category: <span className="text-white">{displayCategoryName}</span>
                </h1>

                {isLoading && (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                )}

                {!isLoading && error && (
                    <div className="bg-red-900/50 border border-red-700 p-4 rounded-lg text-center">
                        <p className="text-red-300 mb-2">Error loading posts for this category:</p>
                        <p className="text-red-400 font-medium">{error}</p>
                        <Link 
                            to="/" 
                            className="mt-4 inline-block text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                            Go back home
                        </Link>
                    </div>
                )}

                {!isLoading && !error && !isValidCategory && (
                    <div className="bg-orange-900/50 border border-orange-700 p-4 rounded-lg text-center">
                        <p className="text-orange-300">Sorry, the category "{categoryName}" is not valid.</p>
                        <Link 
                            to="/" 
                            className="mt-4 inline-block text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                            See all posts
                        </Link>
                    </div>
                )}

                {!isLoading && !error && isValidCategory && posts.length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                        No posts found in the "{displayCategoryName}" category yet.
                    </div>
                )}

                {!isLoading && !error && isValidCategory && posts.length > 0 && (
                    <div className="space-y-4">
                        <PostList posts={posts} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default CategoryPostsPage;