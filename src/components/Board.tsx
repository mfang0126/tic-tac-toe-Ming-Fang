import React, { useState, useEffect } from 'react';
import { Container, BoxWrap, TimesIcon, CircleIcon, ButtonShadow } from './Elements';
import Square from './Square';
import styled from 'styled-components';

import io from 'socket.io-client';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
const socket = io(BASE_URL);

const Board = () => {
  const [roomState, setRoom] = useState({
    roomCount: 0,
    emptyRooms: [],
    roomNum: 0
  });
  const { roomCount, emptyRooms } = roomState;
  const SquareIndexs = Array.from(Array(9).keys());

  const [state, setState] = useState({
    history: [{ squares: Array(9).fill(null) }],
    step: 0,
    isCross: true
  });

  const { history, step, isCross } = state;
  const handleClick = (i: number) => {
    const historyNow = history.slice(0, step + 1);
    const now = historyNow[historyNow.length - 1];
    const squares = now.squares.slice();

    socket.emit('send-move', { roomNumber: i, squares });

    socket.on('receive-move', ({ winner }: { winner: "X" | "O" | null }) => {
      console.log(winner);
      if (winner === null) {
        squares[i] = isCross ? "X" : "O";
        setState({
          history: history.concat([{ squares: squares }]),
          step: history.length,
          isCross: !isCross
        });

      } else {
        alert(winner);
        setState({
          history: [{ squares: Array(9).fill(null) }],
          step: 0,
          isCross: true
        })
      }
    });
  }

  const newRoom = () => {
    socket.emit('create-room', { 'test': 9909 });
    socket.on('new-room', (data: any) => {
      const { roomCount, emptyRooms } = data;
      setRoom({ ...roomState, roomCount, emptyRooms });
    });
  }

  const joinRoom = (roomNumber: number) => {
    socket.emit('join-room', { roomNumber });
    socket.on('rooms-available', (data: any) => {
      const { roomCount, emptyRooms } = data;
      setRoom({ ...roomState, roomCount, emptyRooms });
    });
    socket.on('start-game', (data: any) => {
      const roomNum = data.roomNumber
      setRoom({ ...roomState, roomNum });
      console.log(roomNum);
    });

  }

  useEffect(() => {
    axios
      .get(`${BASE_URL}/getRoomStats`)
      .then(({ data }) => {
        const { roomCount, emptyRooms } = data;
        setRoom({ ...roomState, roomCount, emptyRooms })
      })
      .catch(console.error);
  }, []);
  return (
    <>
      <Container>
        <Row>
          <Column percentage={60} style={{ margin: '8px' }}>
            <BoxContainer>
              {SquareIndexs.map((pos, i) => (
                <Square icon={history[step].squares[pos]} onClick={() => handleClick(pos)} key={i} />
              ))}
            </BoxContainer>
          </Column>
          <Column percentage={40} style={{ margin: '16px' }}>
            <BoxWrap>
              <Row>
                <Column percentage={50}>
                  <LabelTitle>Player One</LabelTitle>
                  <SideBox selected={false}><TimesIcon /></SideBox>
                </Column>
                <Column percentage={50}>
                  <LabelTitle>Player Two</LabelTitle>
                  <SideBox selected={false}><CircleIcon /></SideBox>
                </Column>
              </Row>
              <LabelTitle style={{ marginBottom: "16px", marginTop: "24px" }} >All Rooms ({roomCount})</LabelTitle>
              <RoomWrap>
                <ButtonWrap>
                  <ButtonShadow onClick={() => newRoom()} style={{ marginBottom: '8px' }}>
                    <RoomTitle>Create Room</RoomTitle>
                  </ButtonShadow>
                  {emptyRooms.map((roomNumber, index) =>
                    <ButtonShadow onClick={() => joinRoom(roomNumber)} key={index} style={{ margin: '4px 0' }}>
                      <RoomTitle>Join Room {roomNumber}</RoomTitle>
                    </ButtonShadow>)}
                </ButtonWrap>
              </RoomWrap>
            </BoxWrap>
          </Column>
        </Row>
      </Container>
    </>
  );
};

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  padding: 8px;
`;

const Column = styled.div`
  flex: 1 1 ${({ percentage }: { percentage: number }) => percentage || 100}%;
`;

const BoxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const SideBox = styled.div`
  border-radius: 8px;
  min-height: 160px;
  margin: 8px;
  position: relative;
  box-sizing: border-box;
  background: #f9fbfc;
  box-shadow: ${({ selected }: { selected: boolean }) => selected ? '0 3px 6px rgba(0,0,0,0.1)' : 'inset 0 3px 6px rgba(0,0,0,0.1)'};
`;

const RoomWrap = styled.div`
  border-radius: 8px;
  position: relative;
  box-sizing: border-box;
  background: #f9fbfc;
  box-shadow: inset 0 3px 6px rgba(0,0,0,0.1);
  height:322px;
  overflow: auto;
  padding: 16px;
  margin: 16px;
`;

const LabelTitle = styled.div`
  font-family: Roboto;
  text-align: center;
  font-weight: 600;
  font-size: 1.5rem;
  margin-bottom: 12px;
`;

const RoomTitle = styled.div`
  font-family: Roboto;
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
`;

const ButtonWrap = styled.div`
  display: inline-block; 
  width: 100%;
`;

export default Board;
