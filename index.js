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

app.get('/player', (req, res) => {
  res.sendFile(join(__dirname, 'buzzerPlayer.html'));
});

app.get('/host', (req, res) => {
  res.sendFile(join(__dirname, 'buzzerHost.html'));
});

//Socket namespaces
const playerNamespace = ioServer.of('/player');
playerNamespace.on('connection', (ioClient) => {
  ioClient.join('players');
  console.log('player connected');
  ioClient.on('buzzer', (buzzInfo) => {
    playerNamespace.emit('buzzer', buzzInfo);
  });
});

const hostNamespace = ioServer.of('/host');
hostNamespace.on('connection', (ioClient) => {
  console.log('host connected');
  ioClient.on('buzzer', (buzzInfo) => {
    hostNamespace.emit('buzzer', buzzInfo);
  });
  ioClient.on('reset buzzer', (data) => {
    hostNamespace.emit('reset buzzer', data);
  })
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
