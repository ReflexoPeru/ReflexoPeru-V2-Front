import {
  Button,
  Form,
  Radio,
  Table,
  notification,
  DatePicker,
  TimePicker,
  Select,
  Input,
  Checkbox,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  Tooltip,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import UniversalModal from '../../../../components/Modal/UniversalModal';
import dayjs from '../../../../utils/dayjsConfig';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FormComponent from '../../../../components/Form/Form';
import CustomSearch from '../../../../components/Search/CustomSearch';
import NewPatient from '../../../patients/ui/RegisterPatient/NewPatient';
import { useAppointments, usePatients } from '../../hook/appointmentsHook';
import styles from '../RegisterAppointment/NewAppointment.module.css';
import SelectPaymentStatus from '../../../../components/Select/SelectPaymentStatus';
import SelectPrices from '../../../../components/Select/SelectPrices';

const NewAppointment = ({ onSubmit, onCancel, isModal = false, ghlInitialValues = null, prefillPatient = null, prefillDate = null }) => {
  const [showHourField, setShowHourField] = useState(false);
  const [isPaymentRequired, setIsPaymentRequired] = useState(true);
  const [patientType, setPatientType] = useState('continuador');
  const [formValues, setFormValues] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreatePatientModalVisible, setIsCreatePatientModalVisible] =
    useState(false);
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState('');
  const [isCustomRate, setIsCustomRate] = useState(false);
  const [isFreeCoupon, setIsFreeCoupon] = useState(false);

  const { submitNewAppointment } = useAppointments();
  const { patients, loading, setSearchTerm, fetchPatients } = usePatients(true);

  // Usar form de Ant Design
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const location = useLocation();

  // Datos del prospecto que llega desde el panel de Citas Web (GoHighLevel)
  const ghlLead = location.state?.fromGhl ? location.state.ghlLead : null;
  const isFromGhl = !!ghlInitialValues || !!ghlLead;



  // Si viene desde el panel de Citas Web, pre-llenar la fecha y el tipo de paciente
  useEffect(() => {
    if (ghlLead) {
      // Pre-llenar fecha si viene del prospecto
      if (ghlLead.start_time) {
        const fecha = dayjs(ghlLead.start_time);
        if (fecha.isValid()) {
          form.setFieldsValue({ appointment_date: fecha });
          setShowHourField(true);
          form.setFieldsValue({ appointment_hour: fecha.format('HH:mm') });
        }
      }
      setPatientType('nuevo');
    }
  }, [ghlLead]);

  // Si viene con paciente y fecha pre-cargados desde fuera (flujo GHL modal)
  useEffect(() => {
    if (prefillPatient) {
      const displayName = prefillPatient.full_name ||
        `${prefillPatient.paternal_lastname || ''} ${prefillPatient.maternal_lastname || ''} ${prefillPatient.name || ''}`.trim();
      setSelectedPatient({ ...prefillPatient, full_name: displayName });
      form.setFieldsValue({ patient_id: prefillPatient.id });
    }
    if (prefillDate) {
      const fecha = dayjs(prefillDate);
      if (fecha.isValid()) {
        form.setFieldsValue({ appointment_date: fecha });
        if (fecha.hour() !== 0 || fecha.minute() !== 0) {
          setShowHourField(true);
          form.setFieldsValue({ appointment_hour: fecha.format('HH:mm') });
        }
      }
    }
  }, [prefillPatient, prefillDate]);

  useEffect(() => {
    const unsubscribe = form.subscribe?.(() => {
      const paymentTypeId = form.getFieldValue('payment_type_id');
      const prices = form.getFieldInstance?.('payment_type_id')?.props?.options;
      if (prices && paymentTypeId) {
        const selected = prices.find((item) => item.value === paymentTypeId);
        if (selected) {
          form.setFieldsValue({ payment: selected.price });
        }
      }
    });
    return () => unsubscribe && unsubscribe();
  }, [form]);

  const handlePriceChange = (price) => {
    form.setFieldsValue({ payment: price });
    setSelectedPrice(price);
  };

  const handleServiceChange = (serviceId) => {
    form.setFieldsValue({
      service_id: serviceId,
    });

    // Buscar el servicio seleccionado para verificar si es "cupon sin costo" o "tarifa personalizada"
    if (serviceId) {
      // Obtener las opciones de precios predeterminados
      const fetchServiceInfo = async () => {
        try {
          const { getPredeterminedPrices } = await import('../../../../components/Select/SelectsApi');
          const prices = await getPredeterminedPrices();
          const selectedService = prices.find(item => String(item.value) === String(serviceId));

          if (selectedService) {
            const serviceName = selectedService.label?.toLowerCase() || '';

            // Verificar si es "tarifa personalizada"
            if (serviceName.includes('tarifa personalizada')) {
              setIsCustomRate(true);
              form.setFieldsValue({
                payment: '', // Limpiar el monto
                payment_type_id: '', // Limpiar método de pago
              });
            } else {
              setIsCustomRate(false);
            }

            // Verificar si el nombre contiene "cupon sin costo" (case insensitive)
            if (serviceName.includes('cupon sin costo') || serviceName.includes('cupón sin costo')) {
              // Para cupón sin costo: preseleccionar ID 11 y establecer monto en 0
              setIsFreeCoupon(true);
              setIsCustomRate(false);
              setTimeout(() => {
                form.setFieldsValue({
                  payment_type_id: '11', // Preseleccionar "CUPÓN SIN COSTO"
                  payment: '0', // Establecer monto en 0
                });
              }, 0);
            } else if (serviceName.includes('tarifa personalizada')) {
              setIsFreeCoupon(false);
              setIsCustomRate(true);
              form.setFieldsValue({
                payment_type_id: '9', // Por defecto Yape
                payment: '', // Limpiar para que ingresen monto
              });
            } else {
              // Si se cambia a otra opción, desbloquear campos y resetear método de pago si era cupón
              setIsFreeCoupon(false);
              setIsCustomRate(false);
              // Si el método actual era cupón, lo cambiamos a Yape o vacío para que desaparezca la opción inválida
              if (form.getFieldValue('payment_type_id') === '11') {
                form.setFieldsValue({
                  payment_type_id: '9', // Por defecto Yape para tarifas normales
                });
              }
            }
          }
        } catch (error) {
        }
      };

      fetchServiceInfo();
    } else {
      setIsCustomRate(false);
      setIsFreeCoupon(false);
    }
  };

  const handleSubmit = async (values) => {
    console.log('Formulario enviado con valores:', values);
    console.log('Estado de isPaymentRequired:', isPaymentRequired);
    console.log('Paciente seleccionado:', selectedPatient);

    if (!values.appointment_date) {
      notification.error({
        message: 'Error',
        description: 'La fecha de la cita es requerida',
      });
      return;
    }

    if (!selectedPatient) {
      notification.error({
        message: 'Error',
        description: 'Debe seleccionar o crear un paciente primero',
      });
      return;
    }

    if (isPaymentRequired) {
      if (!values.service_id) {
        notification.error({
          message: 'Error',
          description: 'Las opciones de pago son requeridas',
        });
        return;
      }

      if (!values.payment_type_id) {
        notification.error({
          message: 'Error',
          description: 'El método de pago es requerido',
        });
        return;
      }

      if (!values.payment) {
        notification.error({
          message: 'Error',
          description: 'El monto es requerido',
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const appointment_status_id = 1; // Siempre pendiente al crear

      const payload = {
        ...values,
        appointment_status_id,
        patient_id: selectedPatient.id,
        ...(values.payment && { payment: parseFloat(values.payment) }),
        ...(values.payment_type_id && { payment_type_id: Number(values.payment_type_id) }),
        service_id: values.service_id ? Number(values.service_id) : undefined,
        // Si viene de GHL, pasamos el ID original para marcarlo como convertido
        ghl_booking_id: ghlInitialValues?.ghl_booking_id || (prefillDate ? ghlInitialValues?.ghl_booking_id : null) || location.state?.ghlLead?.ghl_booking_id
      };

      console.log('Payload enviado al servidor:', payload);

      await submitNewAppointment(payload);

      notification.success({
        message: 'Cita registrada',
        description: 'La cita se ha registrado correctamente',
      });

      form.resetFields();
      setSelectedPatient(null);
      setPatientType('continuador');
      setShowHourField(false);
      setIsPaymentRequired(false);

      if (isModal && onSubmit) {
        // En modo modal: el padre controla qué pasa después (cerrar modal, recargar tabla, etc.)
        onSubmit();
      } else {
        navigate('/Inicio/citas');
      }
    } catch (error) {
      console.error('Error al registrar la cita:', error);
      notification.error({
        message: 'Error',
        description: error.response?.data?.message || 'No se pudo registrar la cita. Por favor intente nuevamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsCreatePatientModalVisible(false);
    setIsModalVisible(false);
    if (isModal && onCancel) {
      onCancel();
    } else {
      navigate('/Inicio/citas');
    }
  };

  const handleCancelSelectModal = () => {
    setIsModalVisible(false);
    setSelectedRowKey(null);
  };

  const handleCancelCreateModal = () => {
    setIsCreatePatientModalVisible(false);
  };

  const handleOpenCreateModal = () => {
    setIsCreatePatientModalVisible(true);
  };

  const handleOpenSelectModal = () => {
    setIsModalVisible(true);
  };

  const handleChangeSelectedPatient = (newPatient) => {
    setSelectedPatient(newPatient);
    form.setFieldsValue({ patient_id: newPatient?.id });
  };

  const handleLogServerResponse = (result) => {
    if (result && typeof result === 'object') {
      // Concatenar el nombre completo
      const concatenatedName =
        `${result.name} ${result.paternal_lastname} ${result.maternal_lastname}`.trim();

      // Convertir todo el objeto a string
      const stringified = JSON.stringify(result);

      // Guardar en estado
      setSelectedPatient({
        ...result,
        full_name: concatenatedName,
        stringifiedData: stringified,
      });
      form.setFieldsValue({ patient_id: result.id });
    } else {
      console.error('El resultado no es un objeto válido:', result);
    }
  };

  // Eliminamos appointmentFields para usar formulario directo como EditAppointment

  const processedPatients = patients.map((patient, index) => ({
    ...patient,
    key: patient.id || `patient-${index}`,
    // Crear el formato: apellido paterno, apellido materno, nombres
    display_name: `${patient.paternal_lastname || ''} ${patient.maternal_lastname || ''} ${patient.name || ''}`.trim(),
  }));

  const columns = [
    {
      title: '',
      dataIndex: 'selection',
      width: 50,
      render: (_, record) => (
        <Radio
          value={record.key}
          checked={selectedRowKey === record.key}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRowKey(record.key);
            }
          }}
          style={{ color: 'var(--color-text-primary)' }}
        />
      ),
    },
    {
      title: 'Apellido Paterno',
      dataIndex: 'paternal_lastname',
      key: 'paternal_lastname',
      width: 150,
      render: (text) => (
        <span style={{ color: 'var(--color-text-primary)' }}>{text}</span>
      ),
    },
    {
      title: 'Apellido Materno',
      dataIndex: 'maternal_lastname',
      key: 'maternal_lastname',
      width: 150,
      render: (text) => (
        <span style={{ color: 'var(--color-text-primary)' }}>{text}</span>
      ),
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text) => (
        <span style={{ color: 'var(--color-text-primary)' }}>{text}</span>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ color: 'var(--color-text-primary)' }}
      >
        {/* TÍTULO (Oculto en modal por redundancia) */}
        {!isModal && (
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
            <h2 style={{
              color: 'var(--color-text-primary)',
              fontSize: 'var(--font-size-xxl)',
              fontWeight: 'var(--font-weight-bold)',
              fontFamily: 'var(--font-family)'
            }}>
              REGISTRAR CITA
            </h2>
          </div>
        )}

        {/* BANNER: Datos del prospecto (GHL) - Súper Minimalista */}
        {isFromGhl && (
          <div style={{
            marginBottom: '24px',
            padding: '16px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
            border: '1px solid #BBF7D0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <UserOutlined style={{ color: '#166534', fontSize: '16px' }} />
              <span style={{ fontWeight: 700, fontSize: '13px', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Agendando para:
              </span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: '#14532D', marginLeft: '26px' }}>
              {selectedPatient?.full_name || ghlLead?.name || 'Cargando...'}
            </div>
            <div style={{ fontSize: '12px', color: '#166534', marginLeft: '26px', marginTop: '4px', opacity: 0.8 }}>
              Servicio solicitado: <strong style={{ textTransform: 'uppercase' }}>{ghlLead?.service || ghlInitialValues?.service || 'Consulta GHL'}</strong>
            </div>
          </div>
        )}

        {/* BANNER ORIGINAL COMPACTO (Solo si no es flujo modal GHL) */}
        {!isFromGhl && ghlLead && (
          <div style={{
            marginBottom: '20px',
            padding: '12px 16px',
            borderRadius: '10px',
            background: '#F0F9FF',
            border: '1px solid #BAE6FD',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0EA5E9' }} />
              <span style={{ fontWeight: 600, fontSize: '12px', color: '#0369A1', textTransform: 'uppercase' }}>
                Datos de la Solicitud Web
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#475569' }}>
               Nombre: <strong>{ghlLead.name}</strong> &nbsp;·&nbsp; Tel: <strong>{ghlLead.phone}</strong> &nbsp;·&nbsp; Servicio: <strong>{ghlLead.service}</strong>
            </div>
          </div>
        )}

        {/* 
            SECCIÓN: FECHA DE CITA
            Campo requerido para establecer cuándo se realizará la cita
          */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="appointment_date"
              label="Fecha de cita"
              rules={[{ required: true, message: 'La fecha es requerida' }]}
              initialValue={dayjs()}
            >
              <DatePicker
                style={{
                  width: '100%'
                }}
                format="DD-MM-YYYY"
                placeholder="Seleccionar fecha"
                allowClear={false}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Espacio entre secciones */}
        <div style={{ height: 'var(--spacing-md)' }} />

        {/* SECCIÓN: TIPOS DE PACIENTES (OCULTA SI ES GHL PARA MÁXIMA LIMPIEZA) */}
        {!isFromGhl && (
          <>
            <Row gutter={16} align="middle">
              <Col span={5}>
                <span className={styles.patientTypeLabel}>
                  Tipo de Paciente:
                </span>
              </Col>
              <Col span={10}>
                <Radio.Group
                  value={patientType}
                  onChange={(e) => {
                    setPatientType(e.target.value);
                    setSelectedPatient(null);
                  }}
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                    <Radio value="nuevo" style={{ color: 'var(--color-text-primary)' }}>
                      Nuevo
                    </Radio>
                    <Radio value="continuador" style={{ color: 'var(--color-text-primary)' }}>
                      Continuador
                    </Radio>
                  </div>
                </Radio.Group>
              </Col>
              <Col span={9}>
                <Button
                  type="primary"
                  onClick={() => {
                    if (patientType === 'nuevo') {
                      setIsCreatePatientModalVisible(true);
                    } else {
                      setIsModalVisible(true);
                    }
                  }}
                  style={{
                    width: '100%',
                    height: 'var(--button-height-md)',
                    fontSize: 'var(--font-size-sm)',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    fontWeight: 'var(--font-weight-bold)',
                    fontFamily: 'var(--font-family)'
                  }}
                >
                  {patientType === 'nuevo' ? 'Crear Paciente' : 'Seleccionar Paciente'}
                </Button>
              </Col>
            </Row>
            <div style={{ height: 'var(--spacing-md)' }} />
          </>
        )}

        {/* 
            SECCIÓN: PACIENTE SELECCIONADO (OCULTA SI ES GHL PORQUE YA HAY BANNER)
          */}
        {!isFromGhl && (
          <>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Paciente" required>
                  <Input
                    value={selectedPatient?.full_name || ''}
                    readOnly
                    style={{
                      backgroundColor: 'var(--color-input-bg)',
                      border: '1px solid var(--color-border-primary)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--color-input-text)'
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <div style={{ height: 'var(--spacing-md)' }} />
          </>
        )}

        {/* Separador visual entre secciones */}
        <Divider style={{ borderColor: 'var(--color-border-primary)', marginTop: '1px', marginBottom: '8px' }} />

        {/* SECCIÓN: CHECKBOXES Y HORA */}
        <Row gutter={16} align="middle">
          <Col span={24}>
            <div style={{
              display: 'flex',
              gap: '24px',
              alignItems: 'center',
              marginTop: '0px',
              marginBottom: '24px'
            }}>
              <Checkbox
                checked={!isPaymentRequired}
                onChange={(e) => {
                  const checked = !e.target.checked;
                  setIsPaymentRequired(checked);
                }}
                style={{ color: 'var(--color-text-primary)' }}
              >
                Reservar cita
                <Tooltip title="Si seleccionas esta opción, no será necesario llenar las opciones de pago para registrar la cita.">
                  <span style={{ cursor: 'pointer', color: 'var(--color-text-secondary)', marginLeft: '8px' }}>?</span>
                </Tooltip>
              </Checkbox>

              <Checkbox
                checked={showHourField}
                onChange={(e) => setShowHourField(e.target.checked)}
                style={{ color: 'var(--color-text-primary)' }}
              >
                Incluir hora
                <Tooltip title="Selecciona esta opción si deseas incluir una hora específica para la cita.">
                  <span style={{ cursor: 'pointer', color: 'var(--color-text-secondary)', marginLeft: '8px' }}>?</span>
                </Tooltip>
              </Checkbox>
            </div>
          </Col>
        </Row>

        {/* SECCIÓN: HORA DE CITA - SOLO SE MUESTRA SI EL CHECKBOX ESTÁ MARCADO */}
        {showHourField && (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="appointment_hour"
                label="Hora de cita"
                getValueFromEvent={(time) => time ? time.format('HH:mm') : null}
                getValueProps={(value) => ({
                  value: value ? dayjs(value, 'HH:mm') : null
                })}
              >
                <TimePicker
                  style={{
                    width: '100%'
                  }}
                  format="h:mm A"
                  placeholder="Seleccionar hora"
                  allowClear
                  use12Hours={false}
                  minuteStep={10}
                  showNow={false}
                  hideDisabledOptions
                  popupClassName={styles.customTimePickerDropdown}
                  dropdownClassName={styles.customTimePickerDropdown}
                  disabledHours={() => {
                    const hours = [];
                    for (let i = 0; i < 24; i++) {
                      if (i < 7 || i > 13) {
                        hours.push(i);
                      }
                    }
                    return hours;
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        {/* 
            SECCIÓN: OPCIONES DE PAGO
            Campo para seleccionar el servicio y opciones de pago
          */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="service_id"
              label="Opciones de Pago"
              rules={isPaymentRequired ? [{ required: true, message: 'Las opciones de pago son requeridas' }] : []} // Validar solo si es requerido
            >
              <SelectPrices
                value={form.getFieldValue('service_id')}
                initialPrice={form.getFieldValue('payment')}
                onChange={handleServiceChange}
                onPriceChange={(price) => {
                  form.setFieldsValue({ payment: price });
                  handlePriceChange(price);
                }}
                placeholder="Selecciona una opción"
                hidePriceInput={true}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Espacio entre secciones */}
        <div style={{ height: 'var(--spacing-sm)' }} />

        {/* 
            SECCIÓN: MÉTODO DE PAGO
            Campo para seleccionar el tipo de método de pago
          */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="payment_type_id"
              label="Método de Pago"
              rules={isPaymentRequired ? [{ required: true, message: 'El método de pago es requerido' }] : []} // Validar solo si es requerido
            >
              <SelectPaymentStatus
                value={form.getFieldValue('payment_type_id')}
                showFreeCoupon={isFreeCoupon}
                disabled={isFreeCoupon}
                onChange={(value) =>
                  form.setFieldsValue({ payment_type_id: value })
                }
                placeholder="Selecciona método de pago"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Espacio entre secciones */}
        <div style={{ height: 'var(--spacing-sm)' }} />

        {/* 
            SECCIÓN: CAMPO DE MONTO
            Input numérico para el monto del pago con validaciones
          */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="payment"
              label="Monto"
              rules={isPaymentRequired ? [{ required: true, message: 'El monto es requerido' }] : []} // Validar solo si es requerido
            >
              <Input
                prefix="S/"
                type="number"
                step="0.01"
                min="0"
                readOnly={!isCustomRate || isFreeCoupon}
                disabled={isFreeCoupon}
                placeholder={isFreeCoupon ? "Cupón sin costo (S/ 0)" : isCustomRate ? "Ingrese el monto" : "Seleccione una opción de pago"}
                style={{
                  backgroundColor: isFreeCoupon ? 'var(--color-background-secondary)' : isCustomRate ? 'var(--color-background-primary)' : 'var(--color-background-secondary)',
                  cursor: isFreeCoupon ? 'not-allowed' : isCustomRate ? 'text' : 'not-allowed'
                }}
              />
            </Form.Item>
          </Col>
        </Row>



        {/* 
            SECCIÓN: BOTONES DE ACCIÓN
            Botones para cancelar la edición o guardar los cambios
          */}
        <Row justify="end" style={{ marginTop: 'var(--spacing-lg)' }}>
          <Col>
            <Space>
              <Button
                onClick={handleCancel}
                style={{
                  backgroundColor: 'var(--color-background-secondary)',
                  borderColor: 'var(--color-border-primary)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-family)'
                }}
              >
                Cancelar
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                style={{
                  fontFamily: 'var(--font-family)'
                }}
              >
                Registrar Cita
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>

      {/* MODAL SELECCIONAR CONTRIBUIDOR */}
      <UniversalModal
        title="Seleccionar Contribuidor"
        open={isModalVisible}
        centered
        width={700}
        onCancel={handleCancelSelectModal}
        className="select-contributor-modal modal-themed"
        destroyOnClose={true}
        footer={[
          <Button
            key="cancel"
            onClick={handleCancelSelectModal}
          >
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={async () => {
              if (!selectedRowKey) {
                notification.warning({
                  message: 'Advertencia',
                  description: 'Por favor seleccione un paciente primero',
                });
                return;
              }

              const selectedPatient = processedPatients.find(
                (p) => p.key === selectedRowKey,
              );
              setSelectedPatient(selectedPatient);
              form.setFieldsValue({ patient_id: selectedPatient.id });

              setIsModalVisible(false);
              setSelectedRowKey(null);

              notification.success({
                message: 'Paciente seleccionado',
                description: `Se ha seleccionado a ${selectedPatient.display_name}`,
              });
            }}
            style={{
              fontFamily: 'var(--font-family)'
            }}
          >
            Seleccionar
          </Button>,
        ]}
      >
        <CustomSearch
          placeholder="Buscar por Apellido/Nombre o DNI..."
          onSearch={(value) => setSearchTerm(value)}
          width="100%"
          style={{ marginBottom: 'var(--spacing-lg)' }}
        />
        <Table
          dataSource={processedPatients}
          columns={columns}
          pagination={false}
          rowKey="key"
          loading={loading}
          size="middle"
          onRow={(record) => ({
            onClick: () => {
              setSelectedRowKey(record.key);
            },
            style: {
              cursor: 'pointer',
              backgroundColor: selectedRowKey === record.key ? 'var(--color-primary-light)' : 'transparent'
            }
          })}
          style={{
            backgroundColor: 'var(--color-background-primary)',
            color: 'var(--color-text-primary)'
          }}
        />
      </UniversalModal>

      {/* MODAL NUEVO PACIENTE */}
      <UniversalModal
        title="Crear Nuevo Paciente"
        open={isCreatePatientModalVisible}
        onCancel={handleCancelCreateModal}
        footer={null}
        width={800}
        destroyOnClose={true}
        centered={true}
        className="create-patient-modal modal-themed"
      >
        <NewPatient
          onCancel={handleCancelCreateModal}
          isModal={true}
          onSubmit={(result) => {
            if (result && typeof result === 'object') {
              // Crear el formato: apellido paterno, apellido materno, nombres
              const displayName =
                `${result.paternal_lastname || ''} ${result.maternal_lastname || ''} ${result.name || ''}`.trim();

              // Convertir todo el objeto a string
              const stringified = JSON.stringify(result);

              // Guardar en estado
              const newPatient = {
                ...result,
                full_name: displayName, // Mantener para compatibilidad
                display_name: displayName, // Nuevo formato
                stringifiedData: stringified,
              };

              setSelectedPatient(newPatient);
              form.setFieldsValue({ patient_id: result.id });

              setIsCreatePatientModalVisible(false);

              // Mostrar notificación de éxito
              notification.success({
                message: 'Paciente creado',
                description: `Se ha creado el paciente ${displayName}`,
              });
            } else {
              console.error('El resultado no es un objeto válido:', result);
              notification.error({
                message: 'Error',
                description: 'No se pudo crear el paciente correctamente',
              });
            }
          }}
        />
      </UniversalModal>
    </div>
  );
};

// Ensure the default export is properly defined
export default NewAppointment;
