import asyncHandler from 'express-async-handler';
import Reply from '../models/Reply.js';
import Post from '../models/Post.js';
import mongoose from 'mongoose';

const createReply = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const userId = req.user._id;
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        res.status(400);
        throw new Error('Invalid Post ID format');
    }
    if (!content || content.trim() === '') {
        res.status(400);
        throw new Error('Reply content cannot be empty');
    }

    const postExists = await Post.findById(postId);
    if (!postExists) {
        res.status(404);
        throw new Error('Post not found');
    }

    const reply = await Reply.create({
        content,
        user: userId,
        post: postId,
    });

    postExists.replies.push(reply._id);
    await postExists.save();

    await reply.populate('user', 'username');
    res.status(201).json(reply);
});

const updateReply = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { replyId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(replyId)) {
        res.status(400);
        throw new Error('Invalid Reply ID format');
    }
    if (!content || content.trim() === '') {
        res.status(400);
        throw new Error('Reply content cannot be empty');
    }

    const reply = await Reply.findById(replyId);

    if (!reply) {
        res.status(404);
        throw new Error('Reply not found');
    }

    if (reply.user.toString() !== userId.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this reply');
    }

    reply.content = content;
    const updatedReply = await reply.save();
    await updatedReply.populate('user', 'username');

    res.status(200).json(updatedReply);
});

const deleteReply = asyncHandler(async (req, res) => {
    const { postId, replyId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(replyId) || !mongoose.Types.ObjectId.isValid(postId)) {
        res.status(400);
        throw new Error('Invalid Post or Reply ID format');
    }

    const reply = await Reply.findById(replyId);

    if (!reply) {
        res.status(404);
        throw new Error('Reply not found');
    }

    if (reply.user.toString() !== userId.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this reply');
    }

    await Post.updateOne(
        { _id: postId },
        { $pull: { replies: replyId } }
    );

    await Reply.deleteOne({ _id: replyId });

    res.status(200).json({ message: 'Reply deleted successfully' });
});

export {
    createReply,
    updateReply,
    deleteReply,
};
