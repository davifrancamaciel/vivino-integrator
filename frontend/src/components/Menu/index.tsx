import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  DashboardOutlined,
  UnorderedListOutlined,
  CloudServerOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  DollarOutlined,
  BarcodeOutlined
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

        {checkRouleProfileAccess(groupsUser, roules.wines) && (
          <SubMenu
            key={`sub-/${appRoutes.wines}`}
            title={'Vinhos'}
            icon={<UnorderedListOutlined />}
          >
            <Menu.Item key={`/${appRoutes.wines}`}>
              <Link to={`/${appRoutes.wines}`}>Lista</Link>
            </Menu.Item>
            <Menu.Item key={`/${appRoutes.wines}/create`}>
              <Link to={`/${appRoutes.wines}/create`}>Novo</Link>
            </Menu.Item>
            <Menu.Item key={`/${appRoutes.wines}/sale-history`}>
              <Link to={`/${appRoutes.wines}/sale-history`}>
                Histórico de vendas
              </Link>
            </Menu.Item>
            <Menu.Item key={`/${appRoutes.wines}/sales`}>
              <Link to={`/${appRoutes.wines}/sales`}>Vendas</Link>
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
        {checkRouleProfileAccess(groupsUser, roules.products) && (
          <SubMenu
            key={`sub-/${appRoutes.categories}`}
            title={'Categorias'}
            icon={<BarcodeOutlined />}
          >
            <Menu.Item key={`/${appRoutes.categories}`}>
              <Link to={`/${appRoutes.categories}`}>Lista</Link>
            </Menu.Item>
            <Menu.Item key={`/${appRoutes.categories}/create`}>
              <Link to={`/${appRoutes.categories}/create`}>Nova</Link>
            </Menu.Item>
          </SubMenu>
        )}
        {checkRouleProfileAccess(groupsUser, roules.products) && (
          <SubMenu
            key={`sub-/${appRoutes.products}`}
            title={'Produtos'}
            icon={<BarcodeOutlined />}
          >
            <Menu.Item key={`/${appRoutes.products}`}>
              <Link to={`/${appRoutes.products}`}>Lista</Link>
            </Menu.Item>
            <Menu.Item key={`/${appRoutes.products}/create`}>
              <Link to={`/${appRoutes.products}/create`}>Novo</Link>
            </Menu.Item>
          </SubMenu>
        )}
        {checkRouleProfileAccess(groupsUser, roules.sales) && (
          <SubMenu
            key={`sub-/${appRoutes.sales}`}
            title={'Vendas'}
            icon={<DollarOutlined />}
          >
            <Menu.Item key={`/${appRoutes.sales}`}>
              <Link to={`/${appRoutes.sales}`}>Lista</Link>
            </Menu.Item>
            <Menu.Item key={`/${appRoutes.sales}/create`}>
              <Link to={`/${appRoutes.sales}/create`}>Nova</Link>
            </Menu.Item>
            <Menu.Item key={`/${appRoutes.sales}/my-commisions`}>
              <Link to={`/${appRoutes.sales}/my-commisions`}>
                Minhas comissões
              </Link>
            </Menu.Item>
          </SubMenu>
        )}
        {checkRouleProfileAccess(groupsUser, roules.expenses) && (
          <SubMenu
            key={`sub-/${appRoutes.expenses}`}
            title={'Despesas'}
            icon={<ArrowDownOutlined />}
          >
            <Menu.Item key={`/${appRoutes.expenses}`}>
              <Link to={`/${appRoutes.expenses}`}>Lista</Link>
            </Menu.Item>
            <Menu.Item key={`/${appRoutes.expenses}/create`}>
              <Link to={`/${appRoutes.expenses}/create`}>Nova</Link>
            </Menu.Item>
          </SubMenu>
        )}

        {checkRouleProfileAccess(groupsUser, roules.users) && (
          <>
            <SubMenu
              key={`sub-/${appRoutes.clients}`}
              title="Clientes"
              icon={<UserOutlined />}
            >
              <Menu.Item key={`/${appRoutes.clients}`}>
                <Link to={`/${appRoutes.clients}`}>Lista</Link>
              </Menu.Item>
              <Menu.Item key={`/${appRoutes.clients}/create`}>
                <Link to={`/${appRoutes.clients}/create`}>Novo</Link>
              </Menu.Item>
            </SubMenu>
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
          </>
        )}
        {checkRouleProfileAccess(groupsUser, roules.administrator) && (
          <>
            <SubMenu
              key={`sub-/${appRoutes.companies}`}
              title={'Empresas'}
              icon={<UnorderedListOutlined />}
            >
              <Menu.Item key={`/${appRoutes.companies}`}>
                <Link to={`/${appRoutes.companies}`}>Lista</Link>
              </Menu.Item>
              <Menu.Item key={`/${appRoutes.companies}/create`}>
                <Link to={`/${appRoutes.companies}/create`}>Nova</Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item
              icon={<CloudServerOutlined />}
              key={`/${appRoutes.services}`}
            >
              <Link to={`/${appRoutes.services}`}>Serviços</Link>
            </Menu.Item>
          </>
        )}
      </Menu>
    </Sider>
  );
};

export default SliderMenu;
