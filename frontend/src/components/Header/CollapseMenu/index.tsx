import React, { useEffect } from 'react';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useAppContext } from 'hooks/contextLib';

import { Container } from './styles';

const CollapseMenu: React.FC = () => {
  const { collapsed, setCollapsed, width, setWidth } = useAppContext();
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    window.innerWidth < 800 && setCollapsed(true);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    width < 800 ? setCollapsed(true) : setCollapsed(false);
  }, [width]);

  return (
    <Container>
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: () => setCollapsed(!collapsed)
      })}
    </Container>
  );
};

export default CollapseMenu;
