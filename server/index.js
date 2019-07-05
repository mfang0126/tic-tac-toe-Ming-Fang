const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');

const sockets = require('./socket');
const routes = require('./routes');
const redisDB = require('./db');

const port = process.env.PORT || 3000;
const host = `localhost`;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const server = http.Server(app);

const socket = socketio(server);
sockets(socket, redisDB());
routes(app, redisDB());

server.listen(port, host, () => {
  console.log(`Listening on http://${host}:${port}`);
});
