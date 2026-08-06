import styled from 'styled-components';

interface ContainerProps {
  color?: string;
  width?: number;
}

export const Header = styled.section`
  gap: 18px;

  display: flex;
  justify-content: space-between;
  @media (max-width: 1300px) {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
  }
  @media (max-width: 1200px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 950px) {
    grid-template-columns: repeat(2, 1fr);
  }
 
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const ContainerCard = styled.div<ContainerProps>`
  background: ${(props) => (props.color ? props.color : '#fff')};
  height: 70px;
  width: ${(props) => (props.width ? props.width : '180')}px;
  display: flex;
  flex-direction: column;
  padding: 8px 15px;
  box-shadow: 0px 6px 20px #99999933;
  position: relative;

  span {
    color: #fff;
    font-size: 17px;
    font-weight: bold;
  }
  > strong {
    color: #fff;
    font-size: 13px;
    margin-top: 10px;
  }
  div {
    position: absolute;
    bottom: 15px;
    right: 15px;
    svg {
      font-size: 40px;
      transition: font-size 0.2s;
      color: rgba(0, 0, 0, 0.15);
    }
  }
  &:hover {
    div {
      svg {
        font-size: 50px;
      }
    }
  }
  @media (max-width: 950px) {
    width: 150px ;
  }
`;
