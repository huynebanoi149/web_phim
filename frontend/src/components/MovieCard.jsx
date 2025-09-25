import React from "react";
import { Link } from "react-router-dom";
import CircularProgressBar from "./MediaList/CircularProgressBar";
import ImageComponent from "./Image";
import { useFavorites } from "../context/FavoriteContext";

const MovieCard = ({ data, mediaType = "" }) => {
  const { favorites, toggleFavorite } = useFavorites();
  const { poster_path, vote_average, original_language, id } = data;

  // ✅ Luôn lấy type từ data.media_type hoặc prop truyền xuống
  const type = data.media_type || mediaType;
  const cardName = type === "movie" ? data.title : data.name;
  const releaseDate = type === "movie" ? data.release_date : data.first_air_date;

  // Kiểm tra xem phim đã trong favorites chưa
  const isFavorite = favorites.some(
    (item) => item.id === id && item.media_type === type
  );

  const handleFavorite = async (e) => {
    e.preventDefault(); // Ngăn Link redirect khi bấm nút
    await toggleFavorite({ ...data, media_type: type }, isFavorite);
  };

  return (
    <Link to={`/${type}/${id}`} className="rounded-lg border border-slate-800">
      <div className="relative">
        {type === "tv" && (
          <p className="absolute right-0 mt-2 rounded-l-lg bg-[#E50914] p-1 font-bold">
            TV Show
          </p>
        )}

        <ImageComponent
          className="w-full rounded-t-lg"
          src={`https://image.tmdb.org/t/p/w500${poster_path}`}
          alt={cardName}
          width={210}
          height={300}
        />

        {/* ❤️ Nút yêu thích */}
        <button
          onClick={handleFavorite}
          className="absolute top-2 left-2 rounded-full bg-black/60 p-2 hover:bg-red-600"
        >
          {isFavorite ? "💔" : "❤️"}
        </button>

        <div className="px-4 py-2">
          <CircularProgressBar score={vote_average} />
          <p className="absolute bottom-[20%] right-[1vw] grid w-9 place-items-center rounded-md bg-slate-700 px-2">
            {original_language}
          </p>
          <h3 className="mt-2 font-bold">{cardName}</h3>
          <p className="text-slate-300">{releaseDate}</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
