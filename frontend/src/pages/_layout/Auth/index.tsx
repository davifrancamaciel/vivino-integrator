import React from 'react';
import { Layout } from 'antd';
import Footer from 'components/Footer';

const { Content } = Layout;

const AuthLayout: React.FC = (props) => (
  <Layout style={{ minHeight: '100vh' }}>
    <Layout>
      <Content style={{ padding: '15px' }}>{props.children}</Content>
      <Footer />
    </Layout>
  </Layout>
);

export default AuthLayout;
