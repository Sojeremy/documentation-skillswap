import 'dotenv/config';
import http from 'http';
import { config } from './config.ts';
import { app } from './src/app.ts';
import { initSocket } from './src/realtime/socket.ts';

const server = http.createServer(app);

// Attach Socket.IO to the same HTTP server
initSocket(server);

server.listen(config.port, () => {
  console.log(`Server started at http://localhost:${config.port}`);
});
