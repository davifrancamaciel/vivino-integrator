import React, { useState } from 'react';
import { Router } from 'react-router-dom';
import Routes from 'routes';
import GlobalStyle from 'styles/global';
import history from 'services/browserhistory';
import { AppContext } from 'hooks/contextLib';
import { Group, IOptions } from './utils/commonInterfaces';
import BackToTop from 'components/BackToTop';

const App: React.FC = () => {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<IOptions[]>([]);
  const [width, setWidth] = useState(window.innerWidth);

  const value = {
    isAuthenticated,
    userHasAuthenticated,
    userAuthenticated,
    setUserAuthenticated,
    collapsed,
    setCollapsed,
    groups,
    setGroups,
    users,
    setUsers,
    width,
    setWidth
  } as any;

  return (
    <AppContext.Provider value={value}>
      <Router history={history}>
        <Routes />
        <BackToTop />
        <GlobalStyle />
      </Router>
    </AppContext.Provider>
  );
};

export default App;
