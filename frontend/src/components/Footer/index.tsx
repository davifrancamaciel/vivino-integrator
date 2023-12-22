import React from 'react';
import { Container } from './styles';
import WhatsApp from 'components/WhatsApp';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const version = process.env.REACT_APP_VERSION;
  return (
    <Container>
      <WhatsApp
        phone="5524993954479"
        text={`Davi Maciel © ${year} versão ${version}`}
      />
    </Container>
  );
};

export default Footer;
