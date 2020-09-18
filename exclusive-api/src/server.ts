import debug from 'debug';
import http from 'http';
import io from 'socket.io';
import { app } from './express';
import { makeQueueService } from './services/queue';

debug('exclusive-api:server');

/**
 * Get port from environment and store in Express.
 */

const port = Number(process.env.PORT) || 4000;
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
const socketServer = io(server, {
  transports: ['websocket'],
});

makeQueueService(socketServer);

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error: any) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
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

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
  debug('Listening on ' + bind);
};

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
