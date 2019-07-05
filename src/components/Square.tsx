import React from 'react';
import { TimesIcon, CircleIcon } from './Elements';
import styled from 'styled-components';

interface SquareProps {
  icon: 'X' | 'O';
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const SquareBox = styled.div`
  margin: 8px;
  flex: 1 0 30%;
  position: relative;

  border-radius: 12px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  background: #fff;

  :after {
    content: '';
    float: left;
    display: block;
    padding-top: 100%;
  }
`;

const Square = ({ icon, onClick }: SquareProps) => {
  return (
    <SquareBox onClick={onClick}>
      {icon === 'O' && <CircleIcon />}
      {icon === 'X' && <TimesIcon />}
    </SquareBox>
  );
};

export default Square;
