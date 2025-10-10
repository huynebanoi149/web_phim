import Comment from "../models/Comment.js";

// Lấy tất cả comment theo movieId (nested replies)
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ movieId: req.params.movieId })
      .populate("userId", "username email")
      .lean();

    const map = {};
    comments.forEach(c => { map[c._id] = { ...c, replies: [] }; });
    const roots = [];

    comments.forEach(c => {
      if (c.parentId) {
        map[c.parentId]?.replies.push(map[c._id]);
      } else {
        roots.push(map[c._id]);
      }
    });

    res.json(roots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tạo mới
export const createComment = async (req, res) => {
  try {
    const { content, parentId } = req.body;
    if (!content) return res.status(400).json({ error: "Nội dung không được để trống" });

    const comment = await Comment.create({
      content,
      movieId: req.params.movieId,
      userId: req.user.id,
      parentId: parentId || null,
    });

    const populated = await comment.populate([
      { path: "userId", select: "username email" },
      { path: "movieId", select: "title" }
    ]);

    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User sửa comment của mình
export const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Nội dung không được để trống" });

    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Không tìm thấy comment" });

    if (String(comment.userId) !== req.user.id) {
      return res.status(403).json({ error: "Bạn không có quyền sửa comment này" });
    }

    comment.content = content;
    await comment.save();

    const populated = await comment.populate("userId", "username email");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User xoá comment của mình
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Không tìm thấy comment" });

    if (String(comment.userId) !== req.user.id) {
      return res.status(403).json({ error: "Bạn không có quyền xoá comment này" });
    }

    await comment.deleteOne();
    res.json({ _id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Like / Unlike
export const toggleLike = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Không tìm thấy comment" });

    const userId = req.user.id;
    if (comment.likes.includes(userId)) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();
    res.json({ likes: comment.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy tất cả bình luận (cho admin)
export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("userId", "username email")
      .populate("movieId", "title");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin xoá bất kỳ comment nào
export const deleteAnyComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment không tồn tại" });

    await comment.deleteOne();
    res.json({ _id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin sửa bất kỳ comment nào
export const editAnyComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Nội dung không được để trống" });

    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment không tồn tại" });

    comment.content = content;
    await comment.save();

    const populated = await comment.populate("userId", "username email");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
