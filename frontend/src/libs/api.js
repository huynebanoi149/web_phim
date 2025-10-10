const BASE = import.meta.env.VITE_API_BASE_URL;

export async function api(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ===== API favorites =====
export function addFavorite(movieId) {
  return api(`/favorites/${movieId}`, { method: "POST" });
}

export function removeFavorite(movieId) {
  return api(`/favorites/${movieId}`, { method: "DELETE" });
}

export function getFavorites() {
  return api(`/favorites`, { method: "GET" });
}

// ===== API movies =====
export function getMovies(params = {}) {
  const query = new URLSearchParams(params).toString();
  return api(`/movies?${query}`, { method: "GET" });
}

export function getMovie(id) {
  return api(`/movies/${id}`, { method: "GET" });
}

export function createMovie(data) {
  return api(`/movies`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateMovie(id, data) {
  return api(`/movies/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteMovie(id) {
  return api(`/movies/${id}`, { method: "DELETE" });
}

// ===== API comments =====
export function getComments(movieId) {
  return api(`/comments/${movieId}`, { method: "GET" });
}

export function createComment(movieId, data) {
  return api(`/comments/${movieId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateComment(id, data) {
  return api(`/comments/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteComment(id) {
  return api(`/comments/${id}`, { method: "DELETE" });
}

export function toggleLike(id) {
  return api(`/comments/${id}/like`, { method: "POST" });
}
