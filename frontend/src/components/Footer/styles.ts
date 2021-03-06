import styled from 'styled-components';
import { Layout } from 'antd';
const { Footer } = Layout;

export const Container = styled(Footer)`
  border-top: 1px solid #d9d9d9;
  background: #fffffff2 0% 0% no-repeat padding-box;
  text-align: center;
  color: #4ca07a;
  display: flex;
  flex-direction: column;
  align-items: center;
  > .ant-image {
    max-width: 200px;
    display: none;
    margin-bottom: 15px;
    @media (max-width: 800px) {
      display: block;
    }
  }
  > a {
    color: #4ca07a;
  }
`;
