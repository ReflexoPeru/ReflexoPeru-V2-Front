import { Button, Space, notification, Spin, Drawer, List, Typography, Radio, Tag, Empty, Divider, Tooltip, Input } from 'antd';
import { UndoOutlined, HistoryOutlined, DeleteOutlined, SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import CustomButton from '../../../components/Button/CustomButton';
import CustomSearch from '../../../components/Search/CustomSearch';
import ModeloTable from '../../../components/Table/Tabla';
import { usePatients } from '../hook/patientsHook';
import EditPatient from '../ui/EditPatient/EditPatient';
import { getPatientById, getTrashedPatients, restorePatient, searchTrashedPatients } from '../service/patientsService';
import InfoPatient from './InfoPatient/infopatient';
import DeleteConfirmModal from '../../../components/Modal/DeleteConfirmModal';
import IncompleteDataModal from '../../../components/Modal/IncompleteDataModal';
import { useDataValidation } from '../../../hooks/useDataValidation';

const { Title, Text } = Typography;

export default function Patients() {
  const navigate = useNavigate();
  const [editingPatient, setEditingPatient] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loadingEditId, setLoadingEditId] = useState(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [incompleteDataModalVisible, setIncompleteDataModalVisible] = useState(false);
  const [incompleteDataPatient, setIncompleteDataPatient] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [navigatingCreate, setNavigatingCreate] = useState(false);
  const [loadingHistoryId, setLoadingHistoryId] = useState(null);

  // States for Restoration logic
  const [isTrashedDrawerOpen, setIsTrashedDrawerOpen] = useState(false);
  const [trashedPatients, setTrashedPatients] = useState([]);
  const [filteredTrashed, setFilteredTrashed] = useState([]);
  const [loadingTrashed, setLoadingTrashed] = useState(false);
  const [restoringId, setRestoringId] = useState(null);
  const [restoreMode, setRestoreMode] = useState('full'); // 'full' or 'clean'
  const [trashedSearchTerm, setTrashedSearchTerm] = useState('');
  const [isSearchingTrashed, setIsSearchingTrashed] = useState(false);

  const { validateEntityData } = useDataValidation();
  const {
    patients,
    loading,
    pagination,
    handlePageChange,
    setSearchTerm,
    handleDeletePatient,
  } = usePatients();

  // Debounced search for trashed patients (API BASED)
  useEffect(() => {
    if (!isTrashedDrawerOpen) return;
    
    if (trashedSearchTerm.trim() === '') {
      fetchTrashed(); // Reset list if empty
      setIsSearchingTrashed(false);
      return;
    }

    setIsSearchingTrashed(true);
    const handler = setTimeout(async () => {
      try {
        const response = await searchTrashedPatients(trashedSearchTerm);
        setFilteredTrashed(response.data);
      } catch (e) {
        console.error("Error searching trashed:", e);
      } finally {
        setIsSearchingTrashed(false);
      }
    }, 3000); // 3 seconds debounce as requested

    return () => clearTimeout(handler);
  }, [trashedSearchTerm, isTrashedDrawerOpen]);

  const fetchTrashed = async () => {
    setLoadingTrashed(true);
    try {
      const response = await getTrashedPatients(1, 100);
      setTrashedPatients(response.data);
      setFilteredTrashed(response.data);
    } catch (e) {
      notification.error({
        message: 'Error al cargar papelera',
        description: 'No se pudieron recuperar los registros eliminados.'
      });
    } finally {
      setLoadingTrashed(false);
    }
  };

  const handleOpenTrashed = () => {
    setIsTrashedDrawerOpen(true);
    fetchTrashed();
  };

  const handleRestore = async (patientId) => {
    setRestoringId(patientId);
    try {
      const withAppointments = restoreMode === 'full';
      await restorePatient(patientId, withAppointments);
      notification.success({ 
        message: '¡Paciente Restaurado!', 
        description: `El registro ha sido recuperado ${withAppointments ? 'con todo su historial' : 'como paciente nuevo (limpio)'}.` 
      });
      fetchTrashed(); // Recargar lista de borrados
      handlePageChange(pagination.currentPage); // Recargar tabla principal
    } catch (e) {
      notification.error({
        message: 'Error de Restauración',
        description: e.response?.data?.message || 'No se pudo completar la restauración.'
      });
    } finally {
      setRestoringId(null);
    }
  };

  // Handler para editar: hace GET antes de abrir el modal
  const handleEdit = async (record) => {
    setLoadingEditId(record.id);
    try {
      const freshPatient = await getPatientById(record.id);
      const validation = validateEntityData(freshPatient, 'paciente');

      if (!validation.canEdit) {
        setIncompleteDataPatient(freshPatient);
        setValidationResult(validation);
        setIncompleteDataModalVisible(true);
        return;
      }

      setEditingPatient(freshPatient);
      setIsEditModalOpen(true);
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
    setPatientToDelete(id);
    setDeleteConfirmVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (patientToDelete) {
      setLoadingDeleteId(patientToDelete);
      try {
        await handleDeletePatient(patientToDelete);
      } finally {
        setLoadingDeleteId(null);
        setPatientToDelete(null);
        setDeleteConfirmVisible(false);
      }
    }
  };

  const handleCancelDelete = () => {
    setPatientToDelete(null);
    setDeleteConfirmVisible(false);
  };

  const handleInfo = (record) => {
    setPatientInfo(record);
    setShowInfoModal(true);
  };

  const handleAction = (action, record) => {
    const styles = {
      edit: { backgroundColor: '#0066FF', color: '#fff', border: 'none', minWidth: 80, height: '36px', borderRadius: '4px' },
      info: { backgroundColor: '#00AA55', color: '#fff', border: 'none', height: '36px', borderRadius: '4px' },
      history: { backgroundColor: '#8800CC', color: '#fff', border: 'none', height: '36px', borderRadius: '4px', minWidth: 80 },
      delete: { backgroundColor: '#FF3333', color: '#fff', border: 'none', minWidth: 80, height: '36px', borderRadius: '4px' }
    };

    switch (action) {
      case 'edit': return <Button style={styles.edit} onClick={() => handleEdit(record)} loading={loadingEditId === record.id}>Editar</Button>;
      case 'info': return <Button style={styles.info} onClick={() => handleInfo(record)}>Más Info</Button>;
      case 'history': return (
        <Button style={styles.history} onClick={() => {
          setLoadingHistoryId(record.id);
          navigate(`/Inicio/pacientes/historia/${record.id}`, { state: { from: '/Inicio/pacientes' } });
        }} loading={loadingHistoryId === record.id}>Historia</Button>
      );
      case 'delete': return <Button style={styles.delete} onClick={() => handleDelete(record.id)} loading={loadingDeleteId === record.id}>Eliminar</Button>;
      default: return null;
    }
  };

  const columns = [
    { title: 'Nro. Documento', dataIndex: 'document_number', key: 'document_number', width: '150px' },
    { title: 'Apellido Paterno', dataIndex: 'paternal_lastname', key: 'paternal_lastname' },
    { title: 'Apellido Materno', dataIndex: 'maternal_lastname', key: 'maternal_lastname' },
    { title: 'Nombres', dataIndex: 'name', key: 'names' },
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch (e) {
      return 'N/A';
    }
  };

  const handleCloseIncompleteDataModal = () => {
    setIncompleteDataModalVisible(false);
    setIncompleteDataPatient(null);
    setValidationResult(null);
  };

  const handleGoToUpdatePatient = () => {
    if (incompleteDataPatient) {
      setIncompleteDataModalVisible(false);
      setEditingPatient(incompleteDataPatient);
      setIsEditModalOpen(true);
      setIncompleteDataPatient(null);
      setValidationResult(null);
    }
  };

  return (
    <div style={{ height: '100%', paddingTop: '24px', width: '100%', paddingLeft: '35px', paddingRight: '35px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '0 auto 20px auto', width: '100%' }}>
        <CustomButton text="Crear Paciente" onClick={() => navigate('registrar')} loading={navigatingCreate} />
        <CustomSearch placeholder="Buscar por Apellido/Nombre o DNI..." onSearch={setSearchTerm} width="100%" />
        <Tooltip title="Ver Papelera de Reciclaje">
          <Button 
            className="flex items-center justify-center"
            style={{
              height: '45px', width: '50px', backgroundColor: '#f8f9fa', border: '1.5px solid #e2e8f0', borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
            }}
            onClick={handleOpenTrashed}
            icon={<HistoryOutlined style={{ fontSize: '20px', color: '#64748b' }} />}
          />
        </Tooltip>
      </div>

      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ backgroundColor: '#e6f7ff', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HistoryOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#262626', lineHeight: '1.2' }}>Centro de Recuperación</div>
              <div style={{ fontSize: '12px', fontWeight: '400', color: '#8c8c8c' }}>Gestiona registros archivados</div>
            </div>
          </div>
        }
        placement="right" width={460} onClose={() => setIsTrashedDrawerOpen(false)} open={isTrashedDrawerOpen}
        headerStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 24px' }}
        bodyStyle={{ padding: '0' }}
        extra={<Button icon={<UndoOutlined />} onClick={fetchTrashed} loading={loadingTrashed} type="text" style={{ color: '#8c8c8c' }} />}
      >
        <style>{`
          .restore-radio .ant-radio-button-wrapper-checked {
            background-color: #1CB54A !important;
            border-color: #1CB54A !important;
            color: #fff !important;
          }
          .restore-radio .ant-radio-button-wrapper:hover {
            color: #1CB54A;
          }
        `}</style>
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '32px', padding: '20px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <Text strong style={{ display: 'block', marginBottom: '14px', fontSize: '14px', color: '#334155' }}>Modo de restauración:</Text>
            <Radio.Group 
              value={restoreMode} onChange={(e) => setRestoreMode(e.target.value)} buttonStyle="solid" className="restore-radio"
              style={{ width: '100%', display: 'flex' }}
            >
              <Radio.Button value="full" style={{ flex: 1, textAlign: 'center', height: '42px', lineHeight: '40px', borderRadius: '8px 0 0 8px' }}>Completa</Radio.Button>
              <Radio.Button value="clean" style={{ flex: 1, textAlign: 'center', height: '42px', lineHeight: '40px', borderRadius: '0 8px 8px 0' }}>Limpia</Radio.Button>
            </Radio.Group>
            
            <div style={{ display: 'flex', gap: '8px', marginTop: '14px', alignItems: 'flex-start' }}>
              <Tag color={restoreMode === 'full' ? "blue" : "orange"} style={{ borderRadius: '10px', border: 'none' }}>
                {restoreMode === 'full' ? 'Historial Completo' : 'Solo Datos Base'}
              </Tag>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {restoreMode === 'full' ? 'Recupera al paciente con todas sus citas.' : 'Recupera solo la ficha base.'}
              </Text>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <Input
              placeholder="Buscar por DNI o Nombre..."
              prefix={isSearchingTrashed ? <LoadingOutlined style={{ color: '#1CB54A', marginRight: '8px' }} spin /> : <SearchOutlined style={{ color: '#94a3b8', marginRight: '8px' }} />}
              value={trashedSearchTerm}
              onChange={(e) => setTrashedSearchTerm(e.target.value)}
              style={{
                borderRadius: '12px', height: '48px', padding: '0 16px', border: '1.5px solid #e2e8f0',
                backgroundColor: '#ffffff', fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
              suffix={trashedSearchTerm && <Button type="text" icon={<DeleteOutlined style={{ fontSize: '12px' }} />} onClick={() => setTrashedSearchTerm('')} size="small" />}
            />
            {isSearchingTrashed && (
              <div style={{ marginTop: '8px', textAlign: 'right' }}>
                <Text type="secondary" style={{ fontSize: '11px', fontStyle: 'italic' }}>Buscando en 3s...</Text>
              </div>
            )}
          </div>

          <Divider orientation="left" style={{ margin: '0 0 20px 0' }}>
            <Text type="secondary" style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
              Registros encontrados ({filteredTrashed.length})
            </Text>
          </Divider>

          <List
            loading={loadingTrashed} dataSource={filteredTrashed} split={false}
            locale={{ emptyText: <Empty description={trashedSearchTerm ? "No se encontraron resultados" : "La papelera está vacía"} style={{ marginTop: '40px' }} /> }}
            renderItem={(patient) => (
              <div 
                style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f0f0f0', transition: 'all 0.3s ease', position: 'relative' }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#bae7ff'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '4px' }}><Text strong style={{ fontSize: '15px', color: '#1e293b' }}>{`${patient.name} ${patient.paternal_lastname} ${patient.maternal_lastname || ''}`}</Text></div>
                    <Space size={12} split={<Divider type="vertical" />}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>DNI: <span style={{ color: '#475569', fontWeight: '500' }}>{patient.document_number || 'N/A'}</span></Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>ID: <span style={{ color: '#475569', fontWeight: '500' }}>#{patient.id}</span></Text>
                    </Space>
                  </div>
                  <Tooltip title="Restaurar ahora">
                    <Button
                      type="primary" icon={<UndoOutlined />} loading={restoringId === patient.id} onClick={() => handleRestore(patient.id)}
                      style={{ backgroundColor: '#1CB54A', borderColor: '#1CB54A', borderRadius: '10px', height: '42px', width: '42px', boxShadow: '0 4px 10px rgba(28, 181, 74, 0.3)' }}
                    />
                  </Tooltip>
                </div>
                
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DeleteOutlined style={{ color: '#94a3b8', fontSize: '12px' }} />
                    <Text type="secondary" style={{ fontSize: '11px' }}>Eliminado el {formatDate(patient.deleted_at)}</Text>
                  </div>
                  <Tag style={{ border: 'none', backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '10px' }}>SISTEMA</Tag>
                </div>
              </div>
            )}
          />
        </div>
      </Drawer>

      <div style={{ width: '100%', margin: '0 auto' }}>
        <ModeloTable columns={columns} data={patients} loading={loading} maxHeight="70vh" pagination={{ current: pagination.currentPage, total: pagination.totalItems, pageSize: 50, onChange: handlePageChange }} />
      </div>

      {editingPatient && isEditModalOpen && <EditPatient patient={editingPatient} onClose={handleCloseEditModal} onSave={() => handlePageChange(pagination.currentPage)} />}
      {patientInfo && <InfoPatient patient={patientInfo} open={showInfoModal} onClose={() => setShowInfoModal(false)} />}
      <DeleteConfirmModal visible={deleteConfirmVisible} onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} entityType="paciente" loading={loadingDeleteId === patientToDelete} />
      <IncompleteDataModal
        visible={incompleteDataModalVisible}
        onCancel={handleCloseIncompleteDataModal}
        entityType="paciente"
        entityName={validationResult?.entityName || ''}
        missingFields={validationResult?.missingFields || []}
        onGoToUpdate={handleGoToUpdatePatient}
      />
    </div>
  );
}
