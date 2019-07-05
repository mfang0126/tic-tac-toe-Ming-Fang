import styled, { css } from 'styled-components';
import { Times } from 'styled-icons/fa-solid/Times';
import { Circle } from 'styled-icons/fa-regular/Circle';

const svgStyle = css`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  right: 0;
  margin: auto;
`;

const boxStyle = css`
  float: left;
  position: relative;
  border-radius: 12px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  background: #fff;
`;

const shadowStyle = css`
  width: 100%;
  box-sizing: border-box;
  padding: 8px;
  height: 100%;
  ${boxStyle}
`;

const Container = styled.div`
  border-radius: 12px;
  box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.1);
  background: #f9fbfc;
  margin-right: auto;
  margin-left: auto;
  @media (min-width: 576px) {
    width: auto;
  }
  @media (min-width: 768px) {
    width: 750px;
  }
  @media (min-width: 992px) {
    width: 970px;
  }
  @media (min-width: 1200px) {
    width: 1170px;
  }
  :after {
    content: ' ';
    display: block;
    clear: both;
  }
`;

const BoxWrap = styled.div`
  ${shadowStyle}
`;

const ButtonShadow = styled.button`
  ${shadowStyle}
  -webkit-appearance: button;
  text-transform: none;
  border: 0;
  :focus {
    outline:0;
  }
  :hover {
    box-shadow: 0 3px 6px rgba(0,0,0,0.1)
  }
  :active {
    box-shadow: inset 0 3px 6px rgba(0,0,0,0.1)
  }
`;

const TimesIcon = styled(Times)`
  height: 100%;
  ${svgStyle}
`;
const CircleIcon = styled(Circle)`
  height: 80%;
  ${svgStyle}
`;

export { Container, TimesIcon, CircleIcon, BoxWrap, ButtonShadow };
