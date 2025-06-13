import CustomButton from '../../../components/Button/CustomButtom';
import CustomSearch from '../../../components/Search/CustomSearch';
import ModeloTable from '../../../components/Table/Tabla';
import { usePatients } from '../hook/patientsHook';

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
    switch (action) {
      case 'edit':
        return (
          <Button
            style={{
              backgroundColor: '#0066FF',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => setEditingPatient(record)}
          >
            Editar
          </Button>
        );
      case 'info':
        return (
          <Button
            style={{
              backgroundColor: '#00AA55',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => navigate(`info/${record.id}`)}
          >
            Más Info
          </Button>
        );
      case 'history':
        return (
          <Button
            style={{
              backgroundColor: '#8800CC',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => navigate(`historia/${record.id}`)}
          >
            Historia
          </Button>
        );
      case 'delete':
        return (
          <Button
            style={{
              backgroundColor: '#FF3333',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => handleDeletePatient(record.id)}
          >
            Eliminar
          </Button>
        );
      default:
        return null;
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
          {handleAction('edit', record)}
          {handleAction('info', record)}
          {handleAction('history', record)}
          {handleAction('delete', record)}
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

      {/* Modal de edición */}
      {editingPatient && (
        <EditPatient
          patientId={editingPatient.id}
          onClose={() => setEditingPatient(null)}
        />
      )}
    </div>
  );
}
