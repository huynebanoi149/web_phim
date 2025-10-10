import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import mongoose from 'mongoose';
import Movie from '../models/Movie.js';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function run() {
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
  console.log('✅ Mongo connected');

  const key = process.env.TMDB_API_KEY;

  const ids = [];
  for (let page = 1; page <= 3; page++) {
    const { data } = await axios.get('https://api.themoviedb.org/3/discover/movie', {
      params: { api_key: key, sort_by: 'popularity.desc', page, language: 'vi-VN' }
    });
    data.results.forEach(m => ids.push(m.id));
    await sleep(300);
  }

  for (const id of ids) {
    const { data: movieData } = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}`,
      { params: { api_key: key, language: 'vi-VN' } }
    );

    const { data: videoData } = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/videos`,
      { params: { api_key: key, language: 'vi-VN' } }
    );

    await Movie.findByIdAndUpdate(
      movieData.id,
      {
        ...movieData,
        _id: movieData.id,
        media_type: 'movie',
        videos: videoData.results
      },
      { upsert: true, setDefaultsOnInsert: true }
    );

    console.log('✅ Imported', movieData.title);
    await sleep(150);
  }

  console.log('🎉 Seed done');
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
