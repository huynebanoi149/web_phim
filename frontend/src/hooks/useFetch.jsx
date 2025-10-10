
import { useEffect, useState } from "react";

const DEFAULT_HEADERS = {
  accept: "application/json",
};

export default function useFetch(
  { url = "", method = "GET", headers = {} },
  enabled = true,
) {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !url) return;

    setIsLoading(true);

    const fullUrl = url.startsWith("http")
      ? url
      : `${import.meta.env.VITE_API_BASE_URL}${url}`;

    fetch(fullUrl, {
  method,
  headers: {
    ...DEFAULT_HEADERS,
    ...headers,
  },
})
  .then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then((res) => setData(res))
  .catch((err) => console.error(err))
  .finally(() => setIsLoading(false));

  }, [url, method, JSON.stringify(headers), enabled]);

  return [isLoading, data, enabled];
}
