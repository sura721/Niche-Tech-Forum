import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Post from '../models/Post.js';

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('username email bio createdAt');
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id); 

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email; 
        user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;

      
        try {
            const updatedUser = await user.save();
            res.status(200).json({
                _id: updatedUser._id, 
                username: updatedUser.username,
                email: updatedUser.email, 
                bio: updatedUser.bio,
                createdAt: updatedUser.createdAt
            });
        } catch (error) {
            res.status(400);
            if (error.code === 11000 || error.name === 'ValidationError') {
                 throw new Error(error.code === 11000 ? 'Username or email already exists.' : 'Invalid data provided.');
            }
            throw new Error('User profile update failed');
        }
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const getUserPosts = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const posts = await Post.find({ user: userId })
                            .sort({ createdAt: -1 })
                            .populate('user', 'username');
    res.status(200).json(posts);
});

const getUserPublicProfileByUsername = asyncHandler(async (req, res) => {
    const usernameParam = req.params.username; 

    const user = await User.findOne({ username: usernameParam })
                           .select('username bio createdAt');
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({message: 'User not found'});
    }
});


export {
    getUserProfile,
    updateUserProfile,
    getUserPublicProfileByUsername,
    getUserPosts
};