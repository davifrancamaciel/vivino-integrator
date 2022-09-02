import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Container } from './styles';
// import logo from 'assets/loading.gif';

const SuspenseLoading: React.FC = () => (
  <Container>
    <LoadingOutlined />
    {/* <img src={logo} style={{ maxWidth: '300px' }} /> */}
  </Container>
);

export default SuspenseLoading;
