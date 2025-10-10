import React, { useState } from "react";
import MovieCard from "../MovieCard";
import useFetch from "../../hooks/useFetch";

const MediaList = ({ title, types }) => {
  const [mediaType, setMediaType] = useState(types[0].id);

  const url = types.find((type) => type.id === mediaType).APIurl;

  // Gọi API backend
  const [isLoading, data] = useFetch({ url });
  const mediaList = (data?.results || []).slice(0, 12);

  return (
    <div className="bg-black p-[4vw] text-[1.2vw] text-white">
      <div className="flex items-center gap-5">
        <h3 className="text-[2vw] font-bold">{title}</h3>
        <ul className="flex gap-2 rounded border border-white text-[1.2vw] text-xs">
          {types.map((type) => (
            <li
              key={type.id}
              onClick={() => setMediaType(type.id)}
              className={`p-[0.4vw] px-2 ${
                type.id === mediaType ? "rounded bg-white text-black" : ""
              } cursor-pointer`}
            >
              {type.title}
            </li>
          ))}
        </ul>
      </div>

     <div className="grid grid-cols-2 gap-4 pt-10 sm:grid-cols-4 lg:grid-cols-6">
  {mediaList.map((item) => (
    <MovieCard key={item._id ?? item.id} data={item} />
  ))}
</div>

    </div>
  );
};

export default MediaList;
