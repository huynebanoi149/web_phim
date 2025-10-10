import express from "express";
import {
  deleteAnyComment,
  editAnyComment,
  getComments,
  createComment,
  deleteComment,
  updateComment,
  toggleLike,
  getAllComments
} from "../controllers/commentController.js";

import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ----------------- ADMIN ----------------- //

// Admin xóa bất kỳ comment nào
router.delete("/admin/:id", verifyToken, verifyAdmin, deleteAnyComment);

// Admin sửa bất kỳ comment nào
router.put("/admin/:id", verifyToken, verifyAdmin, editAnyComment);

// Admin lấy tất cả bình luận
router.get("/", verifyToken, verifyAdmin, getAllComments);

// ----------------- USER ----------------- //

// Lấy comment theo movieId
router.get("/:movieId", getComments);

// Tạo comment
router.post("/:movieId", verifyToken, createComment);

// Sửa comment của chính user
router.put("/:id", verifyToken, updateComment);

// Xoá comment của chính user
router.delete("/:id", verifyToken, deleteComment);

// Like/Unlike comment
router.post("/:id/like", verifyToken, toggleLike);

export default router;
