const sockets = (io, redisDB) => {
  const winMatrix = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  const getResult = squares =>
    winMatrix.forEach(item => {
      const [a, b, c] = item;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
      return null;
    });

  redisDB.set('roomCount', 1);
  redisDB.set('allRooms', JSON.stringify({ emptyRooms: [1], fullRooms: [] }));

  io.on('connection', socket => {
    socket.setMaxListeners(10);
    socket.on('create-room', () => {
      Promise.all(['roomCount', 'allRooms'].map(key => redisDB.getAsync(key))).then(values => {
        const allRooms = JSON.parse(values[1]);
        const { fullRooms, emptyRooms } = allRooms;
        const preCount = values[0];

        if (!emptyRooms.includes(preCount)) {
          const roomCount = preCount++;

          emptyRooms.push(roomCount);
          socket.join('room-' + roomCount);

          redisDB.set('roomCount', roomCount);
          redisDB.set('allRooms', JSON.stringify({ emptyRooms, fullRooms }));

          io.emit('rooms-available', { roomCount, fullRooms, emptyRooms });
          io.sockets.in('room-' + roomCount).emit('new-room', { roomCount, fullRooms, emptyRooms, roomNumber: roomCount });
        }
      });
      g;
    });

    socket.on('join-room', ({ roomNumber }) => {
      Promise.all(['roomCount', 'allRooms'].map(key => redisDB.getAsync(key))).then(values => {
        const allRooms = JSON.parse(values[1]);
        const roomCount = values[0];
        const { fullRooms, emptyRooms } = allRooms;

        const indexPos = emptyRooms.indexOf(roomNumber);
        if (indexPos > -1) {
          emptyRooms.splice(indexPos, 1);
          fullRooms.push(roomNumber);
        }

        socket.join('room-' + roomNumber);
        redisDB.set('allRooms', JSON.stringify({ emptyRooms, fullRooms }));

        const currentRoom = Object.keys(io.sockets.adapter.sids[socket.id])
          .filter(item => item !== socket.id)[0]
          .split('-')[1];
        io.emit('rooms-available', { roomCount, fullRooms, emptyRooms });
        io.sockets.in('room-' + roomNumber).emit('start-game', { roomCount, fullRooms, emptyRooms, roomNumber: currentRoom });
      });
    });

    socket.on('send-move', data => {
      const { roomNumber, squares } = data;
      const winner = getResult(squares);

      if (winner === null) {
        socket.broadcast.to('room-' + roomNumber).emit('receive-move', {
          winner: null
        });
      } else {
        io.sockets.in('room-' + roomNumber).emit('receive-move', {
          winner
        });
      }
    });

    socket.on('disconnecting', _ => {
      const rooms = Object.keys(socket.rooms);
      const roomNumber = rooms[1] !== undefined && rooms[1] !== null ? rooms[1].split('-')[1] : null;

      if (rooms !== null) {
        Promise.all(['roomCount', 'allRooms'].map(key => redisDB.getAsync(key))).then(values => {
          const { fullRooms, emptyRooms } = JSON.parse(values[1]);
          const preCount = values[0];
          const roomCount = preCount > 1 ? preCount-- : 1;
          const fullRoomsPos = fullRooms.indexOf(parseInt(roomNumber));

          fullRoomsPos > -1 && fullRooms.splice(fullRoomsPos, 1);

          redisDB.set('roomCount', roomCount);
          redisDB.set('allRooms', JSON.stringify({ emptyRooms, fullRooms }));
          io.sockets.in('room-' + roomNumber).emit('room-disconnect', { id: socket.id });
        });
      }
    });
  });
};

module.exports = sockets;
