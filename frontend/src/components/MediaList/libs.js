export const TRENDING_TYPES = [
  { 
  id: "all", 
  title: "All", 
  APIurl: "/movies?sort=-createdAt&limit=12" 
}
,
  { id: "tv", title: "Movies", APIurl: "/movies/popular" }
];

export const TOP_RATED_TYPES = [
  { id: "all", title: "All", APIurl: "/movies" },
  { id: "movie", title: "Movies", APIurl: "/movies?sort=vote_average.desc&limit=12" }
];