import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import Profile from './Profile';
import CollapseMenu from './CollapseMenu';
import Logo from '../Logo';

import { Container, ContainerMenu, ContainerProfile } from './styles';

const Header: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>();

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async () => {
    try {
      const userAuth = await Auth.currentAuthenticatedUser();
      const { attributes } = userAuth;
      setCurrentUser(attributes);
    } catch (e) {
      if (e != 'No current user' && e != 'The user is not authenticated') {
        console.log(e);
      }
    }
  };
  return (
    <Container>
      <ContainerMenu>
        <Link to={'/'}>
          <Logo />
        </Link>
        <CollapseMenu />
      </ContainerMenu>
      <ContainerProfile>
        <Profile name={currentUser?.name} />
      </ContainerProfile>
    </Container>
  );
};

export default Header;
