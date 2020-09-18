import { Server } from 'socket.io';

export const makeQueueService = (socketServer: Server) => {
  let queue: string[] = [];

  let nextUserTimer: NodeJS.Timeout | null = null;
  let currUser: string | null = '';

  const addToQueue = (socketId: string) => {
    queue.push(socketId);
    if (!currUser) {
      allowNextUser();
    }
  };

  const updatePositions = () => {
    Object.values(socketServer.sockets.sockets).forEach((socket) => {
      socket.emit(
        'event',
        `${getQueuePosition(socket.id) + 1} people in front of you...`
      );
    });
  };

  const removeFromQueue = (socketId: string) => {
    queue = queue.filter((id) => id !== socketId);
  };

  const allowNextUser = () => {
    if (nextUserTimer) {
      clearInterval(nextUserTimer);
    }
    if (currUser) {
      if (Object.keys(socketServer.sockets.sockets).includes(currUser)) {
        socketServer.sockets.sockets[currUser].emit('event', 'Good bye!');
        socketServer.sockets.sockets[currUser].disconnect();
      }
    }
    if (queue.length) {
      currUser = queue.shift() as string;
      updatePositions();
      nextUserTimer = setTimeout(allowNextUser, 7 * 1000);
      socketServer.sockets.sockets[currUser].emit('event', 'You are up!');
    } else {
      currUser = null;
    }
  };

  const getQueuePosition = (socketId: string) => queue.indexOf(socketId);

  socketServer.on('connect', (socket) => {
    if (!socket.request.headers.origin) {
      return;
    }

    socket.emit('event', 'Joining queue...');

    if (!queue.includes(socket.id)) {
      socket.emit('event', `${queue.length + 1} people in front of you...`);
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
