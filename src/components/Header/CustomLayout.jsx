import React from 'react';
import { Layout } from 'antd';
import CustomHeader from './Header';

const { Sider, Content } = Layout;

const CustomLayout = () => {
  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={200} style={{ background: '#fff' }} />
      <Layout>
        <CustomHeader title="Crear Paciente" />
        <Content style={{ padding: '24px', minHeight: 280 }}>{}</Content>
      </Layout>
    </Layout>
  );
};

export default CustomLayout;
