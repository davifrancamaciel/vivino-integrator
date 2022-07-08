import React from 'react';

import { Container } from './styles';

const Environment: React.FC = () => {
  const show = window.location.href.includes('dev');
  return show ? <Container>Ambiente de desenvolvimento</Container> : null;
};

export default Environment;
