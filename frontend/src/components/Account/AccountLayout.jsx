import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import AccountInfo from "./AccountInfo";
import EditAccount from "./EditAccount";
import ChangePassword from "./ChangePassword";
import FavoriteList from "./FavoriteList";

export default function AccountLayout() {
  const [tab, setTab] = useState("info");
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:5001/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
        });

        if (!res.ok) {
          throw new Error("Không thể tải thông tin người dùng");
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err.message);
      }
    }

    fetchUser();
  }, []);

  if (!user) return <div className="p-6">Đang tải...</div>;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar setTab={setTab} />

      {/* Nội dung chính */}
      <div className="flex-1 p-6 bg-white shadow-md overflow-y-auto">
        {tab === "info" && <AccountInfo setTab={setTab} user={user} />}
        {tab === "edit" && <EditAccount setTab={setTab} user={user} setUser={setUser} />}
        {tab === "password" && <ChangePassword setTab={setTab} user={user} />}
        {tab === "favorites" && <FavoriteList />}
        {tab === "list" && <div>📝 Danh sách của bạn ở đây</div>}
        {tab === "history" && <div>📺 Lịch sử xem phim ở đây</div>}
        {tab === "notifications" && <div>🔔 Thông báo mới nhất ở đây</div>}
      </div>
    </div>
  );
}
