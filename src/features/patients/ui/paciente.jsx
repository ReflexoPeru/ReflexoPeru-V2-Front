import React from 'react';
import estilo from './paciente.module.css';
import CustomButton from '../../../components/Button/CustomButtom';
import CustomSearch from '../../../components/Search/CustomSearch';
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

  const handleButton= () => {
    console.log('🩺 Registrar nuevo paciente');
    // Aquí puedes abrir un modal o redirigir a un formulario
  };

  const handleSearch = (value) => {
    console.log('Búsqueda:', value);
    // Aquí puedes implementar la lógica de filtrado
  };
  

  // Botones personalizados
  const customActionButtons = (record) => (
    <Space size="small">
      <Button style={{ backgroundColor: '#0066FF', color: '#fff' }}>Editar</Button>
      <Button style={{ backgroundColor: '#00AA55', color: '#fff' }}>Más Info</Button>
      <Button style={{ backgroundColor: '#8800CC', color: '#fff' }}>Historia</Button>
      <Button style={{ backgroundColor: '#FF3333', color: '#fff' }}>Eliminar</Button>
    </Space>
  );

  return (
    <> 
      <div
        style={{
          display: 'flex',           
          justifyContent: 'space-between', 
          alignItems: 'center',      
          gap: '16px',               
          maxWidth: 'calc(100% - 200px)',
          margin: '0 auto',
          marginBottom: '16px',
        }}
      >
        <CustomButton 
        text="Registrar Paciente" 
        onClick={handleButton} 
        />

        <CustomSearch 
          placeholder="Buscar por Apellido/Nombre o DNI..."
          onSearch={handleSearch}
          width="800px"
        />
      </div>

      <ModeloTable
        columns={columns}
        data={patientData}
        customActions={customActionButtons}
      />
  </>
  );
}
