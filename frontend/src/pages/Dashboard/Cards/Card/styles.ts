import styled from 'styled-components';

interface ContainerProps {
  color?: string;
}

export const Container = styled.div<ContainerProps>`
  background: ${(props) => (props.color ? props.color : '#fff')};
  height: 130px;
  display: flex;
  flex-direction: column;
  padding: 15px;
  box-shadow: 0px 6px 20px #99999933;
  position: relative;

  span {
    color: #fff;
    font-size: 30px;
    font-weight: bold;
  }
  strong {
    color: #fff;
    font-size: 18px;
    margin-top: 15px;
  }
  div {
    position: absolute;
    bottom: 15px;
    right: 15px;
    svg {
      font-size: 70px;
      transition: font-size 0.2s;
      color: rgba(0, 0, 0, 0.15);
    }
  }
  &:hover {
    div {
      svg {
        font-size: 90px;
      }
    }
  }
`;
