import React, { useEffect, useState } from 'react';

import { ArrowUpOutlined } from '@ant-design/icons';
import { Container } from './styles';

const BackToTop: React.FC = () => {
  const [className, setClassName] = useState('');

  useEffect(() => {
    window.addEventListener('scroll', listener);
    return () => {
      window.removeEventListener('scroll', listener);
    };
  }, []);

  const listener = () => setClassName(backToTop(window.scrollY));

  const backToTop = (scrollY: number) => (scrollY >= 500 ? 'show' : '');

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <Container className={className} onClick={scrollTop}>
      <ArrowUpOutlined />
    </Container>
  );
};

export default BackToTop;
