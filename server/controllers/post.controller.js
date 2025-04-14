import asyncHandler from 'express-async-handler';
import Post from '../models/Post.js';
import Reply from '../models/Reply.js';
import mongoose from 'mongoose';

const ALLOWED_CATEGORIES = ['JavaScript', 'React', 'Node.js', 'Next.js'];

const createPost = asyncHandler(async (req, res) => {
    const { title, content, category } = req.body;
    const userId = req.user._id;
    if (!title || !content || !category) {
        res.status(400); throw new Error('Please provide title, content, and category');
    }
    if (!ALLOWED_CATEGORIES.includes(category)) {
        res.status(400); throw new Error(`Invalid category. Allowed categories are: ${ALLOWED_CATEGORIES.join(', ')}`);
    }
    const post = await Post.create({ title, content, category, user: userId });
    await post.populate('user', 'username');
    res.status(201).json(post);
});

const getAllPosts = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit, 10); 
    const query = Post.find({})
                    .populate('user', 'username')
                    .sort({ createdAt: -1 });

    if (limit > 0) { 
        query.limit(limit);
    }

    const posts = await query.exec();
    res.status(200).json(posts);
});

const getPostsByCategory = asyncHandler(async (req, res) => {
    const { categoryName } = req.params;
    const normalizedCategory = ALLOWED_CATEGORIES.find(cat => cat.toLowerCase() === categoryName.toLowerCase());
    if (!normalizedCategory) {
        res.status(404); throw new Error(`Category '${categoryName}' not found or invalid.`);
    }
    const posts = await Post.find({ category: normalizedCategory })
                            .populate('user', 'username')
                            .sort({ createdAt: -1 });
    if (!posts || posts.length === 0) {
         res.status(200).json([]);
    } else {
        res.status(200).json(posts);
    }
});

const getPostById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400); throw new Error('Invalid post ID format');
    }
    const post = await Post.findById(id)
        .populate('user', 'username bio createdAt')
        .populate({ path: 'replies', populate: { path: 'user', select: 'username' }, options: { sort: { 'createdAt': 1 } } });
    if (!post) {
        res.status(404); throw new Error('Post not found');
    }
    res.status(200).json(post);
});

const searchPosts = asyncHandler(async (req, res) => {
    const query = req.query.q;
    if (!query || typeof query !== 'string' || query.trim() === '') {
        return res.status(200).json([]);
    }
    const trimmedQuery = query.trim();
    const escapedQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchCriteria = { $or: [ { title: { $regex: escapedQuery, $options: 'i' } }, { content: { $regex: escapedQuery, $options: 'i' } }, { category: { $regex: escapedQuery, $options: 'i' } } ] };
    try {
        const posts = await Post.find(searchCriteria).populate('user', 'username').sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (dbError) {
        res.status(500); throw new Error("Error searching posts.");
    }
});

const updatePost = asyncHandler(async (req, res) => {
    const { title, content, category } = req.body;
    const { id } = req.params;
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400); throw new Error('Invalid post ID format');
    }
    const post = await Post.findById(id);
    if (!post) {
        res.status(404); throw new Error('Post not found');
    }
    if (post.user.toString() !== userId.toString()) {
        res.status(401); throw new Error('Not authorized to update this post');
    }
    if (title !== undefined && title.trim() === '') { res.status(400); throw new Error('Title cannot be empty'); }
    if (content !== undefined && content.trim() === '') { res.status(400); throw new Error('Content cannot be empty'); }
    if (category !== undefined && !ALLOWED_CATEGORIES.includes(category)) { res.status(400); throw new Error(`Invalid category. Allowed categories are: ${ALLOWED_CATEGORIES.join(', ')}`); }
    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    const updatedPost = await post.save();
    await updatedPost.populate('user', 'username');
    res.status(200).json(updatedPost);
});

const deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400); throw new Error('Invalid post ID format');
    }
    const post = await Post.findById(id);
    if (!post) {
        res.status(404); throw new Error('Post not found');
    }
    if (post.user.toString() !== userId.toString()) {
        res.status(401); throw new Error('Not authorized to delete this post');
    }
    await Reply.deleteMany({ post: post._id });
    await Post.deleteOne({ _id: post._id });
    res.status(200).json({ message: 'Post deleted successfully' });
});

export { createPost, getAllPosts, getPostsByCategory, getPostById, searchPosts, updatePost, deletePost };