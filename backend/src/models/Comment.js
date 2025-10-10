import mongoose from "mongoose";

// Định nghĩa schema cho Comment
const commentSchema = new mongoose.Schema(
  {
    movieId: { type: Number, ref: "Movie", required: true }, // vì Movie._id là Number
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
