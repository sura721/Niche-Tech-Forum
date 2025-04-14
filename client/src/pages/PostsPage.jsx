import React, { useEffect } from 'react';
import { usePostStore, selectAllPosts, selectPostsLoadingList, selectPostsError } from '../store/postStore';
import PostList from '../components/PostList'; 

function PostsPage() {
    const posts = usePostStore(selectAllPosts);
    const isLoadingPosts = usePostStore(selectPostsLoadingList);
    const postsError = usePostStore(selectPostsError);
    const fetchAllPosts = usePostStore((state) => state.fetchAllPosts);
    const clearError = usePostStore((state) => state.clearError);

    useEffect(() => {
        fetchAllPosts(); 
        return () => {
           clearError();
        }
    }, [fetchAllPosts, clearError]);

    return (
        <div className="container mx-auto p-5">
           <h1 className="text-3xl font-bold mb-6 text-white">All Forum Posts</h1>


            {isLoadingPosts && <div className="text-center py-10 text-gray-500">Loading posts...</div>}

            {!isLoadingPosts && postsError && (
               <div className="text-center py-10 text-red-600 bg-red-100 border border-red-400 p-4 rounded-md">
                   <p>Error loading posts:</p>
                   <p className="font-medium">{postsError}</p>
               </div>
            )}

           {!isLoadingPosts && !postsError && posts.length === 0 && (
                <div className="text-center py-10 text-gray-500">No posts found yet.</div>
            )}

           {!isLoadingPosts && !postsError && posts.length > 0 && (
               <PostList posts={posts} />
           )}

        </div>
    );
}

export default PostsPage;