import styled from 'styled-components';

import { Layout } from 'antd';
const { Header } = Layout;

export const Container = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fffffff2 0% 0% no-repeat padding-box;
  box-shadow: 0px 6px 20px #99999933;
  color: #999999;
  padding: 0 15px;
  border-bottom: 1px solid #d9d9d9;
`;

export const ContainerMenu = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  height: 100%;
  margin: auto 0px;

  > a {
    display: flex;
    align-items: center;    
  }
`;
export const ContainerProfile = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-gap: 20px;
  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    > span {
      margin-left: 10px;
      white-space: nowrap;
    }
  }
  @media (max-width: 800px) {
    .ant-btn-primary {
      display: none;
    }
  }
`;
