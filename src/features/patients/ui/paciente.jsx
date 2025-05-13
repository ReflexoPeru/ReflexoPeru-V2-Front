import React from 'react';
import estilo from './paciente.module.css';
import ModeloTable from '../../../components/Table/Tabla';
import patients from '../../../mock/Patients';
import { Space, Button } from 'antd';

export default function Paciente() {
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

  const patientData = patients[0].items;

  // Botones personalizados
  const customActionButtons = (record) => (
    <Space size="small">
      <Button style={{ backgroundColor: '#0066FF', color: '#fff' }}>
        Editar
      </Button>
      <Button style={{ backgroundColor: '#00AA55', color: '#fff' }}>
        Más Info
      </Button>
      <Button style={{ backgroundColor: '#8800CC', color: '#fff' }}>
        Historia
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
        data={patientData}
        customActions={customActionButtons}
      />
    </>
  );
}
