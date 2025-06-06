// import StaffMock from '../../../mock/Staff';
import { Button, Space } from 'antd';
import { useNavigate } from 'react-router';
import CustomButton from '../../../components/Button/CustomButtom';
import CustomSearch from '../../../components/Search/CustomSearch';
import ModeloTable from '../../../components/Table/Tabla';
import { useStaff } from '../hook/staffHook';

export default function Staff() {
  const navigate = useNavigate();

  const { staff, loading, error, pagination, handlePageChange, setSearchTerm, handleDeleteTherapist, } =
    useStaff();

  // Debug (verifica en consola)
  console.log('Datos:', {
    staff,
    loading,
    error,
    pagination,
  });

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
  ];

  // const staffData = StaffMock[0].items;

  const handleButton = () => {
    navigate('registrar');
  };

  const handleSearch = (value) => {
    // Aquí puedes implementar la lógica de filtrado
    setSearchTerm(value);
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
      <Button 
        style={{ backgroundColor: '#FF3333', color: '#fff' }}
        onClick={() => handleDeleteTherapist(record.id)}
      >
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
        customActions={(record) => customActionButtons(record)}
        pagination={{
          current: pagination.currentPage,
          total: pagination.totalItems,
          pageSize: 100,
          onChange: handlePageChange,
        }}
      />
    </div>
  );
}
