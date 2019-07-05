const io = require('socket.io-client');

const socket = io.connect('http://localhost:3000');

socket.on('error', function(err) {
  console.log('received socket error:');
  console.log(err);
});
