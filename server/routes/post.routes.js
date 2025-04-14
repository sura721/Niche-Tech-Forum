import express from 'express';
import {
    createPost,
    getAllPosts,
    getPostsByCategory,
    getPostById,
    searchPosts,
    updatePost,
    deletePost,
} from '../controllers/post.controller.js';
import {
    createReply,
    updateReply,
    deleteReply,
} from '../controllers/reply.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createPost)
    .get(getAllPosts);

router.get('/search', searchPosts);

router.get('/category/:categoryName', getPostsByCategory);

router.route('/:id')
    .get(getPostById)
    .put(protect, updatePost)
    .delete(protect, deletePost);

router.route('/:postId/replies')
    .post(protect, createReply);

router.route('/:postId/replies/:replyId') 
    .put(protect, updateReply)
    .delete(protect, deleteReply);

export default router;