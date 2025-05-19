import React from 'react';
import estilo from './patients.module.css';
import CustomButton from '../../../components/Button/CustomButtom';
import CustomSearch from '../../../components/Search/CustomSearch';
import ModeloTable from '../../../components/Table/Tabla';
import patientsMock from '../../../mock/Patients';
import { Space, Button } from 'antd';
import { useNavigate } from 'react-router';

export default function Patients() {
  const navigate = useNavigate();
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

  const patientData = patientsMock[0].items;

  const handleButton = () => {
    navigate('registrar');
  };

  const handleSearch = (value) => {
    console.log('Búsqueda:', value);
    // Aquí puedes implementar la lógica de filtrado
  };

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
    <div
      style={{
        height: '100%',
        paddingTop: '50px',
        maxWidth: 'calc(100% - 200px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          margin: '0 auto',
        }}
      >
        <CustomButton text="Crear Paciente" onClick={handleButton} />

        <CustomSearch
          placeholder="Buscar por Apellido/Nombre o DNI..."
          onSearch={handleSearch}
          width="100%"
        />
      </div>

      <ModeloTable
        columns={columns}
        data={patientData}
        customActions={customActionButtons}
      />
    </div>
  );
}
