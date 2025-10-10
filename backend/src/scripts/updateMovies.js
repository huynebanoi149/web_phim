import dotenv from "dotenv";
import axios from "axios";
import connectDB from "../config/db.js";
import Movie from "../models/Movie.js";

dotenv.config();

const API_KEY = process.env.TMDB_API_KEY;

async function updateMovieExtras(movieId) {
  try {
    const detailRes = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      { params: { api_key: API_KEY, language: "vi-VN" } }
    );

    const { homepage, imdb_id } = detailRes.data;

    const videoRes = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/videos`,
      { params: { api_key: API_KEY, language: "vi-VN" } }
    );

    const trailers = videoRes.data.results
      .filter((v) => v.type === "Trailer" && v.site === "YouTube")
      .map((v) => ({
        name: v.name,
        url: `https://www.youtube.com/watch?v=${v.key}`,
        site: v.site,
        type: v.type,
      }));

    await Movie.updateOne(
      { _id: movieId },
      {
        $set: {
          homepage: homepage || "",
          imdb_id: imdb_id || "",
          videos: trailers,
        },
      }
    );

    console.log(`✅ Cập nhật thành công phim ${movieId}`);
  } catch (err) {
    console.error(`❌ Lỗi khi cập nhật phim ${movieId}:`, err.message);
  }
}

async function run() {
  await connectDB();

  const movies = await Movie.find({});
  console.log(`🎬 Tìm thấy ${movies.length} phim, bắt đầu cập nhật...`);

  for (const m of movies) {
    await updateMovieExtras(m._id);
  }

  console.log("🎉 Hoàn tất cập nhật tất cả phim!");
  process.exit();
}

run();
