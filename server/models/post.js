import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: { type: String,},
    content: { type: String, },
    category: { type: String,},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }]
}, { timestamps: true });

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;