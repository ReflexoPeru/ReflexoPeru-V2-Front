import { Button, Space } from 'antd';
import { useNavigate } from 'react-router';
import CustomButton from '../../../components/Button/CustomButtom';
import CustomSearch from '../../../components/Search/CustomSearch';
import ModeloTable from '../../../components/Table/Tabla';
import { useStaff } from '../hook/staffHook';
import { useState } from 'react';
import EditTherapist from './EditTherapist/EditTherapist';

export default function Staff() {
  const navigate = useNavigate();
  const {
    staff,
    loading,
    pagination,
    handlePageChange,
    setSearchTerm,
    handleDeleteTherapist,
  } = useStaff();
  const [editingTherapist, setEditingTherapist] = useState(null);

  const handleAction = (action, record) => {
    switch (action) {
      case 'edit':
        setEditingTherapist(record);
        break;
      case 'info':
        navigate(`info/${record.id}`);
        break;
      case 'delete':
        handleDeleteTherapist(record.id);
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
      title: 'Documento',
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
            style={{
              backgroundColor: '#0066FF',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => handleAction('edit', record)}
          >
            Editar
          </Button>
          {/*           <Button
            style={{
              backgroundColor: '#00AA55',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => handleAction('info', record)}
          >
            Más Info
          </Button> */}
          <Button
            style={{
              backgroundColor: '#FF3333',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => handleAction('delete', record)}
          >
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

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
        <CustomButton text="Crear Terapeuta" onClick={handleButton} />

        <CustomSearch
          placeholder="Buscar por Apellido/Nombre o DNI..."
          onSearch={handleSearch}
          width="100%"
        />
      </div>

      <ModeloTable
        columns={columns}
        data={staff}
        loading={loading}
        pagination={{
          current: pagination.currentPage,
          total: pagination.totalItems,
          pageSize: 50,
          onChange: handlePageChange,
        }}
      />

      {editingTherapist && (
        <EditTherapist
          therapist={editingTherapist}
          onClose={() => setEditingTherapist(null)}
        />
      )}
    </div>
  );
}
