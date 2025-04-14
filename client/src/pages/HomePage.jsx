import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated } from '../store/authStore.store';
import { usePostStore, selectRecentPosts, selectIsLoadingRecent, selectRecentPostsError } from '../store/postStore';
import PostItem from '../components/PostItem';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

function HomePage() {
    const isAuthenticated = useAuthStore(selectIsAuthenticated);

    const recentPosts = usePostStore(selectRecentPosts);
    const isLoadingRecent = usePostStore(selectIsLoadingRecent);
    const recentError = usePostStore(selectRecentPostsError);
    const fetchRecentPosts = usePostStore((state) => state.fetchRecentPosts);

    useEffect(() => {
        fetchRecentPosts(3);
    }, [fetchRecentPosts]);

    const heroButtonBase = "inline-flex items-center px-6 py-3 rounded-lg text-base font-semibold shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl";
    const primaryButton = `${heroButtonBase} bg-indigo-600 text-white hover:bg-indigo-500`;
    const secondaryButton = `${heroButtonBase} bg-gray-700/50 text-indigo-400 border border-indigo-500/50 hover:bg-gray-700 hover:text-indigo-300 hover:border-indigo-400`;
    return (
        <div className="text-gray-100">
         
            <section className="relative text-center py-24 md:py-32 px-4 bg-gradient-to-br from-gray-800 via-gray-900 to-black mb-16 overflow-hidden">
                <div className="absolute inset-0 opacity-10"> 
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>
                </div>
                <div className="relative max-w-4xl mx-auto animate-fade-in-down">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-6 leading-tight">
                        Welcome to the JS Forum!
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto animate-fade-in delay-100">
                        Your dedicated space for JavaScript, React, Node.js, and Next.js discussions. Ask questions, share insights, and connect with fellow developers.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in-up delay-200">
                        <Link to="/posts" className={primaryButton}>
                            View All Posts <ArrowRightIcon className="h-5 w-5 inline ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                        {isAuthenticated ? (
                            <Link to="/posts/new" className={secondaryButton}>
                                Create a Post
                            </Link>
                        ) : (
                            <Link to="/login" className={secondaryButton}>
                                Login / Sign Up
                            </Link>
                        )}
                    </div>
                </div>
            </section>


            <section className="mb-16 px-4 max-w-7xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-semibold mb-10 text-center">
                    <span className="relative inline-block">
                     
                        <span className="absolute -bottom-1.5 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-70"></span>
                        <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Latest Discussions</span>
                    </span>
                </h2>

                {isLoadingRecent && (
                     <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-400"></div>
                     </div>
                )}
                {recentError && (
                    <div className="max-w-md mx-auto text-center py-5 px-4 bg-red-900/60 border border-red-700/60 rounded-lg">
                        <p className="text-red-300 text-sm">Could not load recent posts: {recentError}</p>
                    </div>
                )}

                {!isLoadingRecent && !recentError && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          
                        {recentPosts.length > 0 ? (
                            recentPosts.map(post => (
                                <PostItem key={post._id} post={post} />
                            ))
                        ) : (
                            <p className="text-center text-gray-400 md:col-span-2 lg:col-span-3 py-8">No recent posts found.</p>
                        )}
                    </div>
                )}

                {!isLoadingRecent && !recentError && recentPosts.length > 0 && (
                    <div className="text-center mt-12">
                        <Link to="/posts" className="group inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-300">
                            View all posts
                            <ArrowRightIcon className="h-5 w-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    </div>
                )}
            </section>
        </div>
    );
}

export default HomePage;