import { useState } from "react";

export default function EditAccount({ setTab, user, setUser }) {
  const [username, setUsername] = useState(user.username || "");
  const [gender, setGender] = useState(user.gender || "");

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5001/api/auth/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ username, gender }),
    });

    if (!res.ok) throw new Error("Cập nhật thất bại");

    const data = await res.json();
    setUser(data.user); 
    setTab("info");
  } catch (err) {
    console.error(err.message);
  }
};



  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Chỉnh sửa tài khoản</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Email</label>
          <input
            value={user.email}
            disabled
            className="border p-2 w-full rounded bg-gray-100"
          />
        </div>
        <div>
          <label>Tên hiển thị</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label>Giới tính</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="border p-2 w-full rounded"
          >
            <option value="">-- Chọn giới tính --</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Không xác định">Không xác định</option>
          </select>
        </div>
        <div className="space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Cập nhật
          </button>
          <button
            type="button"
            onClick={() => setTab("info")}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
