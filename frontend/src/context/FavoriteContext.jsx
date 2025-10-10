import { createContext, useContext, useState, useEffect } from "react";
import { addFavorite, removeFavorite, getFavorites } from "../libs/api";
import { useAuth } from "./AuthContext";

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const { token } = useAuth(); 
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (token) {
      getFavorites()
        .then((res) => {
          if (Array.isArray(res)) {
            setFavorites(res);
          } else if (res.favorites) {
            setFavorites(res.favorites);
          } else {
            setFavorites([]);
          }
        })
        .catch(() => setFavorites([]));
    } else {
      setFavorites([]); 
    }
  }, [token]); 

  const toggleFavorite = async (movie) => {
    const movieId = Number(movie._id || movie.id);
    const isFav = favorites.some(
      (f) => Number(f._id || f.id) === movieId
    );

    try {
      if (isFav) {
        await removeFavorite(movieId);
      } else {
        await addFavorite(movieId);
      }
      const updated = await getFavorites();
      setFavorites(Array.isArray(updated) ? updated : updated.favorites || []);
    } catch (err) {
      console.error("❌ API error:", err);
    }
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext);
