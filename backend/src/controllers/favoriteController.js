import User from "../models/User.js";
import Movie from "../models/Movie.js";

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const movieId = Number(req.params.movieId);

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const user = await User.findById(req.user.id);

    if (!user.favorites.includes(movieId)) {
      user.favorites.push(movieId);
      await user.save();
    }

    await user.populate("favorites");
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xoá phim khỏi danh sách yêu thích
export const removeFavorite = async (req, res) => {
  try {
    const movieId = Number(req.params.movieId);

    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter((id) => id !== movieId);

    await user.save();
    await user.populate("favorites");
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
