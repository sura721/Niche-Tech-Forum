import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { usePostStore, selectAllPosts, selectPostsLoadingList, selectPostsError } from '../store/postStore';
import PostList from '../components/PostList';

function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const searchResults = usePostStore(selectAllPosts);
    const isLoading = usePostStore(selectPostsLoadingList);
    const error = usePostStore(selectPostsError);
    const searchPostsAction = usePostStore((state) => state.searchPosts);
    const clearError = usePostStore((state) => state.clearError);
    const clearPosts = usePostStore((state) => state.clearPosts);

    useEffect(() => {
        if (query) {
            searchPostsAction(query);
        } else {
            clearPosts();
        }
        return () => {
            clearError();
        };
    }, [query, searchPostsAction, clearError, clearPosts]);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                {query ? (
                    <>
                        <span className="text-gray-400 mr-2">Results for:</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 break-all">
                            "{query}"
                        </span>
                    </>
                ) : (
                    <span className="text-gray-400">Search Posts</span>
                )}
            </h1>

            {isLoading && query && (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            )}

            {!isLoading && error && query && (
                <div className="max-w-2xl mx-auto mt-8 p-6 bg-red-900/50 border border-red-700/50 rounded-lg text-center">
                    <p className="text-red-300 mb-2">Error searching posts:</p>
                    <p className="font-medium text-gray-300 mb-4">{error}</p>
                    <Link
                        to="/"
                        className="inline-block text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-300"
                    >
                        Go back home
                    </Link>
                </div>
            )}

            {!isLoading && !error && searchResults.length === 0 && query && (
                <div className="text-center py-16 text-gray-500">
                    <p className="text-lg mb-2">No posts found matching</p>
                    <p className="text-xl font-semibold text-indigo-400 break-all">"{query}"</p>
                </div>
            )}

            {!isLoading && !error && searchResults.length > 0 && query && (
                <PostList posts={searchResults} />
            )}

            {!query && !isLoading && !error && (
                <div className="text-center py-16 text-gray-500">
                    <p className="text-lg">Please enter a search term in the navigation bar above.</p>
                </div>
            )}
        </div>
    );
}

export default SearchPage;
