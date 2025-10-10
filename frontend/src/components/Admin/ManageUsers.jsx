import { useState, useEffect } from "react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);    
  const [editData, setEditData] = useState({});         

  // Lấy danh sách user
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("http://localhost:5001/api/auth/users", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Không thể tải users");

        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // ====== BẮT SỰ KIỆN CLICK RA NGOÀI ĐỂ HỦY SỬA ======
  useEffect(() => {
    function handleClickOutside(e) {
      if (editingId && !e.target.closest(`tr[data-id="${editingId}"]`)) {
        setEditingId(null);
        setEditData({});
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [editingId]);

  // Xoá user
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá user này?")) return;
    try {
      const res = await fetch(`http://localhost:5001/api/auth/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || "Xoá thất bại");
      }
      alert("Xoá thành công");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Gọi API update
  const handleEditSave = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/auth/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editData),
      });

      if (!res.ok) {
        const { message } = await res.json().catch(() => ({ message: "Cập nhật thất bại" }));
        throw new Error(message);
      }

      const { user } = await res.json();
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, ...user } : u)));
      setEditingId(null);
      setEditData({});
      alert("Cập nhật thành công!");
    } catch (err) {
      alert(err.message);
    }
  };

  // Bắt đầu sửa
  const startEdit = (user) => {
    setEditingId(user._id);
    setEditData({
      username: user.username || "",
      gender: user.gender || "",
      role: user.role || "",
    });
  };

  if (loading) return <div className="p-6">⏳ Đang tải danh sách user...</div>;
  if (error) return <div className="p-6 text-red-500">❌ {error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý tài khoản thành viên</h1>

      {users.length === 0 ? (
        <div>Không có user nào</div>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Tên hiển thị</th>
              <th className="border border-gray-300 px-4 py-2">Giới tính</th>
              <th className="border border-gray-300 px-4 py-2">Role</th>
              <th className="border border-gray-300 px-4 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} data-id={u._id}>
                <td className="border border-gray-300 px-4 py-2">{u._id}</td>
                <td className="border border-gray-300 px-4 py-2">{u.email}</td>

                <td className="border border-gray-300 px-4 py-2">
                  {editingId === u._id ? (
                    <input
                      value={editData.username}
                      onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                      className="border px-2 py-1 w-full"
                    />
                  ) : (
                    u.username
                  )}
                </td>

                <td className="border border-gray-300 px-4 py-2">
                  {editingId === u._id ? (
                    <select
                      value={editData.gender}
                      onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                      className="border px-2 py-1 w-full"
                    >
                      <option value="">-- Chọn giới tính --</option>
                      <option value="nam">Nam</option>
                      <option value="nữ">Nữ</option>
                      <option value="không xác định">Không xác định</option>
                    </select>
                  ) : (
                    u.gender
                  )}
                </td>


                <td className="border border-gray-300 px-4 py-2">
                  {editingId === u._id ? (
                    <input
                      value={editData.role}
                      onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                      className="border px-2 py-1 w-full"
                    />
                  ) : (
                    u.role
                  )}
                </td>

                <td className="border border-gray-300 px-4 py-2">
                  {editingId === u._id ? (
                    <button
                      onClick={() => handleEditSave(u._id)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                    >
                      Lưu
                    </button>
                  ) : (
                    <button
                      onClick={() => startEdit(u)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                    >
                      Sửa
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(u._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
