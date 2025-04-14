import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    updateUserProfile,
    getUserProfile,
    getUserPublicProfileByUsername,
    getUserPosts 
} from '../controllers/user.controller.js'

const router = express.Router();

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.get('/my-posts', protect, getUserPosts); 
router.get('/username/:username', getUserPublicProfileByUsername);

export default router;