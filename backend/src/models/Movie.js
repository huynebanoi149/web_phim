import mongoose from "mongoose";
import Counter from "./Counter.js";

// Định nghĩa schema cho Movie
const movieSchema = new mongoose.Schema(
  {
    _id: { type: Number },  // Sử dụng id từ TMDb hoặc auto-increment nếu không có
    imdb_id: String,
    media_type: { type: String, enum: ["movie", "tv"], default: "movie" },

    title: String,
    name: String,
    original_title: String,
    original_name: String,
    overview: String,

    release_date: String,
    first_air_date: String,

    runtime: Number,
    episode_run_time: [Number],

    genres: [{ id: Number, name: String }],

    poster_path: String,
    backdrop_path: String,

    popularity: { type: Number, default: 0 },
    vote_average: { type: Number, default: 0 },
    vote_count: { type: Number, default: 0 },

    belongs_to_collection: mongoose.Schema.Types.Mixed,
    production_companies: [
      { id: Number, name: String, logo_path: String, origin_country: String }
    ],
    production_countries: [{ iso_3166_1: String, name: String }],
    spoken_languages: [
      { iso_639_1: String, english_name: String, name: String }
    ],

    status: { type: String, default: "Planned" },
    homepage: String,
    revenue: { type: Number, default: 0 },
    budget: { type: Number, default: 0 },

    created_by_admin: { type: Boolean, default: false },
    is_featured: { type: Boolean, default: false },
    tags: [String],

    videos: [mongoose.Schema.Types.Mixed],
  },
  { timestamps: true, versionKey: false }
);

movieSchema.virtual("id").get(function () {
  return this._id;
});
movieSchema.set("toJSON", { virtuals: true });

movieSchema.pre("save", async function (next) {
  if (this.isNew && !this._id) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: "movies" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this._id = counter.seq;
    } catch (err) {
      return next(err);
    }
  }

  if (!this.original_title) this.original_title = this.title || this.name;
  if (!this.original_name && this.name) this.original_name = this.name;

  if (!this.production_countries || this.production_countries.length === 0) {
    this.production_countries = [{ iso_3166_1: "VN", name: "Vietnam" }];
  }

  if (!this.spoken_languages || this.spoken_languages.length === 0) {
    this.spoken_languages = [
      { iso_639_1: "vi", english_name: "Vietnamese", name: "Tiếng Việt" }
    ];
  }

  if (this.revenue == null) this.revenue = 0;
  if (this.budget == null) this.budget = 0;
  if (!this.status) this.status = "Planned";
  if (this.popularity == null) this.popularity = 0;
  if (this.vote_average == null) this.vote_average = 0;
  if (this.vote_count == null) this.vote_count = 0;

  next();
});

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
