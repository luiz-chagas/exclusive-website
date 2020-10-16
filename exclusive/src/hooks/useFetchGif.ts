import { useState } from "react";
import { useCallback } from "react";

const API_KEY = "Vw48RedmWoWJH9flsUEI9WYF9S1etzCN";

export const fetchRandomGif = (tag: string) => {
  const url = new URL("https://api.giphy.com/v1/gifs/random");
  url.searchParams.append("api_key", API_KEY);
  url.searchParams.append("tag", tag);
  return fetch(url.toString()).then((res) => res.json());
};

export const useFetchRandomGif = () => {
  const [data, setData] = useState("");

  const refetch = useCallback(async () => {
    const response = await fetchRandomGif("cats");
    setData(response.data.image_original_url);
  }, [setData]);

  return { data, refetch };
};
