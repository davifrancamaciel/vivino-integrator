import React from 'react';
import { Layout } from 'antd';
import Header from 'components/Header';
import Menu from 'components/Menu';
import Footer from 'components/Footer';
import Environment from 'components/Environment';

const { Content } = Layout;

const Default: React.FC = (props) => (
  <Layout style={{ minHeight: '100vh' }}>
    <Layout>
      <Header />
      <Layout>
        <Menu {...props} />
        <Content style={{ padding: 12 }}>
          <Environment />
          {props.children}
        </Content>
      </Layout>
      <Footer />
    </Layout>
  </Layout>
);

export default Default;
