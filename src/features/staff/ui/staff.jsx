import { Button, Space } from 'antd';
import { useNavigate } from 'react-router';
import CustomButton from '../../../components/Button/CustomButtom';
import CustomSearch from '../../../components/Search/CustomSearch';
import ModeloTable from '../../../components/Table/Tabla';
import { useStaff } from '../hook/staffHook';

export default function Staff() {
  const navigate = useNavigate();

  const { 
    staff, 
    loading, 
    error, 
    pagination, 
    handlePageChange, 
    setSearchTerm,
    handleDeleteTherapist // Asegúrate de incluir esta función en tu hook
  } = useStaff();

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
            type="primary"
            onClick={() => handleAction('edit', record)}
          >
            Editar
          </Button>
          <Button 
            style={{ backgroundColor: '#00AA55', color: '#fff' }}
            onClick={() => handleAction('info', record)}
          >
            Más Info
          </Button>
          <Button 
            danger
            onClick={() => handleAction('delete', record)}
          >
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  const handleAction = (action, record) => {
    switch(action) {
      case 'edit':
        navigate(`editar/${record.id}`);
        break;
      case 'info':
        navigate(`info/${record.id}`);
        break;
      case 'delete':
        if (window.confirm('¿Está seguro de eliminar este terapeuta?')) {
          handleDeleteTherapist(record.id);
        }
        break;
      default:
        break;
    }
  };

  const handleNewTherapist = () => {
    navigate('registrar');
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <CustomButton 
          text="Crear Terapeuta" 
          onClick={handleNewTherapist}
          type="primary"
        />

        <CustomSearch
          placeholder="Buscar por Apellido/Nombre o DNI..."
          onSearch={handleSearch}
          width="400px"
          allowClear
        />
      </div>

      <ModeloTable
        columns={columns}
        data={staff}
        loading={loading}
        pagination={{
          current: pagination.currentPage,
          total: pagination.totalItems,
          pageSize: pagination.pageSize || 10,
          onChange: handlePageChange,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100']
        }}
        scroll={{ x: 800 }}
      />
    </div>
  );
}