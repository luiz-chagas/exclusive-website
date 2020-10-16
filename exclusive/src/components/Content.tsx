import React from "react";
import { useFetchRandomGif } from "../hooks/useFetchGif";
import { Cutout, Button } from "react95";

export const Content = () => {
  const { data, refetch } = useFetchRandomGif();

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <Button onClick={refetch}>Click Me!</Button>
      </div>
      <Cutout
        style={{ height: "52vh", display: "flex", justifyContent: "center" }}
      >
        {data && (
          <img style={{ maxHeight: "-webkit-fill-available" }} src={data} />
        )}
      </Cutout>
    </>
  );
};
