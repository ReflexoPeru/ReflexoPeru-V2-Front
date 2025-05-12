import React from 'react';
import { Layout } from 'antd';
import CustomHeader from './Header';

const { Sider, Content } = Layout;

const CustomLayout = () => {
  return (
    <>
      <CustomHeader title="Crear Paciente" />
    </>
  );
};

export default CustomLayout;
