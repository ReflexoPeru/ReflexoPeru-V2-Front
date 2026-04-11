import { PDFViewer, pdf } from '@react-pdf/renderer';
import { Button, Modal, Space, Spin, notification, Tooltip, Drawer, Badge, Form, DatePicker, TimePicker, Select } from 'antd';
import { CalendarOutlined, GlobalOutlined, InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from '../../../utils/dayjsConfig';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../services/api/Axios/baseConfig';
import CustomButton from '../../../components/Button/CustomButton';
import GhlLeadsList from '../../ghl/GhlLeadsList';
import CustomTimeFilter from '../../../components/DateSearch/CustomTimeFilter';
import FichaPDF from '../../../components/PdfTemplates/FichaPDF';
import TicketPDF from '../../../components/PdfTemplates/TicketPDF';
import CustomSearch from '../../../components/Search/CustomSearch';
import ModeloTable from '../../../components/Table/Tabla';
import {
  getAppointmentsByPatientId,
  getPatientHistoryById,
} from '../../history/service/historyService';
import { useAppointments } from '../hook/appointmentsHook';
import EditAppointment from '../ui/EditAppointment/EditAppointment';
import UniversalModal from '../../../components/Modal/UniversalModal';
import { deleteAppointment } from '../service/appointmentsService';
import { useToast } from '../../../services/toastify/ToastContext';
import { defaultConfig } from '../../../services/toastify/toastConfig';
import { formatToastMessage } from '../../../utils/messageFormatter';
import DeleteConfirmModal from '../../../components/Modal/DeleteConfirmModal';
import NewPatient from '../../patients/ui/RegisterPatient/NewPatient';
import NewAppointment from './RegisterAppointment/NewAppointment';

export default function Appointments() {
  const navigate = useNavigate();
  const {
    appointments,
    loading,
    pagination,
    handlePageChange,
    setSearchTerm,
    loadPaginatedAppointmentsByDate,
    loadAppointments,
  } = useAppointments();

  const [selectDate, setSelectDate] = useState(dayjs());
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showFichaModal, setShowFichaModal] = useState(false);
  const [selectedFicha, setSelectedFicha] = useState(null);
  const [visitasFicha, setVisitasFicha] = useState(0);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [appointmentIdToEdit, setAppointmentIdToEdit] = useState(null);
  const [loadingEditId, setLoadingEditId] = useState(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);
  const [loadingPrintFichaId, setLoadingPrintFichaId] = useState(null);
  const [loadingPrintTicketId, setLoadingPrintTicketId] = useState(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  // ── FLUJO GHL: estados para el proceso de agendar desde Citas Web ──
  const [ghlActiveLead, setGhlActiveLead]     = useState(null); // lead activo del flujo
  const [ghlPatientReady, setGhlPatientReady] = useState(null); // paciente creado/seleccionado
  const [isGhlPatientModalOpen, setIsGhlPatientModalOpen]         = useState(false);
  const [isGhlAppointmentModalOpen, setIsGhlAppointmentModalOpen] = useState(false);
  // form para la cita GHL
  const [ghlAppForm] = Form.useForm?.() ?? [{ setFieldsValue: () => {}, resetFields: () => {}, getFieldValue: () => {} }];
  // IDs de citas creadas desde GHL (para mostrar badge en tabla)
  const [ghlAppointmentIds, setGhlAppointmentIds] = useState([]);
  const [isGhlDrawerOpen, setIsGhlDrawerOpen] = useState(false);
  const [ghlRefreshKey, setGhlRefreshKey] = useState(0);
  const [ghlLeadsCount, setGhlLeadsCount] = useState(0);

  const fetchGhlLeadsCount = async () => {
    try {
      const res = await axios.get('/ghl-bookings');
      setGhlLeadsCount(res.data.length);
    } catch (e) {
      console.warn('No se pudo obtener el conteo de GHL');
    }
  };

  useEffect(() => {
    fetchGhlLeadsCount();
    const interval = setInterval(fetchGhlLeadsCount, 300000);
    return () => clearInterval(interval);
  }, [ghlRefreshKey]);

  const { showToast } = useToast();

  useEffect(() => {
    loadPaginatedAppointmentsByDate(selectDate.format('YYYY-MM-DD'));
  }, [selectDate]);

  const columns = [
    {
      title: 'Nro Ticket',
      dataIndex: 'ticket_number',
      key: 'ticket_number',
      width: '70px',
    },
    {
      title: 'Paciente',
      key: 'patient_id',
      width: '180px',
      render: (_, record) => {
        const patient = record?.patient;
        if (!patient) return 'Paciente no disponible';
        const text = `${patient.paternal_lastname || ''} ${patient.maternal_lastname || ''} ${patient.name || ''}`.trim();
        const isReserved = record.payment === null && record.payment_type === null && record.social_benefit === null;
        const isFromGhl  = record.origin === 'ghl' || record.ghl_appointment_id || ghlAppointmentIds.includes(record.id);
        return (
          <span style={{ color: isReserved ? '#FF0000' : 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 500 }}>{text}</span>
            {isFromGhl && (
              <Tooltip title="Cita originada desde GoHighLevel (Web)">
                <Badge 
                  count="WEB" 
                  style={{ 
                    backgroundColor: '#3B82F6', 
                    fontSize: '10px', 
                    fontWeight: 800,
                    borderRadius: '4px',
                    height: '18px',
                    lineHeight: '18px',
                    padding: '0 6px',
                    border: 'none',
                    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
                  }} 
                />
              </Tooltip>
            )}
          </span>
        );
      },
    },
    {
      title: 'Sala',
      dataIndex: 'room',
      key: 'room',
      width: '65px',
      render: (text, record) => {
        const isReserved = record.payment === null && record.payment_type === null && record.social_benefit === null;
        return <span style={{ color: isReserved ? '#FF0000' : 'inherit' }}>{text}</span>;
      },
    },
    {
      title: 'Fecha cita',
      dataIndex: 'appointment_date',
      width: '70px',
      key: 'appointment_date',
      render: (date, record) => {
        if (!date) return '-';
        const text = dayjs(date).format('DD/MM/YYYY');
        const isReserved = record.payment === null && record.payment_type === null && record.social_benefit === null;
        return <span style={{ color: isReserved ? '#FF0000' : 'inherit' }}>{text}</span>;
      },
    },
    {
      title: 'Hora',
      dataIndex: 'appointment_hour',
      key: 'appointment_hour',
      width: '70px',
      render: (text, record) => {
        const isReserved = record.payment === null && record.payment_type === null && record.social_benefit === null;
        return <span style={{ color: isReserved ? '#FF0000' : 'inherit' }}>{text}</span>;
      },
    },
    {
      title: 'Metodo Pago',
      key: 'payment_type',
      width: '100px',
      render: (_, record) => {
        const isReserved =
          record.payment === null &&
          record.payment_type === null &&
          record.social_benefit === null;

        return (
          <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ color: isReserved ? '#FF0000' : 'inherit' }}>
              {record.payment_type?.name || 'Sin método'}
            </span>
            {isReserved && (
              <div style={{ position: 'absolute', right: '10px', top: '10%', transform: 'translateY(-50%)' }}>
                <Tooltip title="Cita Reservada">
                  <CalendarOutlined
                    style={{ color: '#00AA55', fontSize: '14px', cursor: 'help' }}
                  />
                </Tooltip>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Pago',
      dataIndex: 'payment',
      key: 'payment',
      width: '70px',
      render: (text, record) => {
        const isReserved = record.payment === null && record.payment_type === null && record.social_benefit === null;
        return <span style={{ color: isReserved ? '#FF0000' : 'inherit' }}>{text}</span>;
      },
    },
    {
      title: 'Creación de cita',
      dataIndex: 'created_at',
      key: 'created_at',
      width: '130px',
      render: (date, record) => {
        if (!date) return '-';
        const text = dayjs(date).format('DD-MM-YYYY HH:mm:ss');
        const isReserved = record.payment === null && record.payment_type === null && record.social_benefit === null;
        return <span style={{ color: isReserved ? '#FF0000' : 'inherit' }}>{text}</span>;
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: '450px',
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            style={{
              backgroundColor: '#555555',
              color: '#fff',
              border: 'none',
              minWidth: 70,
              height: 30,
              padding: '4px 12px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={async () => {
              setLoadingEditId(record.id);
              setAppointmentIdToEdit(record.id);
              setIsEditModalOpen(true);
              setLoadingEditId(null);
            }}
            disabled={loadingEditId === record.id}
          >
            {loadingEditId === record.id ? (
              <Spin size="small" style={{ color: '#fff' }} />
            ) : (
              'Editar'
            )}
          </Button>
          <Button
            size="small"
            style={{
              backgroundColor: '#00AA55',
              color: '#fff',
              border: 'none',
              minWidth: 90,
              height: 30,
              padding: '4px 12px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => handleAction('history', record)}
          >
            Rellenar Historia
          </Button>
          <Button
            size="small"
            style={{
              backgroundColor: '#0066FF',
              color: '#fff',
              border: 'none',
              minWidth: 70,
              height: 30,
              padding: '4px 12px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => handleAction('imprimir', record)}
            disabled={loadingPrintFichaId === record.id}
          >
            {loadingPrintFichaId === record.id ? (
              <Spin size="small" />
            ) : (
              'Imprimir'
            )}
          </Button>
          <Button
            size="small"
            style={{
              backgroundColor: '#69276F',
              color: '#fff',
              border: 'none',
              minWidth: 100,
              height: 30,
              padding: '4px 12px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => handleAction('boleta', record)}
            disabled={loadingPrintTicketId === record.id}
          >
            {loadingPrintTicketId === record.id ? (
              <Spin size="small" />
            ) : (
              'Boleta'
            )}
          </Button>
          <Button
            size="small"
            style={{
              backgroundColor: '#FF3333',
              color: '#fff',
              border: 'none',
              minWidth: 70,
              height: 30,
              padding: '4px 12px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => handleAction('delete', record)}
            disabled={loadingDeleteId === record.id}
          >
            {loadingDeleteId === record.id ? <Spin size="small" /> : 'Eliminar'}
          </Button>
        </Space>
      ),
    },
  ];

  // Mostrar todas las citas que trae el backend, sin filtrar por estado
  const visibleAppointments = appointments;

  const handleAction = async (action, record) => {
    switch (action) {
      case 'edit':
        setLoadingEditId(record.id);
        setAppointmentIdToEdit(record.id);
        setIsEditModalOpen(true);
        break;
      case 'delete':
        setAppointmentToDelete(record);
        setDeleteConfirmVisible(true);
        break;
      case 'imprimir':
        setLoadingPrintFichaId(record.id);
        await handlePrintFicha(record);
        setLoadingPrintFichaId(null);
        break;
      case 'boleta':
        setLoadingPrintTicketId(record.id);
        setSelectedAppointment(record);
        setShowTicketModal(true);
        setLoadingPrintTicketId(null);
        break;
      case 'history':
        navigate(`/Inicio/pacientes/historia/${record.patient.id}`, {
          state: {
            appointment: record,
            from: '/Inicio/citas'
          },
        });
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

  const handlePrintFicha = async (record) => {
    try {
      const res = await getAppointmentsByPatientId(record.patient.id);
      const appointmentsArray = Array.isArray(res) ? res : (res?.appointments || []);
      const visitas = appointmentsArray.length;
      await printFichaPDF(record, visitas, appointmentsArray);
    } catch (e) {
      await printFichaPDF(record, 0, []);
    }
  };

  const printFichaPDF = async (record, visitas, appointmentsArray = []) => {
    let historia = {};
    try {
      historia = await getPatientHistoryById(record.patient.id);
    } catch (e) {
      historia = {};
    }
    const doc = (
      <FichaPDF
        cita={record}
        paciente={record.patient}
        visitas={visitas}
        appointments={appointmentsArray}
        historia={historia.data || {}}
      />
    );
    const asPdf = pdf([]);
    asPdf.updateContainer(doc);
    const blob = await asPdf.toBlob();
    const url = URL.createObjectURL(blob);

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);

    const cleanUp = () => {
      setTimeout(() => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
      }, 100);
      iframe.contentWindow.removeEventListener('afterprint', cleanUp);
    };

    iframe.onload = function () {
      setTimeout(() => {
        iframe.contentWindow.addEventListener('afterprint', cleanUp);
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      }, 500);
    };
  };

  // Se han movido las declaraciones de GHL al inicio del componente para evitar duplicados.

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
          marginBottom: '20px'
        }}
      >
        <CustomButton text="Registrar Cita" onClick={handleButton} />

        <Badge count={ghlLeadsCount} offset={[-5, 5]}>
           <Button 
              icon={<GlobalOutlined />} 
              style={{ 
                height: '42px', 
                borderRadius: '8px', 
                background: '#1a3353', 
                color: '#fff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                fontWeight: 600,
                padding: '0 15px'
              }}
              onClick={() => setIsGhlDrawerOpen(true)}
           >
              Citas Web
           </Button>
        </Badge>

        <CustomSearch
          placeholder="Buscar por Apellido/Nombre o DNI..."
          onSearch={handleSearch}
          width="100%"
        />

        <CustomTimeFilter
          onDateChange={setSelectDate}
          value={selectDate}
          width="250px"
          showTime={false}
          format="DD-MM-YYYY"
        />
      </div>

      {/* El Drawer duplicado de aquí ha sido eliminado para corregir el error visual. */}

      {/* ── MODAL 1: CREAR PACIENTE DESDE GHL (Reutilizando el oficial) ── */}
      <UniversalModal
        title="Crear Nuevo Paciente"
        open={isGhlPatientModalOpen}
        onCancel={() => { setIsGhlPatientModalOpen(false); setGhlActiveLead(null); }}
        footer={null}
        width={800}
        destroyOnClose={true}
        centered={true}
        className="create-patient-modal modal-themed"
      >
        {ghlActiveLead && (
          <NewPatient
            isModal={true}
            ghlInitialValues={{
              firstName: ghlActiveLead.name?.split(' ')[0] || '',
              lastName: ghlActiveLead.name?.split(' ').slice(1).join(' ') || '',
              phone: ghlActiveLead.phone,
              email: ghlActiveLead.email
            }}
            onCancel={() => { setIsGhlPatientModalOpen(false); setGhlActiveLead(null); }}
            onSubmit={(newPatient) => {
              const displayName = `${newPatient.paternal_lastname || ''} ${newPatient.maternal_lastname || ''} ${newPatient.name || ''}`.trim();
              setGhlPatientReady({ ...newPatient, full_name: displayName });
              setIsGhlPatientModalOpen(false);
              setIsGhlAppointmentModalOpen(true);
            }}
          />
        )}
      </UniversalModal>

      {/* ── MODAL 2: CREAR CITA DESDE GHL (con paciente y fecha pre-llenados) ── */}
      <UniversalModal
        title="Nueva Cita — Confirmar Horario Web"
        open={isGhlAppointmentModalOpen}
        onCancel={() => { setIsGhlAppointmentModalOpen(false); setGhlActiveLead(null); setGhlPatientReady(null); }}
        footer={null}
        width={560}
        destroyOnClose
        centered
      >
        {ghlPatientReady && ghlActiveLead && (
          <>
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#F8FAFC', borderRadius: '8px' }}>
              <UserOutlined style={{ color: '#64748B' }} />
              <span style={{ fontSize: '12px', color: '#475569' }}>Agendando para: <strong>{ghlPatientReady.full_name}</strong></span>
            </div>
            <NewAppointment
              isModal={true}
              ghlInitialValues={{
                ...ghlActiveLead,
                // Aseguramos que el booking_id sea localizable para el back
                ghl_booking_id: ghlActiveLead.ghl_booking_id || ghlActiveLead.id
              }}
              prefillPatient={ghlPatientReady}
              prefillDate={ghlActiveLead.start_time || null}
              onCancel={() => { 
                setIsGhlAppointmentModalOpen(false); 
                setGhlActiveLead(null); 
                setGhlPatientReady(null); 
              }}
              onSubmit={async () => {
                setIsGhlAppointmentModalOpen(false);
                setGhlActiveLead(null);
                setGhlPatientReady(null);
                setGhlRefreshKey(prev => prev + 1); // Desaparece de la lista automática
                await loadAppointments(); // Refrescar tabla principal
                notification.success({
                  message: '¡Cita registrada!',
                  description: 'La solicitud web se convirtió en una cita oficial [WEB] en el sistema.',
                });
              }}
            />
          </>
        )}
      </UniversalModal>

      {/* ── DRAWER: SOLICITUDES WEB PENDIENTES (Limpio, sin doble título) ── */}
      <Drawer
        placement="right"
        onClose={() => setIsGhlDrawerOpen(false)}
        open={isGhlDrawerOpen}
        width="45%"
        styles={{ header: { display: 'none' }, body: { padding: 0 } }}
        closable={true}
      >
        <GhlLeadsList 
          key={ghlRefreshKey} 
          onSchedule={(lead) => {
            setIsGhlDrawerOpen(false); // <-- Esto hará que se cierre sola
            setGhlActiveLead(lead);
            if (lead.patient_id && lead.patient) {
              setGhlPatientReady(lead.patient);
              setIsGhlAppointmentModalOpen(true);
            } else {
              setIsGhlPatientModalOpen(true);
            }
          }}
        />
      </Drawer>

      <div
        style={{
          width: '100%',
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          {/* El botón duplicado ha sido eliminado de aquí. Se mantiene solo en la cabecera. */}
        </div>
        <ModeloTable
          columns={columns}
          data={visibleAppointments}
          loading={loading}
          maxHeight="68vh"
          pagination={{
            current: pagination.currentPage,
            total: pagination.totalItems,
            pageSize: pagination.pageSize,
            onChange: handlePageChange,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} citas`,
          }}
        />
      </div>

      <Modal
        open={showTicketModal}
        onCancel={() => setShowTicketModal(false)}
        footer={null}
        width={420}
        styles={{ body: { padding: 0 } }}
      >
        {selectedAppointment && (
          <PDFViewer width="100%" height={600} showToolbar={true}>
            <TicketPDF
              company={{
                name: 'REFLEXOPERU',
                address: 'Calle Las Golondrinas N° 153 - Urb. Los Nogales',
                phone: '01-503-8416',
                email: 'reflexoperu@reflexoperu.com',
                city: 'LIMA - PERU',
                exonerated: 'EXONERADO DE TRIBUTOS',
                di: 'D.I. 626-D.I.23211',
              }}
              ticket={{
                number: selectedAppointment.ticket_number,
                date: dayjs(selectedAppointment.appointment_date).format(
                  'DD/MM/YYYY',
                ),
                patient:
                  `${selectedAppointment.patient?.paternal_lastname || ''} ${selectedAppointment.patient?.maternal_lastname || ''} ${selectedAppointment.patient?.name || ''}`.trim(),
                service: 'Consulta',
                unit: 1,
                amount: `S/ ${Number(selectedAppointment.payment).toFixed(2)}`,
                paymentType:
                  selectedAppointment.payment_type?.name || 'Sin especificar',
              }}
            />
          </PDFViewer>
        )}
      </Modal>

      <UniversalModal
        title="Editar Cita"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={730}
      >
        {appointmentIdToEdit && (
          <EditAppointment
            appointmentId={appointmentIdToEdit}
            onEditSuccess={async () => {
              setIsEditModalOpen(false);
              setLoadingEditId(null);
              await loadAppointments();
            }}
          />
        )}
      </UniversalModal>

      <DeleteConfirmModal
        visible={deleteConfirmVisible}
        onConfirm={async () => {
          if (appointmentToDelete) {
            setLoadingDeleteId(appointmentToDelete.id);
            try {
              const response = await deleteAppointment(appointmentToDelete.id);
              const backendMsg = response?.message || response?.msg;
              showToast(
                'cancelarCita',
                backendMsg
                  ? formatToastMessage(
                    backendMsg,
                    defaultConfig.cancelarCita.message,
                  )
                  : undefined,
              );
              await loadAppointments();
            } catch (error) {
              showToast(
                'error',
                formatToastMessage(
                  error?.response?.data?.message,
                  defaultConfig.error.message,
                ),
              );
            }
            setLoadingDeleteId(null);
            setAppointmentToDelete(null);
            setDeleteConfirmVisible(false);
          }
        }}
        onCancel={() => {
          setAppointmentToDelete(null);
          setDeleteConfirmVisible(false);
        }}
        entityType="cita"
        confirmText="Sí, eliminar"
        cancelText="No eliminar"
        loading={loadingDeleteId === appointmentToDelete?.id}
      />
    </div>
  );
}
