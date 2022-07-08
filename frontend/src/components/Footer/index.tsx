import React from 'react';
import { Container } from './styles';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const version = process.env.REACT_APP_VERSION;
  return (
    <Container>
      ©{`${year} version ${version}`}
    </Container>
  );
};

export default Footer;
