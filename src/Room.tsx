import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
const socket = io(BASE_URL);

const Room = () => {
  const [roomState, setRoom] = useState({
    roomCount: 0,
    emptyRooms: []
  });
  const { roomCount, emptyRooms } = roomState;

  const newRoom = () => {
    // this.myTurn = true;
    // this.whoWillStart = true;
    // this.whoseTurn = 'X';
    socket.emit('create-room', { 'test': 9909 });
    socket.on('new-room', (data: any) => {
      const { roomCount, emptyRooms } = data;
      setRoom({ roomCount, emptyRooms })
    });
  }

  const joinRoom = (roomNumber: number) => {
    // this.myTurn = false;
    // this.whoWillStart = false;
    // this.whoseTurn = 'O';
    socket.emit('join-room', { 'roomNumber': roomNumber });
  }

  useEffect(() => {
    axios
      .get(`${BASE_URL}/getRoomStats`)
      .then(({ data }) => {
        const { roomCount, emptyRooms } = data;
        setRoom({ roomCount, emptyRooms })
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <h3>{roomCount} rooms are available to join.</h3>
      {emptyRooms.map((roomNumber, index) => <button onClick={() => joinRoom(roomNumber)} key={index}>Room {roomNumber}</button>)}
      <button onClick={() => newRoom()}>Create New Room</button>
    </>
  );
};

export default Room;
