import { useEffect, useState } from "react";
import { ClientState } from "../../types/State";
import io from "socket.io-client";

export const useSocket = () => {
  const [clientState, setClientState] = useState<ClientState>();

  useEffect(() => {
    let socket: SocketIOClient.Socket;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      socket = io("localhost:8080", {
        transports: ["websocket"],
      });
    } else {
      socket = io({
        transports: ["websocket"],
      });
    }
    socket.on("stateUpdate", (message: ClientState) => {
      setClientState(message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { clientState };
};
