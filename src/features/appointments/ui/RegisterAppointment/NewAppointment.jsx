import {
  Button,
  ConfigProvider,
  Form,
  Modal,
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
} from 'antd';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormComponent from '../../../../components/Form/Form';
import CustomSearch from '../../../../components/Search/CustomSearch';
import NewPatient from '../../../patients/ui/RegisterPatient/NewPatient';
import { useAppointments, usePatients } from '../../hook/appointmentsHook';
import styles from '../RegisterAppointment/NewAppointment.module.css';
import SelectPaymentStatus from '../../../../components/Select/SelectPaymentStatus';
import SelectPrices from '../../../../components/Select/SelectPrices';

const NewAppointment = () => {
  const [showHourField, setShowHourField] = useState(false);
  const [isPaymentRequired, setIsPaymentRequired] = useState(false);
  const [patientType, setPatientType] = useState('continuador');
  const [formValues, setFormValues] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreatePatientModalVisible, setIsCreatePatientModalVisible] =
    useState(false);
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState('');

  const { submitNewAppointment } = useAppointments();
  const { patients, loading, setSearchTerm, fetchPatients } = usePatients(true);

  // Usar form de Ant Design
  const [form] = Form.useForm();

  const navigate = useNavigate();

  // Establecer fecha de hoy por defecto
  useEffect(() => {
    form.setFieldsValue({
      appointment_date: dayjs()
    });
  }, [form]);

  // Debug: Monitorear cambios en selectedPatient
  useEffect(() => {
    console.log('Selected patient changed:', selectedPatient);
  }, [selectedPatient]);

  // Sincronizar el valor de payment cada vez que cambie el select de precios
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

  // Callback para actualizar el monto
  const handlePriceChange = (price) => {
    form.setFieldsValue({ payment: price });
    setSelectedPrice(price);
  };

  /**
   * Maneja el cambio de opciones de pago desde el componente SelectPrices
   * @param {string|number} serviceId - ID del servicio seleccionado
   */
  const handleServiceChange = (serviceId) => {
    form.setFieldsValue({
      service_id: serviceId,
    });

    // Buscar el servicio seleccionado para verificar si es "cupon sin costo"
    if (serviceId) {
      // Obtener las opciones de precios predeterminados
      const fetchServiceInfo = async () => {
        try {
          const { getPredeterminedPrices } = await import('../../../../components/Select/SelectsApi');
          const prices = await getPredeterminedPrices();
          const selectedService = prices.find(item => item.value === serviceId);
          
          if (selectedService) {
            const serviceName = selectedService.label?.toLowerCase() || '';
            
            // Verificar si el nombre contiene "cupon sin costo" (case insensitive)
            if (serviceName.includes('cupon sin costo') || serviceName.includes('cupón sin costo')) {
              // Limpiar el campo de detalles de pago
              form.setFieldsValue({
                payment_type_id: '',
              });
              
              console.log('🔍 Debug - Cupon sin costo detectado, limpiando payment_type_id');
            }
          }
        } catch (error) {
          console.error('Error al verificar el servicio seleccionado:', error);
        }
      };
      
      fetchServiceInfo();
    }
  };

  const handleSubmit = async (values) => {
    console.log('Form values:', values);
    console.log('Service ID:', values.service_id);
    console.log('Payment type ID:', values.payment_type_id);
    
    // Si falta payment, usar el estado local
    let paymentValue = values.payment;
    if (!paymentValue) {
      paymentValue = selectedPrice;
    }

    if (!selectedPatient) {
      notification.error({
        message: 'Error',
        description: 'Debe seleccionar o crear un paciente primero',
      });
      return;
    }

    // Validar campos requeridos
    if (!values.appointment_date) {
      notification.error({
        message: 'Error',
        description: 'La fecha de la cita es requerida',
      });
      return;
    }
    if (!values.service_id) {
      notification.error({
        message: 'Error',
        description: 'Las opciones de pago son requeridas',
      });
      return;
    }
    
    // Validar que el service_id sea un número válido
    if (isNaN(Number(values.service_id))) {
      notification.error({
        message: 'Error',
        description: 'Las opciones de pago seleccionadas no son válidas',
      });
      return;
    }
    
    if (!values.payment_type_id) {
      notification.error({
        message: 'Error',
        description: 'El tipo de pago es requerido',
      });
      return;
    }
    if (!paymentValue) {
      notification.error({
        message: 'Error',
        description: 'El monto de pago es requerido',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Lógica para determinar appointment_status_id basada en la fecha
      const appointmentDate = dayjs(values.appointment_date);
      const currentDate = dayjs();

      let appointment_status_id;
      if (appointmentDate.isBefore(currentDate, 'day')) {
        appointment_status_id = 2;
      } else {
        appointment_status_id = 1;
      }

      if (typeof paymentValue === 'string') {
        paymentValue = paymentValue.replace(/[^\d.]/g, '');
        paymentValue = parseFloat(paymentValue);
      }

      // Eliminar patient_id del formulario y usar el del estado
      const { appointment_hour, patient_id, ...formDataWithoutHour } = values;
      const payload = {
        ...formDataWithoutHour,
        ...(showHourField && values.appointment_hour
          ? { appointment_hour: values.appointment_hour }
          : {}),
        appointment_status_id: appointment_status_id,
        patient_id: selectedPatient.id,
        payment: paymentValue,
        payment_type_id: Number(values.payment_type_id), // Convertir a número
        service_id: Number(values.service_id), // Usar service_id del formulario
      };
      
      console.log('Payload to send:', payload);
      console.log('Service ID type:', typeof payload.service_id);
      console.log('Payment type ID type:', typeof payload.payment_type_id);

      const result = await submitNewAppointment(payload);

      notification.success({
        message: 'Cita registrada',
        description: 'La cita se ha registrado correctamente',
      });

      form.resetFields();
      setSelectedPatient(null);
      setPatientType('continuador');
      setShowHourField(false);
      setIsPaymentRequired(false);
      navigate('/Inicio/citas');
    } catch (error) {
      let errorMessage =
        'No se pudo registrar la cita. Por favor intente nuevamente.';
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      }
      notification.error({
        message: 'Error',
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsCreatePatientModalVisible(false);
    setIsModalVisible(false);
    navigate('/Inicio/citas');
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
        />
      ),
    },
    {
      title: 'Apellido Paterno',
      dataIndex: 'paternal_lastname',
      key: 'paternal_lastname',
      width: 150,
    },
    {
      title: 'Apellido Materno',
      dataIndex: 'maternal_lastname',
      key: 'maternal_lastname',
      width: 150,
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: '#1cb54a',
            colorPrimaryHover: '#148235',
            colorPrimaryActive: '#148235',
            borderRadius: 6,
            fontWeight: 500,
          },
          Table: {
            headerBg: '#272727',
            headerColor: '#ffffff',
            colorBgContainer: '#272727',
            borderColor: '#555555',
            rowHoverBg: '#555555',
          },
          Radio: {
            colorPrimary: '#1cb54a',
          },
          DatePicker: {
            colorBgElevated: '#2a2a2a',
            colorText: '#ffffff',
            colorTextHeading: '#ffffff',
            colorIcon: '#1cb54a',
            colorPrimary: '#1cb54a',
            cellHoverBg: 'rgba(28, 181, 74, 0.2)',
            colorBgContainer: '#2a2a2a',
            colorBorder: '#1cb54a',
            colorTextPlaceholder: '#aaaaaa',
            cellSelectedBg: '#1cb54a',
            cellSelectedWithRangeBg: '#1cb54a',
          },
          TimePicker: {
            colorBgElevated: '#2a2a2a',
            colorText: '#ffffff',
            colorTextHeading: '#ffffff',
            colorIcon: '#1cb54a',
            colorPrimary: '#1cb54a',
            cellHoverBg: 'rgba(28, 181, 74, 0.2)',
            colorBgContainer: '#2a2a2a',
            colorBorder: '#1cb54a',
            colorTextPlaceholder: '#aaaaaa',
            cellSelectedBg: '#1cb54a',
            cellSelectedWithRangeBg: '#1cb54a',
            cellSelectedColor: '#000000',
            colorTextBase: '#000000',
          },
          Select: {
            colorBgElevated: '#333333',
            colorText: '#ffffff',
            colorTextPlaceholder: '#aaaaaa',
            controlItemBgHover: '#444444',
            selectorBg: '#333333',
          },
          Input: {
            colorBgContainer: '#333333',
            colorText: '#ffffff',
            colorBorder: '#555555',
            colorTextPlaceholder: '#aaaaaa',
          },
        },
        token: {
          colorBgElevated: '#2a2a2a',
          colorTextBase: '#000000',
          colorPrimary: '#1cb54a',
        },
      }}
    >
      <div style={{ 
        padding: '30px', 
        maxWidth: '1400px', 
        margin: '40px auto 40px auto',
        backgroundColor: '#1a1a1a',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
      }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ color: '#ffffff' }}
        >
          {/* TÍTULO */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#ffffff', fontSize: '24px', fontWeight: 'bold' }}>
              REGISTRAR CITA
            </h2>
          </div>

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
              >
                <ConfigProvider
                  theme={{
                    components: {
                      DatePicker: {
                        colorBgElevated: '#2a2a2a',
                        colorText: '#ffffff',
                        colorTextHeading: '#ffffff',
                        colorIcon: '#1cb54a',
                        colorPrimary: '#1cb54a',
                        cellHoverBg: 'rgba(28, 181, 74, 0.2)',
                        colorBgContainer: '#2a2a2a',
                        colorBorder: '#1cb54a',
                        colorTextPlaceholder: '#aaaaaa',
                        cellSelectedBg: '#1cb54a',
                        cellSelectedWithRangeBg: '#1cb54a',
                      },
                    },
                    token: {
                      colorBgElevated: '#2a2a2a',
                      colorTextBase: '#fff',
                    },
                  }}
                >
                  <DatePicker
                    style={{
                      width: '100%',
                      backgroundColor: '#2a2a2a',
                      borderColor: '#1cb54a',
                      color: '#ffffff'
                    }}
                    format="DD-MM-YYYY"
                    placeholder="Seleccionar fecha"
                    dropdownClassName="custom-dark-datepicker"
                    defaultValue={dayjs()}
                    onChange={(date) => {
                      console.log('Date changed:', date);
                      form.setFieldsValue({ appointment_date: date });
                    }}
                  />
                </ConfigProvider>
              </Form.Item>
            </Col>
          </Row>

          {/* Espacio entre secciones */}
          <div style={{ height: '24px' }} />

          {/* 
            SECCIÓN: TIPOS DE PACIENTES
            Lógica específica de Nuevo/Continuador
          */}
          <Row gutter={16} align="middle">
            <Col span={5}>
              <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '500' }}>
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
                style={{ color: '#ffffff' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Radio value="nuevo" style={{ color: '#ffffff' }}>
                    Nuevo
                  </Radio>
                  <Radio value="continuador" style={{ color: '#ffffff' }}>
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
                  height: '40px',
                  fontSize: '13px',
                  padding: '8px 12px',
                  fontWeight: 'bold'
                }}
              >
                {patientType === 'nuevo' ? 'Crear Paciente' : 'Seleccionar Paciente'}
              </Button>
            </Col>
          </Row>

          {/* Espacio entre secciones */}
          <div style={{ height: '24px' }} />

          {/* 
            SECCIÓN: PACIENTE SELECCIONADO
            Muestra el paciente seleccionado
          */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Paciente" required>
                <Input
                  value={selectedPatient?.full_name || ''}
                  
                  readOnly
                  style={{ 
                    backgroundColor: '#444444',
                    border: '1px solid #555555',
                    borderRadius: '6px'
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Espacio entre secciones */}
          <div style={{ height: '24px' }} />

          {/* Separador visual entre secciones */}
          <Divider style={{ borderColor: '#555555', marginTop: '1px' }} />

          {/* 
            SECCIÓN: OPCIONES DE PAGO
            Campo para seleccionar el servicio y opciones de pago
          */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item 
                name="service_id" 
                label="Opciones de Pago"
                rules={[{ required: true, message: 'Las opciones de pago son requeridas' }]}
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
          <div style={{ height: '12px' }} />

          {/* 
            SECCIÓN: MÉTODO DE PAGO
            Campo para seleccionar el tipo de método de pago
          */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="payment_type_id"
                label="Método de Pago"
                rules={[
                  {
                    required: true,
                    message: 'El método de pago es requerido',
                  },
                ]}
              >
                <SelectPaymentStatus
                  value={form.getFieldValue('payment_type_id')}
                  onChange={(value) =>
                    form.setFieldsValue({ payment_type_id: value })
                  }
                  placeholder="Selecciona método de pago"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Espacio entre secciones */}
          <div style={{ height: '12px' }} />

          {/* 
            SECCIÓN: CAMPO DE MONTO
            Input numérico para el monto del pago con validaciones
          */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="payment"
                label="Monto"
                rules={[
                  {
                    required: true,
                    message: 'El monto es requerido',
                  },
                  {
                    validator: (_, value) => {
                      if (
                        value &&
                        (isNaN(Number(value)) || Number(value) <= 0)
                      ) {
                        return Promise.reject(
                          new Error('El monto debe ser mayor a cero'),
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input                   
                  prefix="S/"
                  type="number"
                  step="0.01"
                  min="0"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* SECCIÓN: CHECKBOX PARA INCLUIR HORA */}
          <Row gutter={16}>
            <Col span={24}>
              <Checkbox
                checked={showHourField}
                onChange={(e) => setShowHourField(e.target.checked)}
                style={{ color: '#ffffff' }}
              >
                Incluir hora
              </Checkbox>
            </Col>
          </Row>

          {/* Espacio entre checkbox y campo de hora */}
          <div style={{ height: '20px' }} />

          {/* SECCIÓN: HORA DE CITA - SOLO SE MUESTRA SI EL CHECKBOX ESTÁ MARCADO */}
          {showHourField && (
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="appointment_hour">
                  <ConfigProvider
                    theme={{
                      components: {
                        TimePicker: {
                          colorBgElevated: '#2a2a2a',
                          colorText: '#ffffff',
                          colorTextHeading: '#ffffff',
                          colorIcon: '#1cb54a',
                          colorPrimary: '#1cb54a',
                          cellHoverBg: 'rgba(28, 181, 74, 0.2)',
                          colorBgContainer: '#2a2a2a',
                          colorBorder: '#1cb54a',
                          colorTextPlaceholder: '#aaaaaa',
                          cellSelectedBg: '#1cb54a',
                          cellSelectedWithRangeBg: '#1cb54a',
                          cellSelectedColor: '#000000',
                          colorTextBase: '#000000',
                        },
                      },
                      token: {
                        colorBgElevated: '#2a2a2a',
                        colorTextBase: '#000000',
                        colorPrimary: '#1cb54a',
                      },
                    }}
                  >
                    <TimePicker
                      style={{
                        width: '100%',
                        backgroundColor: '#2a2a2a',
                        borderColor: '#1cb54a',
                        color: '#ffffff'
                      }}
                      format="HH:mm"
                      placeholder="Seleccionar hora"
                      onChange={(time, timeString) => {
                        console.log('Time changed:', time, timeString);
                        form.setFieldsValue({ appointment_hour: timeString });
                      }}
                    />
                  </ConfigProvider>
                </Form.Item>
              </Col>
            </Row>
          )}

          {/* 
            SECCIÓN: BOTONES DE ACCIÓN
            Botones para cancelar la edición o guardar los cambios
          */}
          <Row justify="end" style={{ marginTop: '30px' }}>
            <Col>
              <Space>
                <Button
                  onClick={handleCancel}
                  style={{
                    backgroundColor: '#666666',
                    borderColor: '#666666',
                    color: '#ffffff',
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                >
                  Registrar Cita
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>

        {/* MODAL SELECCIONAR CONTRIBUIDOR */}
        <Modal
          title="Seleccionar Contribuidor"
          open={isModalVisible}
          centered
          width={700}
          onCancel={handleCancelSelectModal}
          footer={[
            <Button key="cancel" onClick={handleCancelSelectModal}>
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
            >
              Seleccionar
            </Button>,
          ]}
          styles={{ 
            body: { 
              padding: '32px',
              minHeight: '500px',
              overflow: 'hidden'
            } 
          }}
        >
          <CustomSearch
            placeholder="Buscar por Apellido/Nombre o DNI..."
            onSearch={(value) => setSearchTerm(value)}
            width="100%"
            style={{ marginBottom: 24 }}
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
            })}
          />
        </Modal>

        {/* MODAL NUEVO PACIENTE */}
        <Modal
          
          open={isCreatePatientModalVisible}
          onCancel={handleCancelCreateModal}
          footer={null}
          width={800}
          destroyOnClose
          styles={{ body: { overflow: 'hidden' } }}
        >
          <NewPatient
            onCancel={handleCancelCreateModal}
            isModal={true}
            onSubmit={(result) => {
              console.log('Patient created result:', result);
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
                
                console.log('Setting selected patient:', newPatient);
                setSelectedPatient(newPatient);
                form.setFieldsValue({ patient_id: result.id });
                
                // Cerrar el modal después de crear el paciente
                console.log('Closing modal...');
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
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default NewAppointment;
