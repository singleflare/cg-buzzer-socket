const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
app.use(express.static('public'));
const server = createServer(app);
const ioServer = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

ioServer.on('connection', (ioClient) => {
  ioClient.on('buzzer', (buzzInfo) => {
    ioServer.emit('buzzer', buzzInfo);
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
