import { Server } from 'socket.io';

export const makeQueueService = (socketServer: Server) => {
  let queue: string[] = [];

  let nextUserTimer: NodeJS.Timeout | number | null = null;
  let currUser: string | null = '';

  const addToQueue = (socketId: string) => {
    queue.push(socketId);
    if (!currUser) {
      allowNextUser();
    }
  };

  const updatePositions = () => {
    Object.values(socketServer.sockets.sockets).forEach((socket) => {
      const nextState = {
        type: 'queue',
        position: getQueuePosition(socket.id) + 1,
      };
      socket.emit('stateUpdate', nextState);
    });
  };

  const removeFromQueue = (socketId: string) => {
    queue = queue.filter((id) => id !== socketId);
  };

  const allowNextUser = () => {
    if (nextUserTimer) {
      clearInterval(nextUserTimer as NodeJS.Timeout);
    }
    if (currUser) {
      if (Object.keys(socketServer.sockets.sockets).includes(currUser)) {
        const nextState = {
          type: 'bye',
          position: 0,
        };
        socketServer.sockets.sockets[currUser].emit('stateUpdate', nextState);
        socketServer.sockets.sockets[currUser].disconnect();
      }
    }
    if (queue.length) {
      currUser = queue.shift() as string;
      updatePositions();
      nextUserTimer = setTimeout(
        allowNextUser,
        ((10 * 1000) as unknown) as NodeJS.Timeout
      );
      const nextState = {
        type: 'up',
        position: 0,
      };
      socketServer.sockets.sockets[currUser].emit('stateUpdate', nextState);
    } else {
      currUser = null;
    }
  };

  const getQueuePosition = (socketId: string) => queue.indexOf(socketId);

  socketServer.on('connect', (socket) => {
    if (!socket.request.headers.origin) {
      return;
    }

    if (!queue.includes(socket.id)) {
      const nextState = {
        type: 'queue',
        position: queue.length + 1,
      };
      socket.emit('stateUpdate', nextState);
      addToQueue(socket.id);
    }

    socket.on('disconnect', () => {
      removeFromQueue(socket.id);
    });

    socket.on('error', () => {
      removeFromQueue(socket.id);
    });
  });

  return;
};
