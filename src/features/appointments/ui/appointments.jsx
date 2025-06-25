import { PDFViewer, pdf } from '@react-pdf/renderer';
import { Button, Modal, Space } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../../components/Button/CustomButtom';
import CustomTimeFilter from '../../../components/DateSearch/CustomTimeFilter';
import FichaPDF from '../../../components/PdfTemplates/FichaPDF';
import TicketPDF from '../../../components/PdfTemplates/TicketPDF';
import CustomSearch from '../../../components/Search/CustomSearch';
import ModeloTable from '../../../components/Table/Tabla';
import { getAppointmentsByPatientId } from '../../history/service/historyService';
import { useAppointments } from '../hook/appointmentsHook';
import EditAppointment from '../ui/EditAppointment/EditAppointment'; // Importar el componente de edición

export default function Appointments() {
  const navigate = useNavigate();
  const {
    appointments,
    loading,
    pagination,
    handlePageChange,
    setSearchTerm,
    loadPaginatedAppointmentsByDate,
  } = useAppointments();

  const [selectDate, setSelectDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showFichaModal, setShowFichaModal] = useState(false);
  const [selectedFicha, setSelectedFicha] = useState(null);
  const [visitasFicha, setVisitasFicha] = useState(0);
  
  // Estado para manejar el modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [appointmentIdToEdit, setAppointmentIdToEdit] = useState(null);

  useEffect(() => {
    loadPaginatedAppointmentsByDate(selectDate);
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
      width: '155px',
      render: (_, record) => {
        const patient = record?.patient;
        if (!patient) return 'Paciente no disponible';
        return `${patient.paternal_lastname || ''} ${patient.maternal_lastname || ''} ${patient.name || ''}`.trim();
      },
    },
    {
      title: 'Sala',
      dataIndex: 'room',
      key: 'room',
      width: '60px',
    },
    {
      title: 'Hora',
      dataIndex: 'appointment_hour',
      key: 'appointment_hour',
      width: '70px',
    },
    {
      title: 'Pago',
      dataIndex: 'payment',
      key: 'payment',
      width: '70px',
    },
    {
      title: 'Metodo Pago',
      key: 'payment_type',
      width: '100px',
      render: (_, record) => record.payment_type?.name || 'Sin método',
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: '200px',
      render: (_, record) => (
        <Space size="small">
          <Button
            style={{
              backgroundColor: '#555555',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => handleAction('edit', record)} // Llamar a la función de editar
          >
            Editar
          </Button>
          <Button
            style={{
              backgroundColor: '#00AA55',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => handleAction('history', record)}
          >
            Rellenar Historia
          </Button>
          <Button
            style={{
              backgroundColor: '#0066FF',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => handlePrintFicha(record)}
          >
            Imprimir
          </Button>

          <Button
            style={{
              backgroundColor: '#69276F',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => {
              setSelectedAppointment(record);
              setShowTicketModal(true);
            }}
          >
            Imprimir Boleta
          </Button>

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

  const handleAction = (action, record) => {
    console.log(`${action} action for:`, record);
    switch (action) {
      case 'edit':
        setAppointmentIdToEdit(record.id); // Guardar el ID de la cita a editar
        setIsEditModalOpen(true); // Abrir el modal de edición
        break;
      case 'imprimir':
        // Lógica para más info
        break;
      case 'boleta':
        setSelectedAppointment(record);
        setShowTicketModal(true);
        break;
      case 'history':
        navigate(`/Inicio/pacientes/historia/${record.patient.id}`, {
          state: { appointment: record },
        });
        break;
      case 'delete':
        // Lógica para eliminar
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
      const visitas = Array.isArray(res.data) ? res.data.length : 0;
      await printFichaPDF(record, visitas);
    } catch (e) {
      await printFichaPDF(record, 0);
    }
  };

  const printFichaPDF = async (record, visitas) => {
    const doc = (
      <FichaPDF cita={record} paciente={record.patient} visitas={visitas} />
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
        <CustomButton text="Registrar Cita" onClick={handleButton} />

        <CustomSearch
          placeholder="Buscar por Apellido/Nombre o DNI..."
          onSearch={handleSearch}
          width="100%"
        />

        <CustomTimeFilter
          onDateChange={setSelectDate}
          width="250px"
          showTime={false}
          format="YYYY-MM-DD"
        />
      </div>

      <ModeloTable
        columns={columns}
        data={appointments}
        loading={loading}
        pagination={{
          current: pagination.currentPage,
          total: pagination.totalItems,
          pageSize: 50,
          onChange: handlePageChange,
        }}
      />

      {/* Modal para mostrar el ticket */}
      <Modal
        open={showTicketModal}
        onCancel={() => setShowTicketModal(false)}
        footer={null}
        width={420}
        bodyStyle={{ padding: 0 }}
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
              }}
            />
          </PDFViewer>
        )}
      </Modal>

      {/* Modal para editar cita */}
      <Modal
        title="Editar Cita"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width="70%"
      >
        {appointmentIdToEdit && (
          <EditAppointment
            appointmentId={appointmentIdToEdit}
            onEditSuccess={() => {
              setIsEditModalOpen(false);
              loadPaginatedAppointmentsByDate(selectDate); // Recargar citas después de editar
            }}
          />
        )}
      </Modal>
    </div>
  );
}
