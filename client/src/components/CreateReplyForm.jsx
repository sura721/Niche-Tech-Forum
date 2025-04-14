import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { usePostStore, selectSubmittingReply, selectReplyError } from '../store/postStore';
import { useAuthStore, selectIsAuthenticated } from '../store/authStore.store';

function CreateReplyForm({ postId, onReplySuccess, onCancel }) {
    const [content, setContent] = useState('');

    const addReplyToPost = usePostStore((state) => state.addReplyToPost);
    const isSubmitting = usePostStore(selectSubmittingReply);
    const error = usePostStore(selectReplyError);
    const clearReplyError = usePostStore((state) => state.clearReplyError);
    const isAuthenticated = useAuthStore(selectIsAuthenticated);

    useEffect(() => {
        return () => { clearReplyError(); };
    }, [clearReplyError, postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearReplyError();
        if (!content.trim() || !postId) return;

        try {
            await addReplyToPost(postId, { content });
            setContent('');
            if (onReplySuccess) {
                onReplySuccess();
            }
        } catch (err) {
        }
    };

    if (!isAuthenticated) return null;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             {error && (
                <p className="text-red-400 text-xs p-2 bg-red-900/50 border border-red-700/60 rounded-md">
                    {error}
                </p>
             )}
            <div>
                <label htmlFor={`reply-content-${postId}`} className="sr-only">Reply Content</label>
                <textarea
                    id={`reply-content-${postId}`}
                    rows="4"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    placeholder="Write your reply..."
                    className="w-full p-3 bg-gray-600/70 border border-gray-500/80 rounded-md text-gray-200 placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-y text-sm transition-colors duration-200 outline-none"
                />
            </div>
            <div className="flex justify-end items-center gap-3">
                 {onCancel && (
                     <button
                         type="button"
                         onClick={onCancel}
                         disabled={isSubmitting}
                         className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-gray-200 font-medium rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-750 focus:ring-gray-500 disabled:opacity-60"
                    >
                        Cancel
                    </button>
                 )}
                <button
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                    className="py-2 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-750 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                         <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                        </span>
                    ) : 'send'}
                </button>
            </div>
        </form>
    );
}

CreateReplyForm.propTypes = {
  postId: PropTypes.string.isRequired,
  onReplySuccess: PropTypes.func,
  onCancel: PropTypes.func,
};

export default CreateReplyForm;