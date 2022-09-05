import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  DashboardOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import { Auth } from 'aws-amplify';

import { checkRouleProfileAccess } from 'utils/checkRouleProfileAccess';
import { appRoutes, roules } from 'utils/defaultValues';
import { useAppContext } from 'hooks/contextLib';

const { SubMenu } = Menu;
const { Sider } = Layout;

const SliderMenu: React.FC = (props: any) => {
  const { collapsed, width } = useAppContext();
  const [groupsUser, setGroupsUser] = useState<string[]>([]);

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async () => {
    try {
      const userAuth = await Auth.currentAuthenticatedUser();
      setGroupsUser(
        userAuth.signInUserSession.accessToken.payload['cognito:groups']
      );
    } catch (e) {
      if (e !== 'No current user' && e !== 'The user is not authenticated') {
        console.log(e);
      }
    }
  };

  return (
    <Sider
      width={230}
      collapsedWidth={width < 650 ? 0 : 80}
      collapsible
      trigger={null}
      collapsed={collapsed}
    >
      <Menu
        mode="inline"
        selectedKeys={[props?.location.pathname]}
        defaultOpenKeys={
          width < 650 ? [] : [`sub-/${props?.location.pathname.split('/')[1]}`]
        }
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key={'/'} icon={<DashboardOutlined />}>
          <Link to={'/'}>Dashboard</Link>
        </Menu.Item>

        {checkRouleProfileAccess(groupsUser, roules.products) && (
          <SubMenu
            key={`sub-/${appRoutes.products}`}
            title={'Produtos'}
            icon={<UnorderedListOutlined />}
          >
            <Menu.Item key={`/${appRoutes.products}`}>
              <Link to={`/${appRoutes.products}`}>Lista</Link>
            </Menu.Item>
            <Menu.Item key={`/${appRoutes.products}/create`}>
              <Link to={`/${appRoutes.products}/create`}>Novo</Link>
            </Menu.Item>
          </SubMenu>
        )}

        {checkRouleProfileAccess(groupsUser, roules.romanians) && (
          <SubMenu
            key={`sub-/${appRoutes.romanians}`}
            title={'Romaneios'}
            icon={<UnorderedListOutlined />}
          >
            <Menu.Item key={`/${appRoutes.romanians}`}>
              <Link to={`/${appRoutes.romanians}`}>Lista</Link>
            </Menu.Item>
            <Menu.Item key={`/${appRoutes.romanians}/create`}>
              <Link to={`/${appRoutes.romanians}/create`}>Novo</Link>
            </Menu.Item>
          </SubMenu>
        )}

        {checkRouleProfileAccess(groupsUser, roules.users) && (
          <SubMenu
            key={`sub-/${appRoutes.users}`}
            title="Usuários"
            icon={<UserOutlined />}
          >
            <Menu.Item key={`/${appRoutes.users}`}>
              <Link to={`/${appRoutes.users}`}>Lista</Link>
            </Menu.Item>
            <Menu.Item key={`/${appRoutes.users}/create`}>
              <Link to={`/${appRoutes.users}/create`}>Novo</Link>
            </Menu.Item>
          </SubMenu>
        )}
      </Menu>
    </Sider>
  );
};

export default SliderMenu;
