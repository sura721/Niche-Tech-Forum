import React from 'react';
import PostItem from './PostItem';
import PropTypes from 'prop-types';

function PostList({ posts }) { 


  if (!posts || posts.length === 0) {

    return <div className="text-center py-10 text-gray-500">No posts to display.</div>;
    ;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostItem key={post._id} post={post} />
      ))}
    </div>
  );
}

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired, 
};


export default PostList;