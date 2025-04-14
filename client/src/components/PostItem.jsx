import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'; // Import reply icon

function PostItem({ post }) {
    const { _id, title, user, category, createdAt, replies } = post;
    const authorUsername = user?.username || 'Unknown Author';
    const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
    });
    const replyCount = Array.isArray(replies) ? replies.length : 0;

    return (
        <div className="group relative bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-indigo-500/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Link to={`/posts/${_id}`} className="block mb-3">
            <div className="relative z-10">
         
                    <h3 className="text-xl font-bold text-gray-100 group-hover:text-indigo-400 transition-colors duration-300">
                        {title}
                    </h3>
         

                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                    <span>
                        by{' '}
                        <span className="font-medium text-indigo-300">{authorUsername}</span>
                    </span>

                    <span className="text-gray-600">•</span>

                    <span className="inline-block bg-gray-700 text-indigo-300 px-3 py-1 rounded-full group-hover:bg-indigo-900/30 group-hover:text-indigo-200 transition-all duration-300">
                        {category}
                    </span>

                    <span className="text-gray-600">•</span>

                    <time dateTime={createdAt} className="text-gray-500 group-hover:text-gray-300 transition-colors duration-300">
                        {formattedDate}
                    </time>

                    <span className="text-gray-600">•</span>

                    <span className="flex items-center text-gray-500 group-hover:text-gray-300 transition-colors duration-300" title={`${replyCount} replies`}>
                         <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                         {replyCount}
                    </span>

                </div>
            </div>
            </Link>
        </div>
    );
}

PostItem.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    user: PropTypes.shape({ username: PropTypes.string }),
    category: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    replies: PropTypes.array, // Add replies prop type
  }).isRequired,
};

export default PostItem;