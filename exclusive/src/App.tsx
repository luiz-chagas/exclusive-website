import React from "react";
import { useSocket } from "./hooks/useSocket";

export const App = () => {
  const { lastMessage } = useSocket();

  return (
    <div className="container">
      <main>
        <h1 className="title">{lastMessage}</h1>
      </main>
    </div>
  );
};
