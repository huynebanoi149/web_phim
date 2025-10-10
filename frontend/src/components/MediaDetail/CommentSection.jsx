import { useEffect, useState } from "react";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  toggleLike,
} from "../../libs/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CommentSection({ movieId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const fetchComments = async () => {
    try {
      const data = await getComments(movieId);
      setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [movieId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    //  bắt buộc đăng nhập
    if (!user || !token) {
      alert("Bạn cần đăng nhập để bình luận!");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      await createComment(movieId, { content }, token);
      setContent("");
      fetchComments();
    } catch (err) {
      console.error(err);
      alert("Không thể gửi bình luận!");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!user || !token) {
      alert("Bạn cần đăng nhập để xoá bình luận!");
      navigate("/login");
      return;
    }
    if (!window.confirm("Bạn có chắc muốn xoá bình luận này?")) return;
    try {
      await deleteComment(id, token);
      fetchComments();
    } catch (err) {
      console.error(err);
      alert("Không thể xoá bình luận!");
    }
  };

  const handleLike = async (id) => {
    if (!user || !token) {
      alert("Bạn cần đăng nhập để thích bình luận!");
      navigate("/login");
      return;
    }
    try {
      await toggleLike(id, token);
      fetchComments();
    } catch (err) {
      console.error(err);
      alert("Không thể like bình luận!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Bình luận</h2>

      {/* Form nhập */}
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Viết bình luận..."
          className="w-full p-3 rounded bg-gray-800 text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-4 py-2 bg-red-600 hover:bg-black hover:text-red-600 rounded transition"
        >
          {loading ? "Đang gửi..." : "Gửi"}
        </button>
      </form>

      {/* Danh sách bình luận */}
      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-gray-400">Chưa có bình luận nào.</p>
        )}
        {comments.map((c) => (
          <div key={c._id} className="p-3 bg-gray-900 rounded">
            <p className="text-white">
              <strong>{c.userId?.username || "Ẩn danh"}</strong>: {c.content}
            </p>
            <div className="flex gap-4 text-sm text-gray-400 mt-1">
              <button onClick={() => handleLike(c._id)}>
                👍 {c.likes?.length || 0}
              </button>
              {user && c.userId?._id === user._id && (
                <button onClick={() => handleDelete(c._id)}>🗑️ Xoá</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
