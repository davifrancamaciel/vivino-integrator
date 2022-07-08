import React from 'react';
import { Image } from 'antd';
import { Container } from './styles';
import favicon from 'assets/favicon.png';

const Logo: React.FC = () => {
  return (
    <Container>
      <Image src={favicon} preview={false} />
      <span>Integrador</span>
      <span>Vivino</span>
    </Container>
  );
};

export default Logo;
