import axios from 'axios';
import Movie from '../models/Movie.js';


// Lấy danh sách phim với phân trang, tìm kiếm, sắp xếp
export const list = async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '20', 10);
  const skip = (page - 1) * limit;
  const q = req.query.q?.trim();
  const sort = req.query.sort || '-popularity';

  const filter = {};
  if (q) filter.$or = [{ title: new RegExp(q, 'i') }, { name: new RegExp(q, 'i') }];

  const [total, results] = await Promise.all([
    Movie.countDocuments(filter),
    Movie.find(filter).sort(sort).skip(skip).limit(limit).lean()
  ]);

  res.json({ page, total, results });
};

/** Lấy thông tin 1 phim theo id */
export const getOne = async (req, res) => {
  const doc = await Movie.findById(req.params.id).lean();
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json(doc);
};

// Tạo mới phim (admin)
export const create = async (req, res) => {
  const body = { ...req.body };
  if (body.id && !body._id) body._id = body.id;
  body.created_by_admin = true;
  const doc = await Movie.create(body);
  res.status(201).json(doc);
};

// Cập nhật phim (admin)
export const update = async (req, res) => {
  const doc = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json(doc);
};

// Xoá phim (admin)
export const remove = async (req, res) => {
  const r = await Movie.findByIdAndDelete(req.params.id);
  if (!r) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
};

// Import phim từ TMDb qua id
export const importFromTmdb = async (req, res) => {
  const id = req.params.tmdbId;
  const key = process.env.TMDB_API_KEY;
  try {
    const { data } = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
      params: { api_key: key, language: 'vi-VN' }
    });
    const upsert = await Movie.findByIdAndUpdate(
      data.id,
      { ...data, _id: data.id, media_type: 'movie' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(upsert);
  } catch (e) {
    res.status(400).json({ message: 'TMDb fetch failed', error: e?.response?.data || e.message });
  }
};

// Lấy danh sách phim đề xuất (giả lập)
export const getRecommendations = async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;
  const rec = await Movie.find({ relatedTo: id, type });
  res.json({ results: rec });
};

/** ===== Các endpoint BỔ SUNG ===== */

// Lấy danh sách phim phổ biến
export const popular = async (req, res) => {
  const limit = parseInt(req.query.limit || '20', 10);
  const results = await Movie.find().sort('-popularity').limit(limit).lean();
  res.json({ results });
};

// Lấy trailer, video theo movieId
export const videos = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid movie id' });
    }

    const movie = await Movie.findById(id).lean();
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    res.json({ id: movie._id, results: movie.videos || [] });
  } catch (e) {
    res.status(400).json({ message: 'Cannot fetch videos', error: e.message });
  }
};



// Khám phá phim với bộ lọc nâng cao
export const discover = async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '20', 10);
  const skip = (page - 1) * limit;

  const min = parseFloat(req.query.minRating || '0');
  const max = parseFloat(req.query.maxRating || '10');

  const filter = {
    vote_average: { $gte: min, $lte: max }
  };

  if (req.query.genre) {
    const genreIds = req.query.genre.split(',').map(g => Number(g));
    filter['genres.id'] = { $in: genreIds };
  }

  const [total, results] = await Promise.all([
    Movie.countDocuments(filter),
    Movie.find(filter).sort('-popularity').skip(skip).limit(limit).lean()
  ]);

  res.json({ page, total, results });
};


// Tìm kiếm phim
export const search = async (req, res) => {
  const q = req.query.q?.trim();
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '20', 10);
  const skip = (page - 1) * limit;

  if (!q) {
    return res.status(400).json({ message: 'Query (q) is required' });
  }

  const filter = {
    $or: [
      { title: new RegExp(q, 'i') },
      { name: new RegExp(q, 'i') }
    ]
  };

  const [total, results] = await Promise.all([
    Movie.countDocuments(filter),
    Movie.find(filter).skip(skip).limit(limit).lean()
  ]);

  res.json({ page, total, results });
};



