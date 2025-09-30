import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchCard from "./SearchCard";
import useFetch from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const { user, logout, token, loading } = useAuth();

  // Gọi API search
  const [searchLoading, searchData] = useFetch({
    url: searchValue
      ? `/movies/search?q=${encodeURIComponent(searchValue)}&page=1`
      : "",
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Nếu chưa load xong state thì không render (tránh nháy UI)
  if (loading) return null;

  return (
    <div>
      <header className="fixed top-0 z-50 flex h-14 w-screen items-center bg-black px-10 text-xs font-light text-white sm:text-base">
        {/* Logo + menu trái */}
        <div className="flex items-center gap-3">
          <Link to={"/"}>
            <img src="/header-logo.png" alt="" className="w-16 sm:w-28" />
          </Link>
          <Link to={"/search?media_type=movie"}>Loc Phim</Link>
          {/* <Link to={"/search?media_type=tv"}>Chanels</Link> */}
        </div>

        {/* Search + login bên phải */}
        <div className="flex items-center gap-4 ml-auto">
          <div
            className="relative text-black min-w-44"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setSearchValue("");
              }
            }}
          >
            <input
              type="text"
              placeholder="Search"
              className="w-[17vw] rounded-md px-2 py-1 font-normal outline-none"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute right-2 top-1/2 -translate-y-1/2 transform text-gray-500"
            />

            {/* Dropdown kết quả search */}
            {searchValue && (
              <div className="absolute top-full left-0 bg-white w-full rounded-b-lg shadow-lg max-h-[65vh] overflow-y-auto z-50">
                {searchLoading && (
                  <p className="p-2 text-gray-500">Đang tìm...</p>
                )}

                {!searchLoading &&
                  searchData?.results?.map((card) => (
                    <SearchCard key={card._id ?? card.id} data={card} />
                  ))}

                {!searchLoading &&
                  searchData?.results?.length === 0 && (
                    <p className="p-2 text-gray-500">Không tìm thấy phim nào</p>
                  )}
              </div>
            )}
          </div>

          {/* Đổi nút login/logout */}
          {token ? (
            <div className="flex items-center gap-3">
              <Link to="/account">
                <button className="py-2 px-5 bg-gray-700 hover:bg-gray-600 text-white rounded-md font-semibold transition duration-200">
                  Quản lý tài khoản
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="py-2 px-5 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold transition duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button className="py-2 px-5 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold transition duration-200">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </header>

      {/* giữ khoảng trống header */}
      <div className="h-14"></div>
    </div>
  );
};

export default Header;
