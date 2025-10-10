import { useEffect, useState } from "react";
import {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../../libs/api";

// ✅ Helper format tiền tệ
function formatCurrency(num) {
  if (!num) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num);
}

export default function ManageMovies() {
  const [movies, setMovies] = useState([]); 
  const [form, setForm] = useState({
    title: "",
    overview: "",
    release_date: "",
    poster_path: "",
    backdrop_path: "",
    vote_average: 0,
    trailer_url: "",
    homepage: "",
    genres: "",
    budget: 0,
    production_companies: "",
  });
  const [editingId, setEditingId] = useState(null); 
  const [selectedOverview, setSelectedOverview] = useState(null); 

  // ✅ State phân trang
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10; 

  // ===== LẤY DANH SÁCH PHIM =====
  const fetchMovies = async (p = 1) => {
    try {
      const data = await getMovies({ page: p, limit });
      setMovies(data.results || []);
      setTotal(data.total || 0);
      setPage(data.page || 1);
    } catch (err) {
      console.error("Lỗi lấy phim:", err);
    }
  };

  useEffect(() => {
    fetchMovies(1); 
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      vote_average: Number(form.vote_average),
      budget: Number(form.budget),
      genres: form.genres
        ? form.genres.split(",").map((g) => ({ name: g.trim() }))
        : [],
      production_companies: form.production_companies
        ? form.production_companies.split(",").map((c) => ({ name: c.trim() }))
        : [],
      videos: form.trailer_url
        ? [
            {
              name: "Trailer",
              url: form.trailer_url,
              site: "YouTube",
              type: "Trailer",
            },
          ]
        : [],
    };

    try {
      if (editingId) {
        await updateMovie(editingId, payload); 
      } else {
        await createMovie(payload); 
      }
      setForm({
        title: "",
        overview: "",
        release_date: "",
        poster_path: "",
        backdrop_path: "",
        vote_average: 0,
        trailer_url: "",
        homepage: "",
        genres: "",
        budget: 0,
        production_companies: "",
      });
      setEditingId(null);
      fetchMovies(page); 
    } catch (err) {
      alert("Lỗi khi lưu phim: " + err.message);
    }
  };

  // ===== CHỈNH SỬA =====
  const handleEdit = (movie) => {
    setForm({
      title: movie.title || "",
      overview: movie.overview || "",
      release_date: movie.release_date || "",
      poster_path: movie.poster_path || "",
      backdrop_path: movie.backdrop_path || "",
      vote_average: movie.vote_average || 0,
      trailer_url:
        movie.videos && movie.videos.length > 0 ? movie.videos[0].url : "",
      homepage: movie.homepage || "",
      genres: (movie.genres || []).map((g) => g.name).join(", "),
      budget: movie.budget || 0,
      production_companies: (movie.production_companies || [])
        .map((c) => c.name)
        .join(", "),
    });
    setEditingId(movie._id);
  };

  // ===== XOÁ =====
  const handleDelete = async (id) => {
    if (window.confirm("Xóa phim này?")) {
      await deleteMovie(id);
      fetchMovies(page);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý phim</h1>

      {/* ===== FORM THÊM / SỬA PHIM ===== */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Tên phim"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className="border p-2 w-full"
          placeholder="Mô tả"
          value={form.overview}
          onChange={(e) => setForm({ ...form, overview: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="Ngày phát hành"
          value={form.release_date}
          onChange={(e) => setForm({ ...form, release_date: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="Poster URL (có thể nhập link hoặc /path từ TMDb)"
          value={form.poster_path}
          onChange={(e) => setForm({ ...form, poster_path: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="Backdrop URL (có thể nhập link hoặc /path từ TMDb)"
          value={form.backdrop_path}
          onChange={(e) =>
            setForm({ ...form, backdrop_path: e.target.value })
          }
        />
        <input
          type="number"
          step="0.1"
          className="border p-2 w-full"
          placeholder="Vote Average"
          value={form.vote_average}
          onChange={(e) =>
            setForm({ ...form, vote_average: e.target.value })
          }
        />
        <input
          className="border p-2 w-full"
          placeholder="Trailer URL"
          value={form.trailer_url}
          onChange={(e) =>
            setForm({ ...form, trailer_url: e.target.value })
          }
        />
        <input
          className="border p-2 w-full"
          placeholder="Phim URL"
          value={form.homepage}
          onChange={(e) => setForm({ ...form, homepage: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="Thể loại (ngăn cách bởi dấu phẩy)"
          value={form.genres}
          onChange={(e) => setForm({ ...form, genres: e.target.value })}
        />
        <input
          type="number"
          className="border p-2 w-full"
          placeholder="Kinh phí (USD)"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="Hãng sản xuất (ngăn cách bởi dấu phẩy)"
          value={form.production_companies}
          onChange={(e) =>
            setForm({ ...form, production_companies: e.target.value })
          }
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          {editingId ? "Cập nhật" : "Thêm"}
        </button>
      </form>

      {/* ===== DANH SÁCH PHIM ===== */}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Poster</th>
            <th className="p-2 border">Backdrop</th>
            <th className="p-2 border">Tên phim</th>
            <th className="p-2 border">Ngày phát hành</th>
            <th className="p-2 border">Điểm</th>
            <th className="p-2 border">Thể loại</th>
            <th className="p-2 border">Hãng SX</th>
            <th className="p-2 border">Kinh phí</th>
            <th className="p-2 border">Mô tả</th>
            <th className="p-2 border">Phim URL</th>
            <th className="p-2 border">Trailer</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((m) => (
            <tr key={m._id}>
              <td className="p-2 border">{m._id}</td>

              {/*  Poster hiển thị URL nhập tay hoặc TMDb */}
              <td className="p-2 border">
                {m.poster_path ? (
                  <img
                    src={
                      m.poster_path.startsWith("http")
                        ? m.poster_path
                        : `https://image.tmdb.org/t/p/w92${m.poster_path}`
                    }
                    alt={m.title}
                    className="h-16 object-cover"
                  />
                ) : (
                  "N/A"
                )}
              </td>

              {/*  Backdrop hiển thị URL nhập tay hoặc TMDb */}
              <td className="p-2 border">
                {m.backdrop_path ? (
                  <img
                    src={
                      m.backdrop_path.startsWith("http")
                        ? m.backdrop_path
                        : `https://image.tmdb.org/t/p/w92${m.backdrop_path}`
                    }
                    alt={m.title}
                    className="h-16 object-cover"
                  />
                ) : (
                  "N/A"
                )}
              </td>

              <td className="p-2 border">{m.title || m.name}</td>
              <td className="p-2 border">
                {m.release_date || m.first_air_date || "-"}
              </td>
              <td className="p-2 border">{m.vote_average?.toFixed(1) || "-"}</td>
              <td className="p-2 border">
                {(m.genres || []).map((g) => g.name).join(", ")}
              </td>
              <td className="p-2 border">
                {(m.production_companies || []).map((c) => c.name).join(", ")}
              </td>
              <td className="p-2 border">{formatCurrency(m.budget)}</td>
              <td
                className="p-2 border max-w-xs truncate cursor-pointer text-blue-600"
                onClick={() => setSelectedOverview(m.overview || "-")}
              >
                {m.overview || "-"}
              </td>
              <td className="p-2 border">
                {m.homepage ? (
                  <a
                    href={m.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Xem phim
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td className="p-2 border">
                {m.videos && m.videos.length > 0 ? (
                  <a
                    href={m.videos[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Trailer
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEdit(m)}
                  className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(m._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== PHÂN TRANG ===== */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          disabled={page === 1}
          onClick={() => fetchMovies(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          ← Trước
        </button>
        <span>
          Trang {page} / {Math.ceil(total / limit) || 1}
        </span>
        <button
          disabled={page >= Math.ceil(total / limit)}
          onClick={() => fetchMovies(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Sau →
        </button>
      </div>

      {/* ===== POPUP HIỂN THỊ OVERVIEW ===== */}
      {selectedOverview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            <h2 className="text-lg font-bold mb-4">Mô tả phim</h2>
            <p className="whitespace-pre-wrap">{selectedOverview}</p>
            <div className="text-right mt-4">
              <button
                onClick={() => setSelectedOverview(null)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
