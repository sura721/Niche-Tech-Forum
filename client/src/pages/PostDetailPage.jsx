import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronUpIcon, ChevronDownIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
    usePostStore,
    selectCurrentPost,
    selectPostsLoadingSingle,
    selectPostsError,
    selectIsDeletingPost,
    selectEditDeleteError,
} from '../store/postStore';
import { useAuthStore, selectIsAuthenticated, selectUserInfo } from '../store/authStore.store';
import ReplyItem from '../components/ReplyItem'; 
import CreateReplyForm from '../components/CreateReplyForm'; 

function PostDetailPage() {
    const { postId } = useParams();
    const navigate = useNavigate();

    const post = usePostStore(selectCurrentPost);
    const isLoading = usePostStore(selectPostsLoadingSingle);
    const fetchError = usePostStore(selectPostsError);
    const fetchPostById = usePostStore((state) => state.fetchPostById);
    const clearCurrentPost = usePostStore((state) => state.clearCurrentPost);
    const deletePostAction = usePostStore((state) => state.deletePost);
    const isDeleting = usePostStore(selectIsDeletingPost);
    const editDeleteError = usePostStore(selectEditDeleteError);
    const clearEditDeleteError = usePostStore((state) => state.clearEditDeleteError);

    const isAuthenticated = useAuthStore(selectIsAuthenticated);
    const userInfo = useAuthStore(selectUserInfo);

    const [isReplyFormVisible, setIsReplyFormVisible] = useState(false);
    const [areRepliesVisible, setAreRepliesVisible] = useState(true);

    const isAuthor = post && userInfo && post.user._id === userInfo._id;

    useEffect(() => {
        clearEditDeleteError();
        if (postId) {
            fetchPostById(postId);
        }
        setIsReplyFormVisible(false);
        setAreRepliesVisible(true);
        return () => {
            clearCurrentPost();
            clearEditDeleteError();
        };
    }, [postId, fetchPostById, clearCurrentPost, clearEditDeleteError]);

    const handleReplySuccess = () => {
        setIsReplyFormVisible(false);
        setAreRepliesVisible(true);
    };

    const handleDelete = async () => {
        clearEditDeleteError();
        if (window.confirm('Are you sure you want to delete this post and all its replies?')) {
            try {
                await deletePostAction(postId);
                navigate('/');
            } catch (error) {
            }
        }
    };

    const handleEdit = () => {
        navigate(`/posts/${postId}/edit`);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="max-w-3xl mx-auto mt-12 p-6 bg-red-900/60 border border-red-700/60 rounded-lg text-center">
                <p className="text-red-200 text-lg mb-2">Error loading post</p>
                <p className="font-medium text-gray-300 mb-5">{fetchError}</p>
                <Link
                    to="/"
                    className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors duration-300"
                >
                    Go back home
                </Link>
            </div>
        );
    }

    if (!post && !isLoading) {
        return (
            <div className="max-w-3xl mx-auto mt-12 p-6 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">Post Not Found</h2>
                <p className="mb-6 text-gray-400">The post you are looking for does not exist or may have been removed.</p>
                <Link
                    to="/"
                    className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors duration-300"
                >
                    Go back home
                </Link>
            </div>
        );
    }

    if (!post) {
        return <div className="text-center py-16 text-gray-500">Loading post data...</div>;
    }

    const replies = Array.isArray(post.replies) ? post.replies : [];
    const { title, content, user, category, createdAt } = post;

    const authorUsername = user?.username || 'Unknown Author';
    const authorBio = user?.bio || '';
    const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
    const postDate = new Date(createdAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });

    return (
     
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        
            {editDeleteError && (
                <div className="mb-6 p-4 bg-red-900/60 border border-red-700/60 text-red-200 text-center rounded-lg text-sm">
                    <p className="font-medium">{editDeleteError}</p>
                </div>
            )}

            <div className="pb-6 md:pb-8 border-b border-gray-700/50 mb-8 md:mb-10">
                <div className="flex justify-between items-start gap-4">
   
                    <div className="flex-1 min-w-0">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4 leading-tight break-words">
               
                            {title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
                            <span className="inline-flex items-center bg-gray-700 hover:bg-gray-600 text-indigo-300 px-3 py-0.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors">
                                {category}
                            </span>
                            <span className="text-gray-600 hidden sm:inline">•</span>
                            <time dateTime={createdAt} className="text-gray-400 hover:text-gray-300 whitespace-nowrap transition-colors">
                                {postDate}
                            </time>
                        </div>
                    </div>
                    {isAuthor && (
                         <div className="flex-shrink-0 flex items-center space-x-1 sm:space-x-2">
                            <button
                                onClick={handleEdit}
                                aria-label="Edit Post"
                                title="Edit Post"
                                className="p-2 text-gray-400 hover:text-indigo-300 hover:bg-gray-700/70 rounded-md transition-all duration-200"
                            >
                                <PencilSquareIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={handleDelete}
                                aria-label="Delete Post"
                                title="Delete Post"
                                disabled={isDeleting}
                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700/70 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? (
                                    <span className="flex items-center text-xs px-1 animate-pulse text-red-400">
                                        <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Deleting
                                    </span>
                                ) : <TrashIcon className="h-5 w-5" />}
                            </button>
                        </div>
                    )}
                </div>
            </div>


            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
  
                <aside className="lg:w-60 xl:w-72 flex-shrink-0 lg:border-r lg:border-gray-700/50 lg:pr-8 xl:pr-12">
                    <div className="sticky top-24 space-y-5">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Author</h4>
                        <div className="border-t border-gray-700/50 pt-4">
                            <p className="font-semibold text-lg text-indigo-300 hover:text-indigo-200 break-words">{authorUsername}</p>
                            {memberSince && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Member since {memberSince}
                                </p>
                            )}
                        </div>
                        {authorBio && (
                            <p className="text-sm text-gray-400 italic border-t border-gray-700/50 pt-4">"{authorBio}"</p>
                        )}
                    </div>
                </aside>

                <article className="flex-1 min-w-0">
         
                    <div className="text-gray-200 text-lg leading-relaxed mb-12">
                   
                        <p className="whitespace-pre-wrap">{content}</p>
                    </div>

                    <div className="pt-8 border-t border-gray-700/50">
               
                        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                            <h3 className="text-2xl font-semibold text-gray-100"> 
                                Replies <span className="text-xl font-medium text-indigo-400">({replies.length})</span>
                            </h3>
                            {replies.length > 0 && (
                                <button
                                    onClick={() => setAreRepliesVisible(!areRepliesVisible)}
                                    className="flex items-center text-sm text-indigo-300 hover:text-indigo-200 font-medium px-2 py-1 rounded-md hover:bg-gray-700/70 transition-all duration-200"
                                    aria-controls="replies-list-container"
                                    aria-expanded={areRepliesVisible}
                                >
                                    {areRepliesVisible ? 'Hide' : 'Show'} Replies
                                    {areRepliesVisible ? (
                                        <ChevronUpIcon className="h-4 w-4 ml-1" />
                                    ) : (
                                        <ChevronDownIcon className="h-4 w-4 ml-1" />
                                    )}
                                </button>
                            )}
                        </div>

                     
                        {isAuthenticated && (
                            <div className="mb-8">
                                {!isReplyFormVisible ? (
                                    <button
                                        onClick={() => setIsReplyFormVisible(true)}
                                        className="inline-flex items-center text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-md shadow hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
                                      
                                    >
                                        Write a Reply
                                    </button>
                                ) : (
                                    
                                    <div className="bg-gray-700/60 border border-gray-600/70 rounded-lg p-4 transition-all duration-300 ease-out">
                           
                                        <CreateReplyForm
                                            postId={post._id}
                                            onReplySuccess={handleReplySuccess}
                                            onCancel={() => setIsReplyFormVisible(false)}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                       
                        <div
                            id="replies-list-container"
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                areRepliesVisible ? 'max-h-[9999px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <div className="space-y-5"> 
                                {post && post._id === postId && replies.length > 0 ? (
                                    replies.map((reply) => (
                                        <ReplyItem key={reply._id} reply={reply} />
                                    ))
                                ) : (
                                    areRepliesVisible && !isLoading && replies.length === 0 && (
                                        <p className="text-gray-400 text-base italic py-8 text-center border-t border-dashed border-gray-700/50 mt-6">
                                            Be the first to contribute to the discussion!
                                        </p>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}

export default PostDetailPage;