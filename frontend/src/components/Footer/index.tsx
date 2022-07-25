import React from 'react';
import { Container } from './styles';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const version = process.env.REACT_APP_VERSION;
  return (
    <Container>
      <a href="https://api.whatsapp.com/send?phone=5524993954479" target={'_blank'}>
        Davi Maciel ©{`${year} versão ${version}`}
      </a>
    </Container>
  );
};

export default Footer;
