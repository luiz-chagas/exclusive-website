import debug from 'debug';
import http from 'http';
import io from 'socket.io';
import { app } from './express';
import { makeQueueService } from './services/queue';

debug('exclusive-api:server');

const port = Number(process.env.PORT) || 8080;
app.set('port', port);

const server = http.createServer(app);
const socketServer = io(server, {
  transports: ['websocket'],
});

makeQueueService(socketServer);

const onError = (error: any) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
  debug('Listening on ' + bind);
};

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
