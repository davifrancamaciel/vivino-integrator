import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 16px;
  max-width: 100%;
`;

export const Footer = styled.div`
  text-align: right;
  @media (max-width: 800px) {
    text-align: center;
  }
`;

export const Header = styled.div`
  justify-content: space-between;
  display: flex;
  align-items: baseline;

  > span {
    font-weight: bold;
  }
`;

export const HeaderButtom = styled.div`
  justify-content: space-between;
  display: flex;
  align-items: baseline;

  > a {
    margin-left: 15px;
  }
  @media (max-width: 650px) {
    display: block;
    > a {
      margin-left: 0px;
    }
  }
`;
