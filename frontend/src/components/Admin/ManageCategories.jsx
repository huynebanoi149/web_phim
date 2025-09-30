import { useEffect, useState } from "react";

export default function ManageCategories() {
  const [genres, setGenres] = useState([]);
  const [newName, setNewName] = useState("");
  const [newId, setNewId] = useState("");

  // ✅ Lấy base url từ .env (vd: VITE_API_BASE_URL=http://localhost:5001/api)
  const API_BASE = `${import.meta.env.VITE_API_BASE_URL}`;


  // 👉 Lấy danh sách từ API
  useEffect(() => {
    fetch(`${API_BASE}/genres`)
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => setGenres(data.genres))
      .catch((err) => console.error("Fetch genres error:", err));
  }, [API_BASE]);

  // 👉 Thêm mới
  const addGenre = async () => {
    if (!newName || !newId) return;
    const res = await fetch(`${API_BASE}/genres`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: Number(newId), name: newName })
    });
    if (!res.ok) {
      console.error("Add genre failed");
      return;
    }
    const genre = await res.json();
    setGenres([...genres, genre]);
    setNewName("");
    setNewId("");
  };

  // 👉 Sửa tên
  const updateGenre = async (mongoId, name) => {
    const editedName = prompt("Tên mới:", name);
    if (!editedName) return;
    const res = await fetch(`${API_BASE}/genres/${mongoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editedName })
    });
    if (!res.ok) {
      console.error("Update genre failed");
      return;
    }
    const updated = await res.json();
    setGenres(genres.map(g => g._id === updated._id ? updated : g));
  };

  // 👉 Xóa
  const deleteGenre = async (mongoId) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    const res = await fetch(`${API_BASE}/genres/${mongoId}`, { method: "DELETE" });
    if (!res.ok) {
      console.error("Delete genre failed");
      return;
    }
    setGenres(genres.filter(g => g._id !== mongoId));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý danh mục</h1>

      {/* Form thêm */}
      <div className="mb-4 flex gap-2">
        <input
          className="border p-2"
          placeholder="ID "
          value={newId}
          onChange={(e) => setNewId(e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Tên thể loại"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addGenre}
        >
          Thêm
        </button>
      </div>

      {/* Danh sách */}
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Tên</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {genres.map((g) => (
            <tr key={g._id}>
              <td className="border px-4 py-2">{g.id}</td>
              <td className="border px-4 py-2">{g.name}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => updateGenre(g._id, g.name)}
                >
                  Sửa
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => deleteGenre(g._id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
