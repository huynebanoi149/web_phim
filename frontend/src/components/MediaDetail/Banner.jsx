import React, { useState } from "react";
import CircularProgressBar from "../MediaList/CircularProgressBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { groupBy } from "lodash";
import { faPlay, faTimes } from "@fortawesome/free-solid-svg-icons";
import Image from "../Image";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Banner = ({ mediaDetail }) => {
  const {
    backdrop_path,
    poster_path,
    title,
    overview,
    release_dates,
    release_date,
    genres,
    vote_average,
    credits,
    name,
    videos,
  } = mediaDetail;

  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [showTrailer, setShowTrailer] = useState(false);

  const certification =
    release_dates?.results?.find((nation) => nation.iso_3166_1 === "US")
      ?.release_dates?.[0]?.certification || "R";

  const crews = (credits?.crew || [])
    .filter((crew) => ["Director", "Screenplay", "Writer"].includes(crew.job))
    .map((crew) => ({ id: crew.id, job: crew.job, name: crew.name }));

  const groupedCrews = groupBy(crews, "job");

  const trailerUrl = videos?.find(
    (vid) => vid.type === "Trailer" && vid.site === "YouTube"
  )?.url;

  const getYoutubeKey = (url) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtube.com")) {
        return u.searchParams.get("v");
      }
      if (u.hostname.includes("youtu.be")) {
        return u.pathname.replace("/", "");
      }
      return null;
    } catch {
      return null;
    }
  };

  const trailerKey = trailerUrl ? getYoutubeKey(trailerUrl) : null;

  return (
    <div className="relative">
      <img
        className="top-0 brightness-[0.3] relative"
        src={`https://image.tmdb.org/t/p/original${backdrop_path}`}
        alt=""
      />
      <div className="absolute top-0 left-0 right-0 mx-auto flex max-w-screen-xl gap-6 p-6 text-white">
        <div className="flex-1">
          <Image
            className="w-full rounded-xl"
            src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${poster_path}`}
            alt=""
            width={600}
            height={900}
          />
        </div>
        <div className="flex-[2] text-[1.8vw]">
          <h2 className="text-[3vw] font-bold">{title || name}</h2>
          <div className="flex gap-4 text-gray-200">
            <p className="border-2 border-white px-1">{certification}</p>
            <p>{release_date}</p>
            <p>{(genres || []).map((genre) => genre.name).join(", ")}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="mt-[3vw] flex">
              <CircularProgressBar score={vote_average} />
            </div>

            {/* Nút xem phim: yêu cầu login */}
            <button
              onClick={() => {
                if (!user) {
                  alert("Bạn cần đăng nhập để xem phim!");
                  navigate("/login");
                  return;
                }
                navigate(`/watch/${id}`);
              }}
              className="rounded-full bg-[#E50914] px-[2vw] py-[0.5vw] text-white 
                hover:bg-black hover:text-[#E50914] transition duration-300"
            >
              <FontAwesomeIcon icon={faPlay} /> Xem Phim
            </button>

            {/* Nút xem trailer: không cần login */}
            <button
              onClick={() => {
                if (trailerKey) {
                  setShowTrailer(true);
                } else {
                  alert("Hiện chưa có trailer cho phim này!");
                }
              }}
              className="rounded-full bg-[#E50914] px-[2vw] py-[0.5vw] text-white 
                hover:bg-black hover:text-[#E50914] transition duration-300"
            >
              <FontAwesomeIcon icon={faPlay} /> Xem Trailer
            </button>
          </div>

          <h3 className="text-[2vw] font-bold">Overview</h3>
          <p>{overview}</p>
          <div className="flex gap-6">
            {Object.keys(groupedCrews).map((job) => (
              <div key={job}>
                <h4 className="text-[1.5vw] font-semibold">{job}</h4>
                <p>{groupedCrews[job].map((crew) => crew.name).join(", ")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Trailer */}
      {showTrailer && trailerKey && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative w-[80%] h-[80%]">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-10 right-0 text-white text-3xl"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;
