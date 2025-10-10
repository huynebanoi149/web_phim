import React, { useEffect, useState } from "react";

export default function ManageComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  // Hàm lấy toàn bộ comment
  const fetchComments = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/comments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      console.log("Comments:", data);
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi khi tải bình luận:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

 // Hàm xoá bình luận (dùng route admin)
const handleDelete = async (id) => {
  if (!window.confirm("Bạn có chắc muốn xoá bình luận này?")) return;

  try {
    const res = await fetch(`http://localhost:5001/api/comments/admin/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      const deleted = await res.json(); // { _id }
      setComments((prev) => prev.filter((c) => c._id !== deleted._id));
    } else {
      const err = await res.json();
      alert("Lỗi xoá: " + err.error);
    }
  } catch (error) {
    console.error("Lỗi khi xoá bình luận:", error);
  }
};

// Lưu chỉnh sửa (dùng route admin)
const handleSave = async (id) => {
  try {
    const res = await fetch(`http://localhost:5001/api/comments/admin/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ content: editContent }),
    });

    if (res.ok) {
      const updated = await res.json(); 
      setComments((prev) =>
        prev.map((c) => (c._id === id ? updated : c))
      );
      setEditingId(null);
      setEditContent("");
    } else {
      const err = await res.json();
      alert("Lỗi sửa: " + err.error);
    }
  } catch (error) {
    console.error("Lỗi khi sửa bình luận:", error);
  }
};
  // Bắt đầu sửa
  const handleEdit = (comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
  };

  

  if (loading) {
    return <p className="text-white">Đang tải bình luận...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý bình luận người dùng</h1>
      {comments.length === 0 ? (
        <p className="text-gray-400">Chưa có bình luận nào.</p>
      ) : (
        <table className="min-w-full bg-white text-black border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Người dùng</th>
              <th className="px-4 py-2 border">Phim</th>
              <th className="px-4 py-2 border">Nội dung</th>
              <th className="px-4 py-2 border">Ngày tạo</th>
              <th className="px-4 py-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((c) => (
              <tr key={c._id}>
                <td className="px-4 py-2 border">{c._id}</td>
                <td className="px-4 py-2 border">
                  {c.userId?.username || "Ẩn danh"}
                </td>
                <td className="px-4 py-2 border">
                  {c.movieId?.title || "Không rõ"}
                </td>
                <td className="px-4 py-2 border">
                  {editingId === c._id ? (
                    <input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full border px-2 py-1"
                    />
                  ) : (
                    c.content
                  )}
                </td>
                <td className="px-4 py-2 border">
                  {new Date(c.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2 border">
                  {editingId === c._id ? (
                    <>
                      <button
                        onClick={() => handleSave(c._id)}
                        className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-500 text-white px-2 py-1 rounded"
                      >
                        Huỷ
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Xoá
                      </button>
                      <button
                        onClick={() => handleEdit(c)}
                        className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
                      >
                        Sửa
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
