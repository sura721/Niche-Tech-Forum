import React, { useState, useEffect } from 'react';
import { PencilSquareIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuthStore, selectUserInfo } from '../store/authStore.store';
import {
    usePostStore,
    selectIsUpdatingReply,
    selectIsDeletingReply,
    selectReplyEditDeleteError
} from '../store/postStore';
import PropTypes from 'prop-types';

function ReplyItem({ reply }) {
    const { _id: replyId, content, user, createdAt, post: postId } = reply;
    const authorUsername = user?.username || 'Unknown User';

    const userInfo = useAuthStore(selectUserInfo);
    const isAuthor = userInfo && userInfo._id === user?._id;

    const updateReplyInPost = usePostStore((state) => state.updateReplyInPost);
    const deleteReplyFromPost = usePostStore((state) => state.deleteReplyFromPost);
    const isUpdatingReply = usePostStore(selectIsUpdatingReply);
    const isDeletingReply = usePostStore(selectIsDeletingReply);
    const replyEditDeleteError = usePostStore(selectReplyEditDeleteError);
    const clearReplyEditDeleteError = usePostStore((state) => state.clearReplyEditDeleteError);

    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);
    const [currentError, setCurrentError] = useState(null);

    const isLoading = isUpdatingReply || isDeletingReply;

    useEffect(() => {
        setCurrentError(replyEditDeleteError);
    }, [replyEditDeleteError]);

    useEffect(() => {
        return () => { clearReplyEditDeleteError(); };
    }, [clearReplyEditDeleteError]);


    const handleEditToggle = () => {
        if (!isEditing) {
             setEditedContent(content);
             setCurrentError(null);
             clearReplyEditDeleteError();
        } else {
             setCurrentError(null);
             clearReplyEditDeleteError();
        }
        setIsEditing(!isEditing);
    };

    const handleSaveEdit = async () => {
         setCurrentError(null);
         clearReplyEditDeleteError();
        if (editedContent.trim() === '') {
            setCurrentError("Reply content cannot be empty."); return;
        }
        if (editedContent === content) {
            setIsEditing(false); return;
        }
        try {
            await updateReplyInPost(postId, replyId, { content: editedContent });
            setIsEditing(false);
        } catch (err) { }
    };

    const handleDelete = async () => {
        setCurrentError(null);
        clearReplyEditDeleteError();
        if (window.confirm('Are you sure you want to delete this reply?')) {
            try {
                await deleteReplyFromPost(postId, replyId);
            } catch (err) { }
        }
    };

    const formattedDate = new Date(createdAt).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
    });

    return (
        <div className="bg-gray-700/60 p-4 rounded-lg relative border border-gray-600/50">
            {isLoading && (
                 <div className="absolute inset-0 bg-gray-800/70 flex items-center justify-center rounded-lg z-10">
                    <span className="text-sm text-gray-400 animate-pulse">Processing...</span>
                 </div>
            )}
            {currentError && (
                <p className="text-xs text-red-400 bg-red-900/50 p-2 rounded-md mb-3 border border-red-700/50">
                    {currentError}
                </p>
            )}

            <div className="flex justify-between items-center mb-2 text-xs text-gray-400">
                <span className="font-semibold text-indigo-300 hover:text-indigo-200 text-sm">
                    {authorUsername}
                </span>
                <time dateTime={createdAt} className="text-gray-500 text-xs">
                    {formattedDate}
                </time>
            </div>

            {isEditing ? (
                <div className="space-y-2">
                     <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        rows="3"
                        className="w-full p-2 bg-gray-600/80 border border-gray-500/70 rounded-md text-gray-200 placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-y text-sm transition-colors duration-200"
                        disabled={isLoading}
                        placeholder="Edit your reply..."
                    />
                    <div className="flex justify-end items-center gap-2">
                        <button
                            onClick={handleEditToggle}
                            disabled={isLoading}
                            className="p-1.5 text-gray-400 hover:text-gray-100 hover:bg-gray-600/70 rounded-md transition-all duration-200"
                            title="Cancel Edit">
                            <XMarkIcon className="h-4 w-4"/>
                        </button>
                        <button
                            onClick={handleSaveEdit}
                            disabled={isLoading || editedContent.trim() === '' || editedContent === content}
                            className="p-1.5 text-green-400 hover:text-green-300 hover:bg-gray-600/70 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Save Changes">
                            <CheckIcon className="h-4 w-4"/>
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {content}
                </p>
            )}

            {isAuthor && !isEditing && (
                <div className="flex justify-end items-center space-x-1 mt-2 opacity-80 hover:opacity-100 transition-opacity duration-200">
                     <button
                        onClick={handleEditToggle}
                        disabled={isLoading}
                        title="Edit Reply"
                        className="p-1.5 text-gray-400 hover:text-indigo-300 hover:bg-gray-600/70 rounded-md transition-all duration-200">
                         <PencilSquareIcon className="h-4 w-4" />
                     </button>
                     <button
                        onClick={handleDelete}
                        disabled={isLoading}
                        title="Delete Reply"
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-600/70 rounded-md transition-all duration-200">
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
}

ReplyItem.propTypes = {
  reply: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    user: PropTypes.shape({
        _id: PropTypes.string,
        username: PropTypes.string
    }),
    createdAt: PropTypes.string.isRequired,
    post: PropTypes.string.isRequired,
  }).isRequired,
};

export default ReplyItem;