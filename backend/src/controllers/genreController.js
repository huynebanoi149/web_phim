import Genre from "../models/Genre.js";

// Lấy danh sách genres
export const getGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    res.json({ genres });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm genre mới 
export const createGenre = async (req, res) => {
  try {
    const genre = new Genre(req.body);
    await genre.save();
    res.status(201).json(genre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Sửa genre
export const updateGenre = async (req, res) => {
  try {
    const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!genre) return res.status(404).json({ message: "Không tìm thấy genre" });
    res.json(genre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa genre
export const deleteGenre = async (req, res) => {
  try {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) return res.status(404).json({ message: "Không tìm thấy genre" });
    res.json({ message: "Đã xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
