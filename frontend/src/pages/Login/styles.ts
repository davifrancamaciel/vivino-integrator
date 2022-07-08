import styled from 'styled-components';
import { systemColors } from 'utils/defaultValues';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  min-height: 80vh;
  img {
    margin-bottom: 20px;
    height: 47px;
  }
`;

export const Content = styled.div`
  box-shadow: 0px 6px 20px #99999933;
  border-radius: 10px;
  background: #fff;
  padding: 50px;

  width: 100%;
  max-width: 450px;
  text-align: center;
  place-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 470px) {
    padding: 50px 20px;
  }
`;
export const Form = styled.form`
  grid-gap: 15px;
  display: grid;
  width: 100%;
  button {
    margin: 0 auto;
  }
  > h1 {
    font-weight: bold;
    font-size: 20px;
    color: ${systemColors.GREY};
  }
`;
