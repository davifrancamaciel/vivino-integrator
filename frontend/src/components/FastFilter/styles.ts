import styled from 'styled-components';

interface ContainerProps {
  content?: string;
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  justify-content: ${(props) => (props.content ? props.content : 'space-between')};
  align-items: center;
  margin-bottom: 10px;
  color: #4ca07a;
  font-size: 15px;
  strong {
    margin: 0 8px;
    text-transform: uppercase;
  }
  span {
    cursor: pointer;
  }
`;
