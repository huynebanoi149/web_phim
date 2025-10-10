import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState(""); // ✅ thêm state giới tính
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username) return setError("Vui lòng nhập tên người dùng.");
    if (!email) return setError("Vui lòng nhập email.");
    if (!password) return setError("Vui lòng nhập mật khẩu.");
    if (password.length < 6)
      return setError("Mật khẩu phải có ít nhất 6 ký tự.");
    if (password !== confirmPassword)
      return setError("Mật khẩu xác nhận không khớp.");
    if (!gender) return setError("Vui lòng chọn giới tính."); 
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, gender }), 
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Đăng ký thất bại.");

      alert("Đăng ký thành công, hãy đăng nhập!");
      window.location.href = "/login";
    } catch (err) {
      setError(err.message || "Đăng ký thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="absolute inset-0 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/73969b52-b6e4-4dbd-9f4c-1f7bcdd5b7b7/8b9e4a6c-8c7a-4bb0-9db7-6f7d3d2d5c2a/VN-vi-20230918-popsignuptwoweeks-perspective_alpha_website_large.jpg')] bg-cover bg-center opacity-40"></div>

      <div className="relative z-10 max-w-md w-full bg-black/80 rounded-xl shadow-lg p-10 border border-zinc-700">
        <h1 className="text-3xl font-bold mb-6 text-center text-red-600">
          Đăng ký
        </h1>

        {error && (
          <div className="text-sm text-red-400 bg-red-900/40 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="text-sm">Tên người dùng</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md bg-zinc-800 border border-zinc-700 p-3 text-white focus:ring-2 focus:ring-red-600 outline-none"
              placeholder="Tên của bạn"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md bg-zinc-800 border border-zinc-700 p-3 text-white focus:ring-2 focus:ring-red-600 outline-none"
              placeholder="you@example.com"
              required
            />
          </div>

         

          {/* Password */}
          <div className="relative">
            <label className="text-sm">Mật khẩu</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md bg-zinc-800 border border-zinc-700 p-3 pr-12 text-white focus:ring-2 focus:ring-red-600 outline-none"
              placeholder="Mật khẩu của bạn"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-10 text-xs text-gray-400 hover:text-white"
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="text-sm">Xác nhận mật khẩu</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md bg-zinc-800 border border-zinc-700 p-3 pr-12 text-white focus:ring-2 focus:ring-red-600 outline-none"
              placeholder="Nhập lại mật khẩu"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-10 text-xs text-gray-400 hover:text-white"
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>

           {/* Gender radio */}
          <div>
            <label className="text-sm">Giới tính</label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="Nam"
                  checked={gender === "Nam"}
                  onChange={(e) => setGender(e.target.value)}
                />
                Nam
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="Nữ"
                  checked={gender === "Nữ"}
                  onChange={(e) => setGender(e.target.value)}
                />
                Nữ
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="Khác"
                  checked={gender === "Khác"}
                  onChange={(e) => setGender(e.target.value)}
                />
                Khác
              </label>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50 transition"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>

          <div className="pt-4 text-center text-sm text-gray-400">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-red-500 hover:underline">
              Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
