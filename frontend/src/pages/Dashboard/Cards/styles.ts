import styled from 'styled-components';

export const Header = styled.section`
  margin: 10px 0 25px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 18px;
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 950px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 650px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
  color: #4ca07a;
  font-size: 15px;
  strong {
    margin: 0 8px;
  }
  span {
    cursor: pointer;
  }
`;
