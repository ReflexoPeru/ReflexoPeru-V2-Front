import { Button, Space, notification, Spin } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import CustomButton from '../../../components/Button/CustomButtom';
import CustomSearch from '../../../components/Search/CustomSearch';
import ModeloTable from '../../../components/Table/Tabla';
import { usePatients } from '../hook/patientsHook';
import EditPatient from '../ui/EditPatient/EditPatient';
import { getPatientById } from '../service/patientsService';
import InfoPatient from './InfoPatient/infopatient';

export default function Patients() {
  const navigate = useNavigate();
  const [editingPatient, setEditingPatient] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loadingEditId, setLoadingEditId] = useState(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const {
    patients,
    loading,
    pagination,
    handlePageChange,
    setSearchTerm,
    handleDeletePatient,
  } = usePatients();

  // Handler para editar: hace GET antes de abrir el modal
  const handleEdit = async (record) => {
    setLoadingEditId(record.id);
    try {
      const freshPatient = await getPatientById(record.id);
      setEditingPatient(freshPatient);
      setIsEditModalOpen(true); // ← Esta línea es crucial para abrir el modal
    } catch (e) {
      notification.error({
        message: 'Error',
        description: 'No se pudo obtener los datos actualizados.',
      });
    } finally {
      setLoadingEditId(null);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingPatient(null);
  };

  const handleDelete = async (id) => {
    setLoadingDeleteId(id);
    try {
      await handleDeletePatient(id);
    } finally {
      setLoadingDeleteId(null);
    }
  };

  const handleInfo = (record) => {
    setPatientInfo(record);
    setShowInfoModal(true);
  };

  const handleAction = (action, record) => {
    switch (action) {
      case 'edit':
        return (
          <Button
            style={{
              backgroundColor: '#0066FF',
              color: '#fff',
              border: 'none',
              minWidth: 80,
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
            }}
            onClick={() => handleEdit(record)}
            disabled={loadingEditId === record.id}
          >
            {loadingEditId === record.id ? (
              <Spin size="small" style={{ color: '#fff' }} />
            ) : (
              'Editar'
            )}
          </Button>
        );
      case 'info':
        return (
          <Button
            style={{
              backgroundColor: '#00AA55',
              color: '#fff',
              border: 'none',
              height: '36px',
              borderRadius: '4px',
            }}
            onClick={() => handleInfo(record)}
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
              height: '36px',
              borderRadius: '4px',
            }}
            onClick={() => navigate(`/Inicio/pacientes/historia/${record.id}`)}
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
              minWidth: 80,
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
            }}
            onClick={() => handleDelete(record.id)}
            disabled={loadingDeleteId === record.id}
          >
            {loadingDeleteId === record.id ? (
              <Spin />
            ) : (
              'Eliminar'
            )}
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
      title: 'Nro. Documento',
      dataIndex: 'document_number',
      key: 'document_number',
      width: '150px',
    },
    {
      title: 'Apellido Paterno',
      dataIndex: 'paternal_lastname',
      key: 'paternal_lastname',
    },
    {
      title: 'Apellido Materno',
      dataIndex: 'maternal_lastname',
      key: 'maternal_lastname',
    },
    {
      title: 'Nombres',
      dataIndex: 'name',
      key: 'names',
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
        paddingTop: '2.5%',
        width: '100%',
        paddingLeft: '35px',
        paddingRight: '35px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <CustomButton text="Crear Paciente" onClick={handleButton} />
        <CustomSearch
          placeholder="Buscar por Apellido/Nombre o DNI..."
          onSearch={handleSearch}
          width="100%"
        />
      </div>

      <div
        style={{
          width: '100%',
          margin: '0 auto',
        }}
      >
        <ModeloTable
        columns={columns}
        data={patients}
        loading={loading}
        maxHeight="70vh"
        pagination={{
          current: pagination.currentPage,
          total: pagination.totalItems,
          pageSize: 50,
          onChange: handlePageChange,
        }}
      />
      </div>

      {/* Modal de edición */}
      {editingPatient && isEditModalOpen && (
        <EditPatient
          patient={editingPatient}
          onClose={handleCloseEditModal}
          onSave={() => handlePageChange(pagination.currentPage)}
        />
      )}

      {patientInfo && (
        <InfoPatient
          patient={patientInfo}
          open={showInfoModal}
          onClose={() => setShowInfoModal(false)}
        />
      )}
    </div>
  );
}
