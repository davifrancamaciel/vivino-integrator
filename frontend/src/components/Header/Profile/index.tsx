import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, Menu, Avatar, Dropdown } from 'antd';
import { systemColors } from 'utils/defaultValues';
import { DownOutlined, LoginOutlined, LockOutlined } from '@ant-design/icons';
import { Auth } from 'aws-amplify';

interface PropTypes {
  name?: string;
}

const Profile: React.FC<PropTypes> = ({ name }) => {
  const history = useHistory();
  const handleMenuClick = (e: any) => {
    switch (e.key) {
      case '2':
        handleLogout();
        break;

      default:
        break;
    }
  };
  const handleLogout = async () => {
    await Auth.signOut();
    history.push('/login');
  };
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1" icon={<LockOutlined />}>
        <Link to={'/change-password'}>Alterar senha</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<LoginOutlined />}>
        Sair
      </Menu.Item>
    </Menu>
  );

  const formatName = (name: string | undefined): string => {
    if (name && name.includes(' ')) {
      return name.split(' ')[0];
    }
    if (name) {
      return name;
    }
    return '';
  };

  return (
    <div>
      <Dropdown overlay={menu}>
        <Button type={'link'}>
          <span style={{ color: systemColors.GREY }}>
            Olá, {formatName(name)}
          </span>{' '}
          <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};

export default Profile;
