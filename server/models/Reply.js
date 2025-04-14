import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    content: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { timestamps: true }
);

const Reply = mongoose.models.Reply || mongoose.model("Reply", replySchema);

export default Reply;
