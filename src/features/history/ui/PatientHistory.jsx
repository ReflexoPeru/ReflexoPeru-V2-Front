import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Modal,
  Table,
  Radio,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Typography,
  ConfigProvider,
} from 'antd';
import styles from './PatientHistory.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import CustomSearch from '../../../components/Search/CustomSearch';
import { useStaff, usePatientHistory, usePatientAppointments }  from '../hook/historyHook';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';



const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;



const theme = {
  token: {
    colorPrimary: '#4caf50',
    colorBgContainer: '#222',
    colorText: '#eee',
    colorBorder: '#333',
    colorBgElevated: '#222',
    colorTextHeading: '#4caf50',
    colorTextLabel: '#4caf50',
    borderRadius: 6,
    fontSize: 14,
    fontFamily: 'Arial, sans-serif',
    colorTextLightSolid: '#111',
  },
  components: {
    Table: {
            headerBg: '#272727', 
            headerColor: 'rgba(199,26,26,0.88)',
            colorBgContainer: '#272727',                 
            borderColor: '#555555',                  
            rowHoverBg: '#555555',                    
            cellPaddingBlock: 12,                     
            cellPaddingInline: 16, 
          },
    Radio: {
      colorPrimary: '#4caf50',
      colorBgContainer: '#fff',
    },
    Button: {
      colorPrimary: '#4caf50',
      colorPrimaryHover: '#388e3c',
      colorPrimaryActive: '#2e7d32',
      defaultBorderColor: '#333',
      defaultColor: '#eee',
      defaultBg: '#333',
      dangerBorderColor: '#f44336',
      dangerColor: '#eee',
      dangerBg: '#f44336',
    },
    Input: {
      colorBgContainer: '#222',
      colorBorder: '#333',
      colorText: '#eee',
      colorTextDisabled: '#eee',
      activeBorderColor: '#4caf50',
      hoverBorderColor: '#4caf50',
    },
    Select: {
      colorBgContainer: '#222',
      colorBorder: '#333',
      colorText: '#eee',
      optionSelectedBg: '#2e7d32',
      optionSelectedColor: '#111',
      optionActiveBg: '#333',
    },
    DatePicker: {
      colorBgContainer: '#222',
      colorBorder: '#333',
      colorText: '#eee',
      cellActiveWithRangeBg: '#2e7d32',
      cellHoverBg: '#333',
      panelBg: '#222',
      panelInputBg: '#222',
      colorTextHeading: '#eee',
      colorTextDescription: '#eee',
      colorIcon: '#eee',
      colorIconHover: '#4caf50',
      cellBg: '#222',
      cellColor: '#eee',
      cellActiveBg: '#2e7d32',
      timeColumnBg: '#222',
    },
    Card: {
      colorBgContainer: '#111',
      colorBorderSecondary: '#2e7d32',
    },
    Form: {
      labelColor: '#4caf50',
      itemMarginBottom: 16,
    },
  },
};

const PatientHistory = () => {
  const [form] = Form.useForm();
  const [therapist, setTherapist] = useState(null);
  const [showTherapistDropdown, setShowTherapistDropdown] = useState(false);
  const [selectedAppointmentDate, setSelectedAppointmentDate] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTherapistId, setSelectedTherapistId] = useState(null);
  const { staff, loading, setSearchTerm } = useStaff();

  const { id } = useParams()
  const { data: patientHistory } = usePatientHistory(id)
  const isFemale = patientHistory?.data?.patient?.sex === 'F';

  const { 
    appointments, 
    lastAppointment,
    loadingAppointments, 
    appointmentsError, 
    contextHolder 
  } = usePatientAppointments(id);

  // Memoize appointment dates to prevent unnecessary recalculations
  const appointmentDates = useMemo(() => {
    return [...new Set(appointments?.map(a => a.appointment_date) || [])];
  }, [appointments]);

  // // Memoize the selected appointment data
  // const selectedAppointmentData = useMemo(() => {
  //   if (!selectedAppointmentDate || !appointments) return null;
  //   return appointments.find(a => a.appointment_date === selectedAppointmentDate);
  // }, [selectedAppointmentDate, appointments]);

  
  useEffect(() => {
  if (patientHistory && patientHistory.data && patientHistory.data.patient) {
    const { patient, ...historyData } = patientHistory.data;
    const isFemale = patient?.sex === 'F'; 
    
    form.setFieldsValue({
      // Información del paciente con verificación segura
      patientName: `${patient?.paternal_lastname || ''} ${patient?.maternal_lastname || ''} ${patient?.name || ''}`.trim(),
      
      // Observaciones
      observationPrivate: historyData?.private_observation || '',
      observation: historyData?.observation || '',
      
      // Información física
      talla: historyData?.height || '',
      pesoInicial: historyData?.weight || '',
      ultimoPeso: historyData?.last_weight || '',
      
      // Información médica
      testimonio: historyData?.testimony ? 'Sí' : 'No',
      gestacion: isFemale ? (historyData?.gestation ? 'Sí' : 'No') : undefined,
      menstruacion: isFemale ? (historyData?.menstruation ? 'Sí' : 'No') : undefined,
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
      fechaInicio: dayjs(),
    });

    // Manejo del terapeuta con verificación segura
    if (historyData?.therapist) {
      setTherapist(historyData.therapist.full_name || '');
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
    (a) => a.appointment_date === selectedAppointmentDate
  );

  if (selectedAppointment) {
    form.setFieldsValue({
      diagnosticosMedicos: selectedAppointment.diagnosis ?? '',
      dolencias: selectedAppointment.ailments ?? '',
      medicamentos: selectedAppointment.medications ?? '',
      operaciones: selectedAppointment.surgeries ?? '',
      observacionesAdicionales: selectedAppointment.observation ?? '',
      diagnosticosReflexologia: selectedAppointment.reflexology_diagnostics ?? '',
      therapist: selectedAppointment.therapist?.full_name ?? '',
    });

    setTherapist(selectedAppointment.therapist?.full_name ?? null);
    setSelectedTherapistId(selectedAppointment.therapist?.id ?? null);
  }
}, [selectedAppointmentDate, appointments]);

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
      const selected = staff.find(t => t.id === selectedTherapistId);
      if (selected) {
        setTherapist(selected.full_name );
        form.setFieldsValue({ therapist: selected.full_name  });
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

  const onFinish = (values) => {
    console.log('Valores del formulario:', values);
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
          style={{ color: '#ffffff' }} 
        />
      ),
      width: 150,
    },
    {
      title: 'Terapeuta',
      dataIndex: 'full_name',
      key: 'name',
    },
  ];


  return (
    <ConfigProvider theme={theme}>
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
            <Form.Item
              name="patientName"
              label="Paciente"
              className={styles.formItem}
            >
              <Input disabled className={styles.input} />
            </Form.Item>

            <Form.Item
              name="observationPrivate"
              label="Observación"
              className={styles.formItem}
            >
              <TextArea rows={2} className={styles.textarea} />
            </Form.Item>

            <Title level={3} className={styles.sectionTitle}>
              Citas
            </Title>

            <Form.Item label="Fecha de la Cita" className={styles.formItem}>
              <Select
                value={selectedAppointmentDate}
                onChange={setSelectedAppointmentDate}
                className={styles.select}
                placeholder="Seleccione una fecha"
                loading={loadingAppointments}
              >
                {appointmentDates.map(date => (
                  <Option key={date} value={date}>
                    {dayjs(date).format('DD/MM/YYYY')}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="therapist"
              label="Terapeuta"
              className={styles.formItem}
            >
              <div className={styles.therapistContainer}>
                <Input
                  disabled
                  value={therapist || 'No se ha seleccionado terapeuta'}
                  className={styles.input}
                />
                <div className={styles.therapistButtons}>
                  <Button
                    type="primary"
                    onClick={showTherapistModal}
                    className={styles.selectButton}
                  >
                    Seleccionar
                  </Button>
                  {therapist && (
                    <Button
                      danger
                      onClick={handleRemoveTherapist}
                      className={styles.removeButton}
                    >
                      Eliminar
                    </Button>
                  )}
                </div>
                {showTherapistDropdown && (
                  <div className={styles.therapistDropdown}>
                    {therapists.map((t) => (
                      <div
                        key={t.id}
                        className={styles.dropdownItem}
                        onClick={() => handleTherapistChoose(t)}
                      >
                        {t.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Form.Item>

            <div className={styles.threeColumnLayout}>
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
                  name="dolencias"
                  label="Dolencias"
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
            </div>

            <div className={styles.threeColumnLayout}>
              <div className={styles.column}>
                <Form.Item
                  name="operaciones"
                  label="Operaciones"
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
              >
                <Input className={styles.input} />
              </Form.Item>

              <Form.Item
                name="pesoInicial"
                label="Peso Inicial"
                className={styles.physicalInfoItem}
              >
                <Input className={styles.input} />
              </Form.Item>

              <Form.Item
                name="ultimoPeso"
                label="Último Peso"
                className={styles.physicalInfoItem}
              >
                <Input className={styles.input} />
              </Form.Item>

              <Form.Item
                name="testimonio"
                label="Testimonio"
                className={styles.physicalInfoItem}
              >
                <Select className={styles.select}>
                  <Option value="Sí">Sí</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>

              {/* Mostrar solo si es mujer */}
              {isFemale && (
                <>
                  <Form.Item
                    name="gestacion"
                    label="Gestación"
                    className={styles.physicalInfoItem}
                  >
                    <Select className={styles.select}>
                      <Option value="Sí">Sí</Option>
                      <Option value="No">No</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="menstruacion"
                    label="Menstruación"
                    className={styles.physicalInfoItem}
                  >
                    <Select className={styles.select}>
                      <Option value="Sí">Sí</Option>
                      <Option value="No">No</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="tipoDIU"
                    label="Tipo DIU"
                    className={styles.physicalInfoItem}
                  >
                    <Input className={styles.input} />
                  </Form.Item>
                </>
              )}
            </div>

            <div className={styles.bottomSection}>
              <Form.Item
                name="fechaInicio"
                label="Fecha de Inicio"
                className={styles.startDateSection}
              >
                <DatePicker
                  className={styles.datePicker}
                  format="DD-MM-YY"
                />
              </Form.Item>

              <div className={styles.actionButtons}>
                <Button className={styles.printButton}>Imprimir Ticket</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.saveButton}
                >
                  Guardar Cambios
                </Button>
                <Button className={styles.cancelButton}>Cancelar</Button>
              </div>
            </div>
          </Form>
        </Card>
        <Modal
          title="Lista de Terapeutas"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          width={800}
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
            scroll={{ y: 200 }}
            pagination={false}
            rowClassName={() => styles.tableRow}
          />
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default PatientHistory;
