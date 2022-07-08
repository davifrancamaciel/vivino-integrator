import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Container } from './styles';

const SuspenseLoading: React.FC = () => (
  <Container>
    <LoadingOutlined />
  </Container>
);

export default SuspenseLoading;
