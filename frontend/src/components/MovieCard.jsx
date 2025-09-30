import React from "react";
import { Link, useNavigate } from "react-router-dom";
import CircularProgressBar from "./MediaList/CircularProgressBar";
import ImageComponent from "./Image";
import { useFavorites } from "../context/FavoriteContext";
import { useAuth } from "../context/AuthContext";

const MovieCard = ({ data, mediaType = "" }) => {
  const { favorites, toggleFavorite } = useFavorites();
  const { poster_path, vote_average, original_language, _id } = data;
  const { user } = useAuth();
  const navigate = useNavigate();

  const type = data.media_type || mediaType;
  const cardName = type === "movie" ? data.title : data.name;
  const releaseDate = type === "movie" ? data.release_date : data.first_air_date;
  const movieId = _id || data.id;
  const isFavorite = favorites.some(
    (f) => Number(f._id || f.id) === Number(movieId)
  );

  const handleFavorite = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Bạn cần đăng nhập để thêm vào yêu thích!");
      navigate("/login");
      return;
    }
    toggleFavorite({ ...data, _id: movieId });
  };

  return (
    <Link to={`/${type}/${_id}`} className="rounded-lg border border-slate-800 relative">
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
        className="absolute top-2 left-2 rounded-full bg-black/60 p-2"
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
    </Link>
  );
};

export default MovieCard;
