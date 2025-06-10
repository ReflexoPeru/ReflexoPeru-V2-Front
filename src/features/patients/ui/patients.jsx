import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Space, Button } from 'antd';
import CustomButton from '../../../components/Button/CustomButtom';
import CustomSearch from '../../../components/Search/CustomSearch';
import ModeloTable from '../../../components/Table/Tabla';
import { usePatients } from '../hook/patientsHook';
import './patients.module.css';

export default function Patients() {
  const navigate = useNavigate();
  const {
    patients,
    loading,
    pagination,
    handlePageChange,
    setSearchTerm,
    handleDeletePatient,
  } = usePatients();

  const handleAction = (action, record) => {
    switch(action) {
      case 'edit':
        navigate(`editar/${record.id}`);
        break;
      case 'info':
        navigate(`info/${record.id}`);
        break;
      case 'history':
        navigate(`historia/${record.id}`);
        break;
      case 'delete':
        handleDeletePatient(record.id);
        break;
      default:
        break;
    }
  };

  const handleButton = () => {
    navigate('registrar');
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const columns = [
    {
      title: 'DNI',
      dataIndex: 'document_number',
      key: 'document_number',
      width: '110px',
    },
    {
      title: 'Nombre',
      dataIndex: 'full_name',
      key: 'name',
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            style={{ backgroundColor: '#0066FF', color: '#fff', border: 'none' }}
            onClick={() => handleAction('edit', record)}
          >
            Editar
          </Button>
          <Button 
            style={{ backgroundColor: '#00AA55', color: '#fff', border: 'none' }}
            onClick={() => handleAction('info', record)}
          >
            Más Info
          </Button>
          <Button 
            style={{ backgroundColor: '#8800CC', color: '#fff', border: 'none' }}
            onClick={() => handleAction('history', record)}
          >
            Historia
          </Button>
          <Button 
            style={{ backgroundColor: '#FF3333', color: '#fff', border: 'none' }}
            onClick={() => handleAction('delete', record)}
          >
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ height: '100%', paddingTop: '50px', maxWidth: 'calc(100% - 200px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '0 auto' }}>
        <CustomButton text="Crear Paciente" onClick={handleButton} />
        <CustomSearch
          placeholder="Buscar por Apellido/Nombre o DNI..."
          onSearch={handleSearch}
          width="100%"
        />
      </div>
      <ModeloTable
        columns={columns}
        data={patients}
        loading={loading}
        pagination={{
          current: pagination.currentPage,
          total: pagination.totalItems,
          pageSize: 50,
          onChange: handlePageChange,
        }}
      />
    </div>
  );
}