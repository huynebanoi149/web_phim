import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import FormField from "./FormField";
import MediaTypeInput from "./FormInputs/MediaTypeInput";
import GenreInput from "./FormInputs/GenreInput";
import RatingInput from "./FormInputs/RatingInput";
import { useSearchParams } from "react-router-dom";

const SearchForm = ({ setSearchFormValue }) => {
  const [searchParams] = useSearchParams();
  const typeViaParam = searchParams.get("media_type");



  const { control, watch } = useForm({
    defaultValues: {
      mediaType: "movie",
      genres: [],
      rating: "all",
    },
  });

  const newest = watch();
  useEffect(() => {
    setSearchFormValue(newest);
  }, [JSON.stringify(newest)]);
  return (
    <form action="" className="rounded-lg border p-4 shadow-md">

      <FormField
        name="genres"
        label={"Genres"}
        control={control}
        Component={GenreInput}
      />
      <FormField
        name="rating"
        label={"Rating"}
        control={control}
        Component={RatingInput}
      />
    </form>
  );
};

export default SearchForm;
