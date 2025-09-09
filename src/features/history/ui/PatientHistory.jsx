import { PDFViewer } from '@react-pdf/renderer';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  message,
  Radio,
  Select,
  Spin,
  Table,
  Typography,
} from 'antd';
import UniversalModal from '../../../components/Modal/UniversalModal';
import dayjs from '../../../utils/dayjsConfig';
import { useEffect, useMemo, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FichaPDF from '../../../components/PdfTemplates/FichaPDF';
import TicketPDF from '../../../components/PdfTemplates/TicketPDF';
import CustomSearch from '../../../components/Search/CustomSearch';
import {
  usePatientAppointments,
  usePatientHistory,
  useStaff,
  useUpdateAppointment,
  useUpdatePatientHistory,
} from '../hook/historyHook';
import styles from './PatientHistory.module.css';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;


const PatientHistory = () => {
  const [form] = Form.useForm();
  const [therapist, setTherapist] = useState(null);
  const [showTherapistDropdown, setShowTherapistDropdown] = useState(false);
  const [selectedAppointmentDate, setSelectedAppointmentDate] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTherapistId, setSelectedTherapistId] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [showFichaModal, setShowFichaModal] = useState(false);

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); //Para el boton de cancelar
  const appointmentFromState = location.state?.appointment;
  const { staff, loading, setSearchTerm } = useStaff();
  const { data: patientHistory } = usePatientHistory(id);
  const isFemale = patientHistory?.data?.patient?.sex === 'F';
  const {
    appointments,
    lastAppointment,
    loadingAppointments,
    appointmentsError,
  } = usePatientAppointments(id);
  const { updateHistory, loading: updatingHistory } = useUpdatePatientHistory();
  const { updateAppointment } = useUpdateAppointment();

  // MEMORIZAR LAS FECHAS DE CITAS
  const appointmentDates = useMemo(() => {
    return [...new Set(appointments?.map((a) => a.appointment_date) || [])];
  }, [appointments]);

  const selectedAppointment = useMemo(() => {
    return (
      appointments?.find(
        (a) => a.appointment_date === selectedAppointmentDate,
      ) || null
    );
  }, [appointments, selectedAppointmentDate]);

  useEffect(() => {
    if (patientHistory && patientHistory.data && patientHistory.data.patient) {
      const { patient, ...historyData } = patientHistory.data;

      form.setFieldsValue({
        // Información del paciente con verificación segura
        patientName:
          `${patient?.paternal_lastname || ''} ${patient?.maternal_lastname || ''} ${patient?.name || ''}`.trim(),

        // Observaciones
        observationPrivate: historyData?.private_observation || '',
        observation: historyData?.observation || '',

        // Información física
        talla: historyData?.height || '',
        pesoInicial: historyData?.weight || '',
        ultimoPeso: historyData?.last_weight || '',

        // Información médica
        testimonio: historyData?.testimony ? 'Sí' : 'No',
        gestacion: isFemale
          ? historyData?.gestation
            ? 'Sí'
            : 'No'
          : undefined,
        menstruacion: isFemale
          ? historyData?.menstruation
            ? 'Sí'
            : 'No'
          : undefined,
        tipoDIU: isFemale ? historyData?.diu_type || '' : undefined,

        // Campos adicionales
        diagnosticosMedicos: historyData?.diagnosticos_medicos || '',
        operaciones: historyData?.operaciones || '',
        medicamentos: historyData?.medicamentos || '',
        dolencias: historyData?.dolencias || '',
        diagnosticosReflexologia: historyData?.diagnosticos_reflexologia || '',
        observacionesAdicionales: historyData?.observaciones_adicionales || '',
        antecedentesFamiliares: historyData?.antecedentes_familiares || '',
        alergias: historyData?.alergias || '',

                 // Fechas
         fechaInicio: appointments && appointments.length > 0 
           ? dayjs(appointments[0].appointment_date) 
           : dayjs(),
      });

      // Manejo del terapeuta con verificación segura
      if (historyData?.therapist) {
        const therapistName = `${historyData.therapist.paternal_lastname || ''} ${historyData.therapist.maternal_lastname || ''} ${historyData.therapist.name || ''}`.trim();
        setTherapist(therapistName);
        setSelectedTherapistId(historyData.therapist.id || null);
      } else {
        setTherapist(null);
        setSelectedTherapistId(null);
      }
    } else {
      // Resetear el formulario si no hay datos válidos
      form.resetFields();
      setTherapist(null);
      setSelectedTherapistId(null);
    }
  }, [patientHistory, form]);

  useEffect(() => {
    if (!selectedAppointmentDate || !Array.isArray(appointments)) return;

    const selectedAppointment = appointments.find(
      (a) => a.appointment_date === selectedAppointmentDate,
    );

    if (selectedAppointment) {
      const therapistObj = selectedAppointment.therapist;
      const fullName = therapistObj
        ? `${therapistObj.paternal_lastname || ''} ${therapistObj.maternal_lastname || ''} ${therapistObj.name || ''}`.trim()
        : '';
      form.setFieldsValue({
        diagnosticosMedicos: selectedAppointment.diagnosis ?? '',
        dolencias: selectedAppointment.ailments ?? '',
        medicamentos: selectedAppointment.medications ?? '',
        operaciones: selectedAppointment.surgeries ?? '',
        observacionesAdicionales: selectedAppointment.observation ?? '',
        diagnosticosReflexologia:
          selectedAppointment.reflexology_diagnostics ?? '',
        therapist: fullName,
      });

      setTherapist(fullName || null);
      setSelectedTherapistId(therapistObj?.id ?? null);
    }
  }, [selectedAppointmentDate, appointments]);

  useEffect(() => {
    if (appointmentFromState?.appointment_date) {
      setSelectedAppointmentDate(appointmentFromState.appointment_date);
    } else if (lastAppointment?.appointment_date) {
      setSelectedAppointmentDate(lastAppointment.appointment_date);
    }
  }, [appointmentFromState, lastAppointment]);

  // Función para abrir el modal
  const showTherapistModal = () => {
    setIsModalVisible(true);
  };

  // Función para cerrar el modal sin selección
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Función para confirmar la selección
  const handleOk = () => {
    if (selectedTherapistId) {
      const selected = staff.find((t) => t.id === selectedTherapistId);
      if (selected) {
        const therapistName = `${selected.paternal_lastname || ''} ${selected.maternal_lastname || ''} ${selected.name || ''}`.trim();
        setTherapist(therapistName);
        form.setFieldsValue({ therapist: therapistName });
      }
    }
    setIsModalVisible(false);
  };

  // Función para manejar la selección en la tabla
  const handleSelectTherapist = (id) => {
    setSelectedTherapistId(id);
  };

  // Función para eliminar la selección actual
  const handleRemoveTherapist = () => {
    setTherapist(null);
    setSelectedTherapistId(null);
    form.setFieldsValue({ therapist: '' });
  };

  const onFinish = async (values) => {
    const historyId = patientHistory?.data?.id;
    const selectedAppointment = appointments.find(
      (a) => a.appointment_date === selectedAppointmentDate,
    );
    const appointmentId = selectedAppointment?.id;

    if (!historyId || !appointmentId) {
      message.error('Falta el ID del historial o la cita.');
      return;
    }

    if (!selectedAppointment?.payment_type_id) {
      message.error('La cita seleccionada no tiene un tipo de pago válido.');
      return;
    }

    const historyPayload = {
      weight: values.pesoInicial,
      last_weight: values.ultimoPeso,
      height: values.talla,
      observation: values.observation,
      private_observation: values.observationPrivate,
      diagnosticos_medicos: values.diagnosticosMedicos,
      operaciones: values.operaciones,
      medicamentos: values.medicamentos,
      dolencias: values.dolencias,
      diagnosticos_reflexologia: values.diagnosticosReflexologia,
      observaciones_adicionales: values.observacionesAdicionales,
      antecedentes_familiares: values.antecedentesFamiliares,
      alergias: values.alergias,
      testimony: values.testimonio === 'Sí',
      gestation: values.gestacion === 'Sí',
      menstruation: values.menstruacion === 'Sí',
      diu_type: values.tipoDIU,
      therapist_id: selectedTherapistId,
    };

    // Calcular appointment_status_id basado en la fecha de la cita
    const appointmentDate = dayjs(selectedAppointmentDate);
    const currentDate = dayjs();
    const appointment_status_id = appointmentDate.isBefore(currentDate, 'day')
      ? 2  // Completada si la fecha es anterior a hoy
      : 1; // Pendiente si la fecha es hoy o futura

    const appointmentPayload = {
      appointment_date: selectedAppointmentDate,
      ailments: values.dolencias,
      diagnosis: values.diagnosticosMedicos,
      surgeries: values.operaciones,
      reflexology_diagnostics: values.diagnosticosReflexologia,
      medications: values.medicamentos,
      observation: values.observacionesAdicionales,
      initial_date: dayjs(values.fechaInicio).format('YYYY-MM-DD'),
      final_date: dayjs(values.fechaInicio).add(5, 'day').format('YYYY-MM-DD'),
      appointment_type: selectedAppointment?.appointment_type || 'CC',
      payment: selectedAppointment?.payment || '50.00',
      appointment_status_id: appointment_status_id,
      payment_type_id: selectedAppointment?.payment_type_id || null,
      patient_id: patientHistory?.data?.patient?.id,
      therapist_id: selectedTherapistId,
    };

    try {
      await updateHistory(historyId, historyPayload);
      await updateAppointment(appointmentId, appointmentPayload);
      navigate(-1);
    } catch (e) {
      console.error('Error actualizando historial y cita:', e);
    }
  };

  // Columnas para la tabla de terapeutas
  const columns = [
    {
      title: 'Seleccionar',
      dataIndex: 'id',
      align: 'center',
      render: (id) => (
        <Radio
          checked={selectedTherapistId === id}
          onChange={() => handleSelectTherapist(id)}
        />
      ),
      width: 150,
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
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  if (loadingAppointments || !patientHistory) {
    return (
      <div className={styles.container}>
        <Spin
          size="large"
          tip="Cargando historial..."
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh',
          }}
        />
      </div>
    );
  }

  return (
      <div className={styles.container}>
        <Card className={styles.card}>
          <Title level={2} className={styles.title}>
            Detalles del Historial
          </Title>

          <Form
            form={form}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            className={styles.form}
          >
            {/* Información del Paciente */}
            <Form.Item
              name="patientName"
              label="Paciente"
              className={styles.formItem}
            >
              <Input disabled className={styles.input} />
            </Form.Item>

            {/* Observaciones */}
            <Form.Item
              name="observation"
              label="Observación"
              className={styles.formItem}
            >
              <TextArea rows={3} className={styles.textarea} />
            </Form.Item>

                         <Title level={3} className={styles.sectionTitle} style={{ textAlign: 'center', color: '#ffffff' }}>
               Citas
             </Title>

                         {/* Fecha de la Cita */}
             <Form.Item label="Fecha de la Cita" className={styles.formItem}>
               <Select
                 value={selectedAppointmentDate}
                 onChange={setSelectedAppointmentDate}
                 className={styles.select}
                 placeholder="Seleccione una fecha"
                 loading={loadingAppointments}
               >
                 {appointmentDates.map((date) => (
                   <Option key={date} value={date}>
                     {dayjs(date).format('DD-MM-YYYY')}
                   </Option>
                 ))}
               </Select>
             </Form.Item>

             {/* Terapeuta */}
             <Form.Item
               name="therapist"
               label="Terapeuta"
               className={styles.formItem}
             >
               <div className={styles.therapistRow}>
                 <Input
                   disabled
                   value={therapist || 'No se ha seleccionado terapeuta'}
                   className={styles.input}
                 />
                 <Button
                   type="primary"
                   onClick={showTherapistModal}
                   className={styles.selectButton}
                 >
                   Seleccionar
                 </Button>
                 {form.getFieldValue('therapist') && (
                   <Button
                     danger
                     onClick={handleRemoveTherapist}
                     className={styles.removeButton}
                   >
                     Eliminar
                   </Button>
                 )}
               </div>
             </Form.Item>

                         <div className={styles.threeColumnLayout} style={{ marginTop: '20px' }}>
               <div className={styles.column}>
                 <Form.Item
                   name="diagnosticosMedicos"
                   label="Diagnósticos médicos"
                   className={styles.formItem}
                 >
                   <TextArea rows={3} className={styles.diagnosticTextArea} />
                 </Form.Item>
               </div>

               <div className={styles.column}>
                 <Form.Item
                   name="medicamentos"
                   label="Medicamentos"
                   className={styles.formItem}
                 >
                   <TextArea rows={3} className={styles.diagnosticTextArea} />
                 </Form.Item>
               </div>

               <div className={styles.column}>
                 <Form.Item
                   name="operaciones"
                   label="Operaciones"
                   className={styles.formItem}
                 >
                   <TextArea rows={3} className={styles.diagnosticTextArea} />
                 </Form.Item>
               </div>
             </div>

            <div className={styles.threeColumnLayout}>
              <div className={styles.column}>
                <Form.Item
                  name="dolencias"
                  label="Dolencias"
                  className={styles.formItem}
                >
                  <TextArea rows={3} className={styles.diagnosticTextArea} />
                </Form.Item>
              </div>

              <div className={styles.column}>
                <Form.Item
                  name="observacionesAdicionales"
                  label="Observaciones"
                  className={styles.formItem}
                >
                  <TextArea rows={3} className={styles.diagnosticTextArea} />
                </Form.Item>
              </div>

              <div className={styles.column}>
                <Form.Item
                  name="diagnosticosReflexologia"
                  label="Diagnósticos de Reflexología"
                  className={styles.formItem}
                >
                  <TextArea rows={3} className={styles.diagnosticTextArea} />
                </Form.Item>
              </div>
            </div>

            <div className={styles.physicalInfoRow}>
              <Form.Item
                name="talla"
                label="Talla"
                className={styles.physicalInfoItem}
                rules={[
                  {
                    pattern: /^\d+(\.\d+)?$/,
                    message: 'Solo se permiten números enteros o decimales',
                  },
                ]}
              >
                <Input className={`${styles.input} ${styles.smallInput}`} />
              </Form.Item>

              <Form.Item
                name="pesoInicial"
                label="Peso Inicial"
                className={styles.physicalInfoItem}
                rules={[
                  {
                    pattern: /^\d+(\.\d+)?$/,
                    message: 'Solo se permiten números enteros o decimales',
                  },
                ]}
              >
                <Input className={`${styles.input} ${styles.smallInput}`} />
              </Form.Item>

              <Form.Item
                name="ultimoPeso"
                label="Último Peso"
                className={styles.physicalInfoItem}
                rules={[
                  {
                    pattern: /^\d+(\.\d+)?$/,
                    message: 'Solo se permiten números enteros o decimales',
                  },
                ]}
              >
                <Input className={`${styles.input} ${styles.smallInput}`} />
              </Form.Item>

              <Form.Item
                name="testimonio"
                label="Testimonio"
                className={styles.physicalInfoItem}
              >
                <Select className={`${styles.select} ${styles.smallInput}`}>
                  <Option value="Sí">Sí</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>

              {/* Campos condicionales para mujeres que ahora están en la misma fila */}
              <Form.Item
                name="menstruacion"
                label="Menstruación"
                className={styles.physicalInfoItem}
                style={{ display: isFemale ? 'block' : 'none' }}
              >
                <Select className={`${styles.select} ${styles.smallInput}`}>
                  <Option value="Sí">Sí</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="gestacion"
                label="Gestación"
                className={styles.physicalInfoItem}
                style={{ display: isFemale ? 'block' : 'none' }}
              >
                <Select className={`${styles.select} ${styles.smallInput}`}>
                  <Option value="Sí">Sí</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="tipoDIU"
                label="Tipo DIU"
                className={styles.physicalInfoItem}
                style={{ display: isFemale ? 'block' : 'none' }}
              >
                <Input className={`${styles.input} ${styles.smallInput}`} />
              </Form.Item>
            </div>

            <div className={styles.bottomSection}>
              <Form.Item
                name="fechaInicio"
                label="Fecha de Inicio"
                className={styles.startDateSection}
              >
                <DatePicker className={styles.datePicker} format="DD-MM-YYYY" />
              </Form.Item>

              <div className={styles.actionButtons}>
                <Button
                  className={styles.printButton}
                  onClick={() => {
                    setShowTicketModal(true);
                  }}
                  disabled={!selectedAppointment}
                >
                  Generar Boleta
                </Button>
                <Button
                  className={styles.printButton}
                  onClick={() => {
                    setShowFichaModal(true);
                  }}
                  disabled={!selectedAppointment}
                >
                  Generar Ticket
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.saveButton}
                >
                  Guardar Cambios
                </Button>
                <Button
                  className={styles.cancelButton}
                  onClick={() => navigate(-1)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Form>
        </Card>
        <UniversalModal
          title="Lista de Terapeutas"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          width={730}
          className="therapist-list-modal modal-themed"
          destroyOnClose={true}
          centered={true}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Cancelar
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleOk}
              disabled={!selectedTherapistId}
            >
              Seleccionar
            </Button>,
          ]}
        >
          <CustomSearch
            placeholder="Buscar por Apellido/Nombre o DNI..."
            onSearch={(value) => setSearchTerm(value)}
            width="100%"
            style={{ marginBottom: 16 }}
          />
          <Table
            columns={columns}
            dataSource={staff}
            rowKey="id"
            loading={loading}
            scroll={{ x: 'max-content' }}
            pagination={false}
            rowClassName={() => styles.tableRow}
          />
        </UniversalModal>
        <UniversalModal
          title="Vista Previa - Ticket"
          open={showTicketModal}
          onCancel={() => setShowTicketModal(false)}
          footer={null}
          width={420}
          className="ticket-modal modal-themed"
          destroyOnClose={true}
          centered={true}
          styles={{ body: { padding: '0 !important', backgroundColor: 'var(--color-background-primary) !important' } }}
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
                    'DD-MM-YYYY',
                  ),
                  patient:
                    `${patientHistory?.data?.patient?.paternal_lastname || ''} ${patientHistory?.data?.patient?.maternal_lastname || ''} ${patientHistory?.data?.patient?.name || ''}`.trim(),
                  service: 'Consulta',
                  unit: 1,
                  amount: `S/ ${Number(selectedAppointment.payment).toFixed(2)}`,
                  paymentType:
                    selectedAppointment.payment_type?.name || 'Sin especificar',
                }}
              />
            </PDFViewer>
          )}
        </UniversalModal>
        <UniversalModal
          title="Vista Previa - Ficha"
          open={showFichaModal}
          onCancel={() => setShowFichaModal(false)}
          footer={null}
          width={420}
          className="ficha-modal modal-themed"
          destroyOnClose={true}
          centered={true}
          styles={{ body: { padding: '0 !important', backgroundColor: 'var(--color-background-primary) !important' } }}
        >
          {selectedAppointment && patientHistory?.data && (
            <PDFViewer width="100%" height={600} showToolbar={true}>
              <FichaPDF
                cita={selectedAppointment}
                paciente={patientHistory.data.patient}
                visitas={appointments.length}
                historia={patientHistory.data}
              />
            </PDFViewer>
          )}
        </UniversalModal>
      </div>
  );
};

export default PatientHistory;
