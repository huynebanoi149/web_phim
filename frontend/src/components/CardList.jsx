import React from "react";
import MovieCard from "./MovieCard";

const CardList = ({ data, mediaType }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {(data || []).map((card) => (
        <MovieCard data={card} mediaType={mediaType} key={card._id}/>
      ))}
    </div>
  );
};

export default CardList;
