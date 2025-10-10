import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import cors from "cors";
import movieRoutes from './routes/movieRoutes.js';  
import genreRoutes from "./routes/genreRoutes.js";
import favoriteRoutes from './routes/favoriteRoutes.js';
import commentRoutes from './routes/commentRoutes.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use('/api/movies', movieRoutes);
app.use("/api/genres", genreRoutes)
app.use('/api/favorites', favoriteRoutes); 
app.use('/api/comments', commentRoutes);



const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy trên cổng ${PORT}`);
});
