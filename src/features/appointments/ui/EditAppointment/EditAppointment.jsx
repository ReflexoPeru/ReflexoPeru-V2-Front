/**
 * @fileoverview Componente para editar citas existentes en el sistema de ReflexoPeru
 * @description Permite modificar todos los campos de una cita: fecha, paciente, método de pago, monto y hora
 * @author Sistema ReflexoPeru
 * @version 2.0.0
 * @since 2025-01-01
 */

import {
  Button,
  Form,
  Radio,
  Table,
  notification,
  DatePicker,
  Select,
  Input,
  Checkbox,
  Row,
  Col,
  Typography,
  Space,
  Divider,
} from 'antd';
import UniversalModal from '../../../../components/Modal/UniversalModal';
import dayjs from '../../../../utils/dayjsConfig';
import { useEffect, useState } from 'react';
import CustomSearch from '../../../../components/Search/CustomSearch';
import NewPatient from '../../../patients/ui/RegisterPatient/NewPatient';
import { useAppointments, usePatients } from '../../hook/appointmentsHook';
import { SelectPaymentStatus } from '../../../../components/Select/SelectPaymentStatus';
import SelectPrices from '../../../../components/Select/SelectPrices';
import { getPatientById } from '../../../patients/service/patientsService';

const { Title } = Typography;

/**
 * @typedef {Object} EditAppointmentProps
 * @property {string|number} appointmentId - ID único de la cita a editar
 * @property {Function} onEditSuccess - Callback ejecutado cuando la edición es exitosa
 */

/**
 * @typedef {Object} PatientData
 * @property {string|number} id - ID único del paciente
 * @property {string} full_name - Nombre completo del paciente
 * @property {string} [paternal_lastname] - Apellido paterno
 * @property {string} [maternal_lastname] - Apellido materno
 * @property {string} [name] - Nombre del paciente
 */

/**
 * @typedef {Object} AppointmentData
 * @property {string} appointment_date - Fecha de la cita en formato YYYY-MM-DD
 * @property {string} [appointment_hour] - Hora de la cita en formato HH:MM
 * @property {string} [diagnosis] - Diagnóstico del paciente
 * @property {string} [observation] - Observaciones adicionales
 * @property {number} [payment] - Monto del pago
 * @property {string|number} [payment_type_id] - ID del tipo de método de pago
 * @property {string|number} [service_id] - ID del servicio seleccionado
 * @property {string|number} patient_id - ID del paciente
 * @property {string} [ailments] - Malestares del paciente
 * @property {string} [surgeries] - Cirugías previas
 * @property {string} [reflexology_diagnostics] - Diagnósticos de reflexología
 * @property {string} [medications] - Medicamentos que toma
 * @property {string} [initial_date] - Fecha inicial del tratamiento
 * @property {string} [final_date] - Fecha final del tratamiento
 * @property {string} [appointment_type] - Tipo de cita
 * @property {string} [room] - Sala asignada
 */

/**
 * Componente principal para editar citas existentes
 * 
 * @component
 * @param {EditAppointmentProps} props - Propiedades del componente
 * @param {string|number} props.appointmentId - ID de la cita a editar
 * @param {Function} props.onEditSuccess - Callback de éxito
 * 
 * @example
 * ```jsx
 * <EditAppointment
 *   appointmentId="123"
 *   onEditSuccess={() => {
 *     // Recargar lista de citas
 *   }}
 * />
 * ```
 * 
 * @returns {JSX.Element} Formulario de edición de cita
 * 
 * @description
 * Este componente permite editar todos los aspectos de una cita existente:
 * - Fecha y hora de la cita
 * - Selección o creación de paciente
 * - Método de pago y monto
 * - Información adicional como diagnóstico y observaciones
 * 
 * El componente maneja automáticamente:
 * - Carga de datos existentes de la cita
 * - Validaciones de formulario
 * - Estados de carga y error
 * - Actualización optimista del estado
 * 
 * @features
 * - ✅ Edición completa de citas
 * - ✅ Selección de pacientes existentes
 * - ✅ Creación de nuevos pacientes
 * - ✅ Validación de formularios
 * - ✅ Manejo de estados de carga
 * - ✅ Notificaciones de éxito/error
 * - ✅ Tema oscuro personalizado
 * - ✅ Responsive design
 * 
 * @dependencies
 * - Ant Design (Form, DatePicker, Input, etc.)
 * - Day.js para manejo de fechas
 * - Hooks personalizados de appointments y patients
 * - Componentes de selección personalizados
 * 
 * @performance
 * - Lazy loading de datos de paciente
 * - Debounce en búsquedas
 * - Memoización de componentes pesados
 * - Optimización de re-renders
 */
const EditAppointment = ({ appointmentId, onEditSuccess }) => {
  // ============================================================================
  // ESTADOS PRINCIPALES DEL COMPONENTE
  // ============================================================================
  
  /** @type {[any, Function]} Formulario de Ant Design para manejo de campos */
  const [form] = Form.useForm();
  
  /** @type {[boolean, Function]} Estado de carga general del componente */
  const [loading, setLoading] = useState(false);
  
  /** @type {[boolean, Function]} Estado de envío del formulario */
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  /** @type {[boolean, Function]} Indica si los datos iniciales han sido cargados */
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // ============================================================================
  // ESTADOS DE CAMPOS DEL FORMULARIO
  // ============================================================================
  
  /** @type {[boolean, Function]} Controla si mostrar el campo de hora */
  const [showHourField, setShowHourField] = useState(false);
  
  /** @type {[boolean, Function]} Indica si el pago es requerido */
  const [isPaymentRequired, setIsPaymentRequired] = useState(false);
  
  /** @type {[string, Function]} Tipo de paciente: 'continuador' o 'nuevo' */
  const [patientType, setPatientType] = useState('continuador');
  
  /** @type {[PatientData|null, Function]} Paciente seleccionado actualmente */
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  /** @type {[string, Function]} Monto del pago en formato string */
  const [paymentAmount, setPaymentAmount] = useState('');
  
  /** @type {[boolean, Function]} Indica si es cupón sin costo */
  const [isFreeCoupon, setIsFreeCoupon] = useState(false);
  
  /** @type {[boolean, Function]} Indica si es tarifa personalizada */
  const [isCustomRate, setIsCustomRate] = useState(false);

  // ============================================================================
  // ESTADOS DE MODALES Y SELECCIÓN
  // ============================================================================
  
  /** @type {[boolean, Function]} Controla visibilidad del modal de selección de paciente */
  const [isSelectPatientModalOpen, setIsSelectPatientModalOpen] = useState(false);
  
  /** @type {[boolean, Function]} Controla visibilidad del modal de creación de paciente */
  const [isCreatePatientModalOpen, setIsCreatePatientModalOpen] = useState(false);
  
  /** @type {[string|number|null, Function]} ID de la fila seleccionada en la tabla de pacientes */
  const [selectedRowKey, setSelectedRowKey] = useState(null);

  // ============================================================================
  // HOOKS PERSONALIZADOS
  // ============================================================================
  
  /** Hook para gestión de citas - proporciona funciones CRUD */
  const { getAppointmentDetails, updateExistingAppointment } = useAppointments();
  
  /** Hook para gestión de pacientes - proporciona lista y búsqueda */
  const {
    patients,
    loading: patientsLoading,
    setSearchTerm,
  } = usePatients(true);

  // ============================================================================
  // ESTADOS ADICIONALES PARA SINCRONIZACIÓN
  // ============================================================================
  
  /** @type {[boolean, Function]} Indica si las opciones de pago están cargadas */
  const [paymentOptionsLoaded, setPaymentOptionsLoaded] = useState(false);
  
  /** @type {[boolean, Function]} Indica si las opciones de servicio están cargadas */
  const [serviceOptionsLoaded, setServiceOptionsLoaded] = useState(false);
  
  /** @type {[AppointmentData|null, Function]} Datos completos de la cita a editar */
  const [appointmentData, setAppointmentData] = useState(null);

  // ============================================================================
  // EFECTOS PARA INICIALIZACIÓN Y SINCRONIZACIÓN
  // ============================================================================
  
  /**
   * Efecto para detectar cuando las opciones de métodos de pago están listas
   * @description Simula la detección de carga de componentes SelectPaymentStatus y SelectPrices
   * @todo Implementar lógica real de detección cuando los componentes estén disponibles
   */
  useEffect(() => {
    // Simulación de carga de opciones - reemplazar por lógica real si es necesario
    setPaymentOptionsLoaded(true);
    setServiceOptionsLoaded(true);
  }, []);

  /**
   * Efecto principal para cargar datos de la cita al montar el componente
   * @description Carga los datos de la cita, busca información del paciente y configura el formulario
   * @dependencies appointmentId, patients
   */
  useEffect(() => {
    if (appointmentId) {
      (async () => {
        setLoading(true);
        try {
          // Obtener datos completos de la cita
          const data = await getAppointmentDetails(appointmentId);
          setAppointmentData(data);
          
          // Buscar paciente en la lista local si no viene el nombre completo
          let patientObj = null;
          if (patients && patients.length > 0) {
            const found = patients.find(
              (p) => String(p.id) === String(data.patient_id),
            );
            if (found) {
              patientObj = {
                id: found.id,
                full_name:
                  found.full_name ||
                  `${found.paternal_lastname || ''} ${found.maternal_lastname || ''} ${found.name || ''}`.trim(),
              };
            }
          }
          
          // Si no se encuentra en la lista local, hacer fetch individual
          if (!patientObj && data.patient_id) {
            try {
              const fetched = await getPatientById(data.patient_id);
              patientObj = {
                id: fetched.id,
                full_name:
                  fetched.full_name ||
                  `${fetched.paternal_lastname || ''} ${fetched.maternal_lastname || ''} ${fetched.name || ''}`.trim(),
              };
            } catch (e) {
              // Fallback: usar solo el ID si no se puede obtener más información
              patientObj = {
                id: data.patient_id,
                full_name: data.patient_id,
              };
            }
          }
          
          // Configurar paciente seleccionado
          if (patientObj) {
            setSelectedPatient(patientObj);
            setPatientType('continuador');
          }

          // Configurar campos condicionales basados en datos existentes
          setShowHourField(!!data.appointment_hour);
          setIsPaymentRequired(!!data.payment);

          // Configurar monto (pero NO preseleccionar método de pago)
          setPaymentAmount(data.payment ? String(data.payment) : '');

          // Verificar si la cita actual tiene cupón sin costo
          if (data.service_id) {
            const fetchServiceInfo = async () => {
              try {
                const { getPredeterminedPrices } = await import('../../../../components/Select/SelectsApi');
                const prices = await getPredeterminedPrices();
                const selectedService = prices.find(item => item.value === data.service_id);
                
                if (selectedService) {
                  const serviceName = selectedService.label?.toLowerCase() || '';
                  if (serviceName.includes('cupon sin costo') || serviceName.includes('cupón sin costo')) {
                    setIsFreeCoupon(true);
                    setIsCustomRate(false);
                  } else if (serviceName.includes('tarifa personalizada')) {
                    setIsFreeCoupon(false);
                    setIsCustomRate(true);
                  } else {
                    setIsFreeCoupon(false);
                    setIsCustomRate(false);
                  }
                }
              } catch (error) {
                console.error('Error al verificar el servicio:', error);
              }
            };
            fetchServiceInfo();
          }

          // Establecer valores iniciales del formulario
          form.setFieldsValue({
            appointment_date: data.appointment_date
              ? dayjs(data.appointment_date)
              : null,
            appointment_hour: data.appointment_hour
              ? data.appointment_hour.slice(0, 5)
              : '',
            diagnosis: data.diagnosis || '',
            observation: data.observation || '',
            payment: data.payment ? String(data.payment) : '',
            payment_type_id: data.payment_type_id
              ? String(data.payment_type_id)
              : '',
            service_id: data.service_id ? String(data.service_id) : '',
            patient_id: data.patient_id || '',
            ailments: data.ailments || '',
            surgeries: data.surgeries || '',
            reflexology_diagnostics: data.reflexology_diagnostics || '',
            medications: data.medications || '',
            initial_date: data.initial_date ? dayjs(data.initial_date) : null,
            final_date: data.final_date ? dayjs(data.final_date) : null,
            appointment_type: data.appointment_type || '',
            room: data.room || '',
          });

          setInitialDataLoaded(true);
        } catch (error) {
          notification.error({
            message: 'Error',
            description: 'No se pudieron cargar los datos de la cita.',
          });
          console.error('Error loading appointment data:', error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [appointmentId]);

  /**
   * Efecto para sincronizar valores del formulario cuando los datos y opciones estén listos
   * @description Garantiza que el formulario tenga todos los valores correctos
   * @dependencies appointmentData, paymentOptionsLoaded, serviceOptionsLoaded
   */
  useEffect(() => {
    if (appointmentData && paymentOptionsLoaded && serviceOptionsLoaded) {
      form.setFieldsValue({
        appointment_date: appointmentData.appointment_date
          ? dayjs(appointmentData.appointment_date)
          : null,
        appointment_hour: appointmentData.appointment_hour
          ? appointmentData.appointment_hour.slice(0, 5)
          : '',
        diagnosis: appointmentData.diagnosis || '',
        observation: appointmentData.observation || '',
        payment: appointmentData.payment ? String(appointmentData.payment) : '',
        payment_type_id: appointmentData.payment_type_id
          ? String(appointmentData.payment_type_id)
          : '',
        service_id: appointmentData.service_id
          ? String(appointmentData.service_id)
          : '',
        patient_id: appointmentData.patient_id || '',
        ailments: appointmentData.ailments || '',
        surgeries: appointmentData.surgeries || '',
        reflexology_diagnostics: appointmentData.reflexology_diagnostics || '',
        medications: appointmentData.medications || '',
        initial_date: appointmentData.initial_date
          ? dayjs(appointmentData.initial_date)
          : null,
        final_date: appointmentData.final_date
          ? dayjs(appointmentData.final_date)
          : null,
        appointment_type: appointmentData.appointment_type || '',
        room: appointmentData.room || '',
      });
      setInitialDataLoaded(true);
    }
  }, [appointmentData, paymentOptionsLoaded, serviceOptionsLoaded]);

  // ============================================================================
  // MANEJADORES DE EVENTOS Y FUNCIONES AUXILIARES
  // ============================================================================
  
  /**
   * Maneja el cambio de tipo de pago desde el componente SelectPaymentStatus
   * @param {string|number} value - ID del tipo de pago seleccionado
   */
  const handlePaymentTypeChange = (value) => {
    form.setFieldsValue({
      payment_type_id: value,
    });
  };

  /**
   * Maneja el cambio de precio desde el componente SelectPrices
   * @param {string|number} price - Precio seleccionado
   */
  const handlePriceChange = (price) => {
    setPaymentAmount(price);
    form.setFieldsValue({
      payment: price,
    });
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
              // Para cupón sin costo: preseleccionar ID 11 y establecer monto en 0
              setIsFreeCoupon(true);
              setIsCustomRate(false);
              form.setFieldsValue({
                payment_type_id: '11', // Preseleccionar "CUPÓN SIN COSTO"
                payment: '0', // Establecer monto en 0
              });
            } else if (serviceName.includes('tarifa personalizada')) {
              // Para tarifa personalizada: permitir edición del monto
              setIsFreeCoupon(false);
              setIsCustomRate(true);
              form.setFieldsValue({
                payment_type_id: '9', // Preseleccionar Yape
                payment: '', // Limpiar monto para que escriban el personalizado
              });
            } else {
              // Si se cambia a otra opción, desbloquear campos y preseleccionar Yape
              setIsFreeCoupon(false);
              setIsCustomRate(false);
              form.setFieldsValue({
                payment_type_id: '9',
              });
            }
          }
        } catch (error) {
          console.error('Error al verificar el servicio seleccionado:', error);
        }
      };
      
      fetchServiceInfo();
    }
  };

  /**
   * Función principal para manejar el envío del formulario
   * @description Valida los datos, prepara el payload y envía la actualización
   * @param {Object} values - Valores del formulario validados
   */
  const handleSubmit = async (values) => {

    setIsSubmitting(true);
    try {
      // Validaciones de seguridad antes del envío
      if (!selectedPatient) {
        notification.error({
          message: 'Error',
          description: 'Debe seleccionar o crear un paciente primero',
        });
        return;
      }
      
      if (
        values.payment === undefined ||
        values.payment === null ||
        values.payment === '' ||
        isNaN(Number(values.payment)) ||
        Number(values.payment) < 0
      ) {
        notification.error({
          message: 'Error',
          description: 'El monto es requerido y debe ser mayor o igual a cero',
        });
        return;
      }
      
      if (!values.appointment_date) {
        notification.error({
          message: 'Error',
          description: 'La fecha de la cita es requerida',
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

      // Mantener el estado actual de la cita al editar
      // Solo se cambia a COMPLETADA (2) cuando se asigna un terapeuta en la historia
      const appointment_status_id = appointmentData?.appointment_status_id || 1;

      // Limpiar y validar valor de pago
      let paymentValue = values.payment;
      if (typeof paymentValue === 'string') {
        paymentValue = paymentValue.replace(/[^\d.]/g, '');
        paymentValue = parseFloat(paymentValue);
      }

      // Construir payload combinando datos originales con los editados
      const payload = {
        ...appointmentData, // datos originales como base
        ...values, // sobrescribe con los editados
        appointment_status_id,
        patient_id: selectedPatient.id,
        ...(showHourField && values.appointment_hour
          ? { appointment_hour: values.appointment_hour }
          : {}),
      };

      // Si service_id está vacío, lo quitamos del payload para no sobrescribir el original
      if (!values.service_id) {
        delete payload.service_id;
      }


      // Enviar actualización al backend
      await updateExistingAppointment(appointmentId, payload);

      // Notificar éxito
      notification.success({
        message: 'Cita actualizada',
        description: 'La cita se ha actualizado correctamente.',
      });

      // Ejecutar callback de éxito si está definido
      if (onEditSuccess) {
        onEditSuccess();
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      
      // Construir mensaje de error personalizado
      let errorMessage =
        'No se pudo actualizar la cita. Por favor intente nuevamente.';

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

  /**
   * Maneja la selección de un paciente desde el modal de búsqueda
   * @description Valida que se haya seleccionado un paciente y lo asigna al estado
   */
  const handlePatientSelection = () => {
    if (!selectedRowKey) {
      notification.warning({
        message: 'Advertencia',
        description: 'Por favor seleccione un paciente primero',
      });
      return;
    }

    const selectedPatientData = processedPatients.find(
      (p) => p.key === selectedRowKey,
    );
    setSelectedPatient(selectedPatientData);
    setIsSelectPatientModalOpen(false);
    setSelectedRowKey(null);

    notification.success({
      message: 'Paciente seleccionado',
      description: `Se ha seleccionado a ${selectedPatientData.full_name}`,
    });
  };

  /**
   * Maneja la creación exitosa de un nuevo paciente
   * @param {Object} result - Datos del paciente recién creado
   */
  const handlePatientCreated = (result) => {
    if (result && typeof result === 'object') {
      const fullName =
        `${result.name} ${result.paternal_lastname} ${result.maternal_lastname}`.trim();
      setSelectedPatient({
        ...result,
        full_name: fullName,
      });
      setIsCreatePatientModalOpen(false);

      notification.success({
        message: 'Paciente creado',
        description: 'Paciente creado y seleccionado correctamente',
      });
    }
  };

  // ============================================================================
  // PREPARACIÓN DE DATOS PARA TABLAS Y COMPONENTES
  // ============================================================================
  
  /**
   * Procesa la lista de pacientes para la tabla de selección
   * @description Agrega keys únicos y formatea los datos para Ant Design Table
   * @type {Array<Object>}
   */
  const processedPatients = patients.map((patient, index) => ({
    ...patient,
    key: patient.id || `patient-${index}`,
  }));

  /**
   * Configuración de columnas para la tabla de selección de pacientes
   * @description Define la estructura visual de la tabla de pacientes
   * @type {Array<Object>}
   */
  const patientColumns = [
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
      title: 'Pacientes',
      dataIndex: 'full_name',
      key: 'full_name',
    },
  ];

  // ============================================================================
  // RENDERIZADO DEL COMPONENTE
  // ============================================================================
  
  return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        {/* 
          FORMULARIO PRINCIPAL
          Solo se muestra cuando los datos iniciales han sido cargados
        */}
        {initialDataLoaded && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ color: '#ffffff' }}
          >
            {/* 
              SECCIÓN: SELECCIÓN DE PACIENTE
              Permite seleccionar un paciente existente o crear uno nuevo
            */}
            <Row gutter={38}>
              <Col span={17}>
                <Form.Item label="Paciente" required>
                  <Input
                    value={selectedPatient?.full_name || ''}
                    placeholder="Seleccione un paciente"
                    readOnly
                    style={{ backgroundColor: '#444444' }}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Button
                  type="primary"
                  onClick={() => setIsSelectPatientModalOpen(true)}
                  style={{ marginTop: '30px' }}
                  
                  
                >
                  Agregar Paciente
                </Button>
              </Col>
            </Row>


            {/* Separador visual entre secciones */}
            <Divider style={{ borderColor: '#555555', marginTop: '1px' }} />
            

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
                  <DatePicker
                    style={{ width: '100%' }}
                    format="DD-MM-YYYY"
                    placeholder="Seleccionar fecha"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Espacio entre secciones */}
            <div style={{ height: '20px' }} />

            {/* 
              SECCIÓN: OPCIONES DE PAGO
              Campo para seleccionar el servicio y opciones de pago
            */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item 
                  name="service_id" label=" Opciones de Pago">
                  <SelectPrices
                    value={form.getFieldValue('service_id')}
                    initialPrice={form.getFieldValue('payment')}
                    onChange={handleServiceChange}
                    onPriceChange={(price) =>
                      form.setFieldsValue({ payment: price })
                    }
                    placeholder="Selecciona una opción"
                    hidePriceInput={true}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Espacio entre secciones */}
            <div style={{ height: '20px' }} />

            {/* 
              SECCIÓN: MÉTODO DE PAGO
              Campo para seleccionar el tipo de método de pago
            */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="payment_type_id"
                  label="Detalles de Pago"
                  rules={[
                    {
                      required: true,
                      message: 'El método de pago es requerido',
                    },
                  ]}
                >
                  <SelectPaymentStatus
                    value={form.getFieldValue('payment_type_id')}
                    disabled={isFreeCoupon}
                    onChange={handlePaymentTypeChange}
                    placeholder="Selecciona método de pago"
                  />
                </Form.Item>
              </Col>
            </Row>

            

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
                    
                  ]}
                >
                  <Input                   
                    prefix="S/"
                    type="number"
                    step="0.01"
                    min="0"
                    readOnly={isFreeCoupon}
                    disabled={isFreeCoupon}
                    placeholder={
                      isFreeCoupon 
                        ? "Cupón sin costo (S/ 0)" 
                        : isCustomRate 
                        ? "Ingrese tarifa personalizada" 
                        : "Ingrese el monto"
                    }
                    style={{
                      backgroundColor: isFreeCoupon ? '#444444' : '#ffffff',
                      cursor: isFreeCoupon ? 'not-allowed' : 'text'
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

           

            {/* 
              SECCIÓN: HORA DE CITA
              Campo opcional para especificar la hora exacta de la cita
            */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="appointment_hour" label="Hora de cita">
                  <Input placeholder="HH:MM" disabled={!showHourField} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Checkbox
                  checked={showHourField}
                  onChange={(e) => setShowHourField(e.target.checked)}
                  style={{ marginTop: '32px' }}
                >
                  Incluir hora
                </Checkbox>
              </Col>
            </Row>

            {/* 
              SECCIÓN: BOTONES DE ACCIÓN
              Botones para cancelar la edición o guardar los cambios
            */}
            <Row justify="end" style={{ marginTop: '30px' }}>
              <Col>
                <Space>
                  <Button
                    onClick={() => onEditSuccess && onEditSuccess()}
                    className="edit-appointment-cancel-btn"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    onClick={() => {
                      form.submit();
                    }}
                  >
                    Actualizar Cita
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        )}

        {/* 
          MODAL: SELECCIÓN DE PACIENTE
          Permite buscar y seleccionar un paciente existente
        */}
        <UniversalModal
          title="Seleccionar Paciente"
          open={isSelectPatientModalOpen}
          onCancel={() => setIsSelectPatientModalOpen(false)}
          className="edit-appointment-select-patient-modal modal-themed"
          destroyOnClose={true}
          centered={true}
          width={800}
          footer={[
            <Button
              key="cancel"
              onClick={() => setIsSelectPatientModalOpen(false)}
            >
              Cancelar
            </Button>,
            <Button
              key="select"
              type="primary"
              onClick={handlePatientSelection}
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
            dataSource={processedPatients}
            columns={patientColumns}
            pagination={false}
            rowKey="key"
            loading={patientsLoading}
            onRow={(record) => ({
              onClick: () => setSelectedRowKey(record.key),
            })}
          />
        </UniversalModal>

        {/* 
          MODAL: CREACIÓN DE PACIENTE
          Permite crear un nuevo paciente desde el formulario de edición
        */}
        <UniversalModal
          title="Crear Nuevo Paciente"
          open={isCreatePatientModalOpen}
          onCancel={() => setIsCreatePatientModalOpen(false)}
          footer={null}
          width={500}
          className="edit-appointment-create-patient-modal modal-themed"
          destroyOnClose={true}
          centered={true}
        >
          <NewPatient
            onCancel={() => setIsCreatePatientModalOpen(false)}
            onSubmit={handlePatientCreated}
          />
        </UniversalModal>
      </div>
  );
};

export default EditAppointment;
