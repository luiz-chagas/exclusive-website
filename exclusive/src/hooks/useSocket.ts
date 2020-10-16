import { useEffect, useState } from "react";
import io from "socket.io-client";

export const useSocket = () => {
  const [lastMessage, setLastMessage] = useState("");
  const ioServer = window.location.origin + ":8080";

  useEffect(() => {
    const socket = io(ioServer, {
      transports: ["websocket"],
    });
    socket.on("event", (message: string) => {
      setLastMessage(message);
    });
  }, [ioServer]);

  return { lastMessage };
};
