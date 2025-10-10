import React, { useState } from "react";
import { createComment } from "../../libs/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CommentForm({ movieId, parentId = null, onSuccess }) {
  const [content, setContent] = useState("");
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    //  Kiểm tra đăng nhập
    if (!user || !token) {
      alert("Bạn cần đăng nhập để bình luận!");
      navigate("/login");
      return;
    }

    try {
      await createComment(movieId, { content, parentId }, token);
      setContent("");
      onSuccess?.();
    } catch (err) {
      console.error("Lỗi khi gửi bình luận:", err);
      alert("Không thể gửi bình luận. Vui lòng thử lại.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 my-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Viết bình luận..."
        className="border rounded p-2"
      />
      <button
        type="submit"
        className="bg-red-500 text-white px-4 py-1 rounded"
      >
        Gửi
      </button>
    </form>
  );
}
