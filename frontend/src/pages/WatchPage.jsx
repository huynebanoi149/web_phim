import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovie } from "../libs/api";
import CircularProgressBar from "../components/MediaList/CircularProgressBar";
import RelatedMovie from "../components/MediaDetail/RelatedMovie";
import CommentSection from "../components/MediaDetail/CommentSection";

// Hàm helper chuyển link YouTube/Vimeo sang dạng embed
function getEmbedUrl(url) {
  if (!url) return null;

  // YouTube link
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // YouTube share link: youtu.be
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Vimeo
  if (url.includes("vimeo.com/")) {
    const videoId = url.split("vimeo.com/")[1];
    return `https://player.vimeo.com/video/${videoId}`;
  }

  return null; 
}

export default function WatchPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    getMovie(id).then(setMovie).catch(console.error);
  }, [id]);

  if (!movie) {
    return <p className="text-white p-4">Đang tải phim...</p>;
  }

  // Chuẩn bị link embed nếu có
  const embedUrl = getEmbedUrl(movie.homepage);

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Backdrop */}
      <div className="relative w-full h-[80vh]">
        <img
          src={`${import.meta.env.VITE_IMG_BASE}/original${movie.backdrop_path}`}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

        {/* Overlay content */}
        <div className="relative z-10 max-w-5xl mx-auto h-full flex items-end px-6 md:px-12 pb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-end">
            
            {/* Poster */}
            <div className="w-40 md:w-56 flex-shrink-0">
              <img
                src={`${import.meta.env.VITE_IMAGE_BASE_URL}${movie.poster_path}`}
                alt={movie.title}
                className="w-full rounded-lg shadow-lg"
              />
              <div className="flex items-center justify-center mt-4 gap-2">
                <CircularProgressBar score={movie.vote_average} />
                <span className="text-gray-300 text-sm">Đánh giá</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3">{movie.title}</h1>
              <div className="flex gap-4 text-gray-400 text-sm mb-4">
                <span>{movie.release_date}</span>
                <div className="flex gap-1">
                  {(movie.genres || []).map((g) => (
                    <span key={g.id} className="after:content-[','] last:after:content-none">
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2">Tóm tắt</h3>
              <p className="text-gray-200 leading-relaxed max-w-2xl mb-6">{movie.overview}</p>

              <div className="flex gap-8 text-gray-300 text-sm">
                <div>
                  <h4 className="font-semibold">Quốc gia</h4>
                  <p>{(movie.origin_country || []).join(", ")}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Trạng thái</h4>
                  <p>{movie.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video player */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 my-8">
        {movie.videoUrl ? (
          <video
            controls
            className="w-full rounded-lg shadow-lg"
            src={movie.videoUrl}
          />
        ) : embedUrl ? (
          <div className="w-full h-[70vh]">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-lg w-full h-full"
              title={movie.title}
            />
          </div>
        ) : (
          <p className="text-gray-400">Hiện chưa có link xem phim.</p>
        )}
      </div>

      {/* Related movies */}
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Phim liên quan</h2>
        <RelatedMovie id={id} type="movie" />
      </div>
      <CommentSection movieId={id} />
      {/* Phần bình luận */}
      
    </div>
  );
}
