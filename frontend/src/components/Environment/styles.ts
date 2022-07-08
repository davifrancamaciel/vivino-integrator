import styled from 'styled-components';
import { systemColors } from 'utils/defaultValues';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  font-weight: bold;
  color: #fff;
  font-size: 15px;
  background-color: ${systemColors.YELLOW};
  padding: 5px 0;
  margin-bottom: 10px;
`;
