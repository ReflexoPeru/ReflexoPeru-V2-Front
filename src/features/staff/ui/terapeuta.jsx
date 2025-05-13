import React from 'react';
import estilo from './terapeuta.module.css';
import ModeloTable from '../../../components/Table/Tabla';
import Staff from '../../../mock/Staff';
import { Space, Button } from 'antd';

export default function Terapeuta() {
  const columns = [
    {
      title: 'Documento',
      dataIndex: 'nroDocument',
      key: 'nroDocument',
      width: '110px',
    },
    {
      title: 'Apellido Parterno',
      dataIndex: 'lastnamePaternal',
      key: 'lastnamePaternal',
    },
    {
      title: 'Apellido Materno',
      dataIndex: 'lastnameMaternal',
      key: 'lastnameMaternal',
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  const staffData = Staff[0].items;

  // Botones personalizados
  const customActionButtons = (record) => (
    <Space size="small">
      <Button style={{ backgroundColor: '#0066FF', color: '#fff' }}>
        Editar
      </Button>
      <Button style={{ backgroundColor: '#00AA55', color: '#fff' }}>
        Más Info
      </Button>
      <Button style={{ backgroundColor: '#FF3333', color: '#fff' }}>
        Eliminar
      </Button>
    </Space>
  );

  return (
    <>
      <ModeloTable
        columns={columns}
        data={staffData}
        customActions={customActionButtons}
      />
    </>
  );
}
