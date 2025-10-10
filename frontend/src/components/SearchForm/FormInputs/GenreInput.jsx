import React, { useEffect } from "react";
import useFetch from "../../../hooks/useFetch";
import { useWatch } from "react-hook-form";

const GenreInput = ({ control, onChange, value = [] }) => {
  const mediaType = useWatch({ name: "mediaType", control });

  const [isLoading, data] = useFetch(
    { url: "http://localhost:5001/api/genres" },
    true
  );

  useEffect(() => {
    onChange([]);
  }, [mediaType]);

  const genres = data?.genres || [];

  return (
    <div className="flex flex-wrap gap-1">
      {genres.map((genre) => (
        <p
          key={genre._id ?? genre.id}
          onClick={() => {
            let newValue = [...value];
            if (newValue.includes(genre.id)) {
              newValue = newValue.filter((g) => g !== genre.id);
            } else {
              newValue = [...newValue, genre.id];
            }
            onChange(newValue);
          }}
          className={`cursor-pointer rounded-lg border px-2 py-1 ${
            value.includes(genre.id) ? "bg-black text-white" : ""
          }`}
        >
          {genre.name}
        </p>
      ))}
    </div>
  );
};

export default GenreInput;
