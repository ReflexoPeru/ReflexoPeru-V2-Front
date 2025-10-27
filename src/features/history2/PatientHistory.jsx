import { useEffect, useMemo, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  message,
  Select,
  Spin,
  Typography,
} from 'antd';
import dayjs from '../../utils/dayjsConfig';
import EmptyState from '../../components/Empty/EmptyState';

// Hooks
import {
  usePatientHistory,
  usePatientAppointments,
  useUpdatePatientHistory,
  useUpdateAppointment,
} from './hooks/usePatientHistory';
import { useTherapists, useTherapistSelection } from './hooks/useTherapists';

// Components
import TherapistModal from './components/TherapistModal';
import WeightFields from './components/WeightFields';
import ContraceptiveFields from './components/ContraceptiveFields';
import MedicalFields from './components/MedicalFields';
import { TicketModal, FichaModal } from './components/PDFModals';

// Utils
import {
  buildFormInitialValues,
  buildAppointmentFormValues,
  buildHistoryPayload,
  buildAppointmentPayload,
  isFemalePatient,
  updateWeightFieldsAfterSave,
  normalizeContraceptiveData,
} from './utils/formHelpers';
import { validateAppointmentId } from './utils/validators';

// API
import {
  extractUniqueDates,
  findAppointmentByDate,
} from './api/appointmentApi';
import { formatTherapistName } from './api/therapistApi';

// Constants
import {
  VALIDATION_MESSAGES,
  SUCCESS_MESSAGES,
  UI_DELAYS,
} from './constants';

// Styles
import styles from './PatientHistory.module.css';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

/**
 * Componente principal de Historia del Paciente - Versión 2 Mejorada
 * 
 * Mejoras implementadas:
 * - Separación clara de responsabilidades
 * - Hooks especializados para cada funcionalidad
 * - Componentes modulares reutilizables
 * - Mejor manejo de errores y estados de carga
 * - Validaciones centralizadas
 * - Código más mantenible y testeable
 */
const PatientHistory = () => {
  // ==================== HOOKS Y ESTADO ====================
  const [form] = Form.useForm();
  const { id: patientId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Estado de cita
  const [selectedAppointmentDate, setSelectedAppointmentDate] = useState('');
  const appointmentFromState = location.state?.appointment;

  // Estado de modales
  const [isTherapistModalVisible, setIsTherapistModalVisible] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showFichaModal, setShowFichaModal] = useState(false);

  // Estado de anticonceptivos
  const [useContraceptiveMethodState, setUseContraceptiveMethodState] = useState(null);
  const [contraceptiveMethodId, setContraceptiveMethodId] = useState(null);
  const [diuTypeId, setDiuTypeId] = useState(null);

  // Hooks de datos
  const {
    history: patientHistory,
    loading: loadingHistory,
    refetch: refetchHistory,
  } = usePatientHistory(patientId);

  const {
    appointments,
    lastAppointment,
    patient,
    loading: loadingAppointments,
    refetch: refetchAppointments,
  } = usePatientAppointments(patientId);

  // Hook para terapeutas (NO carga automáticamente)
  const {
    therapists,
    loading: loadingTherapists,
    pagination,
    handlePageChange,
    handleSearchChange,
    clearSearch,
    initializeLoad: initializeTherapistLoad,
  } = useTherapists();

  // Estado simple para terapeuta (como en history original)
  const [therapist, setTherapist] = useState(null);
  const [selectedTherapistId, setSelectedTherapistId] = useState(null);
  const [userSelectedTherapist, setUserSelectedTherapist] = useState(false); // FIX: Rastrear selección manual
  
  // FIX: Estado para controlar si se debe evitar sobrescribir el formulario después de guardar
  const [justSaved, setJustSaved] = useState(false);

  // Hook para actualizaciones (sin callback, recargamos manualmente después del guardado)
  const { updateHistory, updating: updatingHistory } =
    useUpdatePatientHistory(patientId);

  const { updateAppointment, updating: updatingAppointment } =
    useUpdateAppointment();

  // ==================== COMPUTED VALUES ====================
  const isFemale = useMemo(
    () => isFemalePatient(patientHistory, patient),
    [patientHistory, patient]
  );

  const appointmentDates = useMemo(
    () => extractUniqueDates(appointments),
    [appointments]
  );

  const selectedAppointment = useMemo(
    () => findAppointmentByDate(appointments, selectedAppointmentDate),
    [appointments, selectedAppointmentDate]
  );

  const isLoading = loadingHistory || loadingAppointments;
  const isSaving = updatingHistory || updatingAppointment;


  // ==================== EFFECTS ====================
  
  /**
   * Effect: Cargar datos iniciales del historial en el formulario
   * IMPORTANTE: Espera a que terminen de cargar tanto el historial como las citas
   * para asegurar que tengamos los datos del paciente disponibles
   * FIX: No sobrescribir el formulario si se acaba de guardar exitosamente
   */
  useEffect(() => {
    // Esperar a que terminen de cargar ambos datos
    if (loadingHistory || loadingAppointments) return;
    if (!patientHistory?.data) return;

    // FIX: No sobrescribir el formulario si se acaba de guardar
    if (justSaved) {
      setJustSaved(false);
      return;
    }

    const initialValues = buildFormInitialValues(
      patientHistory,
      appointments,
      isFemale,
      patient
    );
    
    // ⭐ NO sobrescribir campos de cita (el otro effect los maneja)
    form.setFieldsValue(initialValues);

    // FIX: Solo configurar terapeuta del historial si no hay uno ya seleccionado manualmente
    // Esto evita que se sobrescriba la selección del usuario después del guardado
    if (userSelectedTherapist) {
      return; // No sobrescribir si el usuario ya seleccionó manualmente
    }
    
    // Configurar terapeuta del historial (como en history original)
    if (patientHistory.data.therapist) {
      const therapistName = formatTherapistName(patientHistory.data.therapist);
      setTherapist(therapistName);
      setSelectedTherapistId(patientHistory.data.therapist.id);
    } else {
      setTherapist(null);
      setSelectedTherapistId(null);
    }

    // Configurar estado de anticonceptivos para mujeres
    if (isFemale && patientHistory.data) {
      const contraceptiveData = normalizeContraceptiveData(
        patientHistory.data
      );
      setUseContraceptiveMethodState(contraceptiveData.useMethod);
      setContraceptiveMethodId(contraceptiveData.methodId);
      setDiuTypeId(contraceptiveData.diuId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientHistory, loadingHistory, loadingAppointments, isFemale, patient, appointments, justSaved]);

  /**
   * Effect: Cargar datos de la cita seleccionada (como en history original)
   * FIX: Solo actualizar terapeuta si no hay uno ya seleccionado manualmente
   * FIX: No sobrescribir el formulario si se acaba de guardar exitosamente
   */
  /**
   * Effect: Cargar datos de la cita seleccionada
   * ⭐ SOLUCIÓN ROBUSTA: Usa useRef para evitar loops infinitos
   */
  useEffect(() => {
    // Si no hay cita seleccionada, limpiar terapeuta
    if (!selectedAppointment) {
      setTherapist(null);
      setSelectedTherapistId(null);
      setUserSelectedTherapist(false);
      return;
    }

    // No sobrescribir si se acaba de guardar
    if (justSaved) {
      setJustSaved(false);
      return;
    }

    // Actualizar formulario con datos de la cita
    const appointmentValues = buildAppointmentFormValues(selectedAppointment);
    form.setFieldsValue({
      ...appointmentValues,
      therapist: appointmentValues.therapist || '',
    });

    // ⭐ CLAVE: Si el usuario seleccionó manualmente un terapeuta,
    // NO actualizarlo cuando cambia la cita (mantener su elección)
    if (userSelectedTherapist) {
      return;
    }
    
    // Actualizar terapeuta con el de la cita actual
    if (selectedAppointment.therapist) {
      const therapistName = formatTherapistName(selectedAppointment.therapist);
      const therapistId = selectedAppointment.therapist.id;
      
      // ⭐ IMPORTANTE: Solo actualizar si cambió (evita loops infinitos)
      if (therapist !== therapistName || selectedTherapistId !== therapistId) {
        setTherapist(therapistName);
        setSelectedTherapistId(therapistId);
      }
    } else {
      if (therapist !== null || selectedTherapistId !== null) {
        setTherapist(null);
        setSelectedTherapistId(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAppointment, justSaved, userSelectedTherapist]);

  /**
   * Effect: Selección automática de fecha de cita
   */
  useEffect(() => {
    if (!appointments || appointments.length === 0) return;

    // Prioridad 1: Cita pasada desde navegación
    if (appointmentFromState?.appointment_date) {
      setSelectedAppointmentDate(appointmentFromState.appointment_date);
    }
    // Prioridad 2: Última cita (más reciente)
    else if (lastAppointment?.appointment_date) {
      setSelectedAppointmentDate(lastAppointment.appointment_date);
    }
  }, [appointmentFromState, lastAppointment, appointments]);

  // ==================== HANDLERS ====================

  /**
   * Handler: Abrir modal de terapeutas (carga datos solo al abrir)
   */
  const handleOpenTherapistModal = useCallback(() => {
    initializeTherapistLoad(); // Carga solo cuando se abre el modal
    setIsTherapistModalVisible(true);
  }, [initializeTherapistLoad]);

  /**
   * Handler: Cerrar modal de terapeutas
   */
  const handleCloseTherapistModal = useCallback(() => {
    setIsTherapistModalVisible(false);
    clearSearch();
  }, [clearSearch]);

  /**
   * Handler: Confirmar selección de terapeuta
   * ⭐ ROBUSTO: Actualiza terapeuta y marca como selección manual
   */
  const handleConfirmTherapist = useCallback(() => {
    if (selectedTherapistId) {
      const selected = therapists.find((t) => t.id === selectedTherapistId);
      
      if (selected) {
        const therapistName = formatTherapistName(selected);
        setTherapist(therapistName);
        form.setFieldsValue({ therapist: therapistName });
        setUserSelectedTherapist(true);
      }
    }
    handleCloseTherapistModal();
  }, [
    selectedTherapistId,
    therapists,
    form,
    handleCloseTherapistModal,
  ]);

  /**
   * Handler: Seleccionar terapeuta en el modal (como en history original)
   */
  const handleSelectTherapist = useCallback(
    (id) => {
      setSelectedTherapistId(id);
    },
    []
  );

  /**
   * Handler: Eliminar terapeuta seleccionado (como en history original)
   */
  const handleRemoveTherapist = useCallback(() => {
    setTherapist(null);
    setSelectedTherapistId(null);
    setUserSelectedTherapist(false); // FIX: Resetear bandera de selección manual
    form.setFieldsValue({ therapist: '' });
  }, [form]);

  /**
   * Handler: Cambio de método anticonceptivo
   */
  const handleContraceptiveMethodChange = useCallback((value) => {
    setUseContraceptiveMethodState(value);
  }, []);

  const handleContraceptiveChange = useCallback((value) => {
    setContraceptiveMethodId(value);
    form.setFieldsValue({ contraceptive_method_id: value });
  }, [form]);

  const handleDiuTypeChange = useCallback((value) => {
    setDiuTypeId(value);
    form.setFieldsValue({ diu_type_id: value });
  }, [form]);

  /**
   * Handler: Envío del formulario
   */
  const handleSubmit = useCallback(
    async (values) => {
      // Validar que exista una cita seleccionada
      if (!validateAppointmentId(selectedAppointment?.id)) {
        message.error(VALIDATION_MESSAGES.MISSING_APPOINTMENT_ID);
        return;
      }

      const historyId = patientHistory?.data?.id;
      const appointmentId = selectedAppointment.id;


      // Construir payloads
      const contraceptiveState = {
        useContraceptiveMethod: useContraceptiveMethodState,
        contraceptiveMethodId,
        diuTypeId,
      };

      const historyPayload = buildHistoryPayload(
        values,
        patientHistory,
        contraceptiveState,
        selectedTherapistId
      );

      const appointmentPayload = buildAppointmentPayload(
        values,
        selectedAppointment,
        selectedAppointmentDate,
        selectedTherapistId,
        patientId
      );


      // Guardar cambios (secuencialmente)
      try {
        const [historyResult, appointmentResult] = await Promise.all([
          updateHistory(historyId, historyPayload),
          updateAppointment(appointmentId, appointmentPayload, false), // Sin toast automático
        ]);

        if (historyResult.success && appointmentResult.success) {
          // Mostrar solo UN toast de éxito combinado
          message.success(SUCCESS_MESSAGES.CHANGES_SAVED, 8); // Duración de 8 segundos

          // FIX: Marcar que se acaba de guardar para evitar sobrescribir el formulario
          setJustSaved(true);

          // Actualizar campos de peso en el formulario
          updateWeightFieldsAfterSave(form, values);

          // Refrescar datos desde el backend para mantener sincronización
          // Esto asegura que cualquier cálculo del servidor se refleje
          await Promise.all([
            refetchHistory(),
            refetchAppointments(),
          ]);

          // El usuario permanece en la vista para seguir trabajando
        } else {
          message.error('Error al guardar algunos cambios');
        }
      } catch (error) {
        console.error('[PatientHistory] Error saving:', error);
        message.error(`Error al guardar: ${error.message}`);
      }
    },
    [
      selectedAppointment,
      patientHistory,
      useContraceptiveMethodState,
      contraceptiveMethodId,
      diuTypeId,
      selectedTherapistId,
      selectedAppointmentDate,
      patientId,
      updateHistory,
      updateAppointment,
      form,
      refetchHistory,
      refetchAppointments,
    ]
  );

  // ==================== RENDER ====================

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Spin
          size="large"
          tip="Cargando datos del paciente..."
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

  // Validación: Asegurar que tengamos datos del paciente antes de renderizar
  const hasPatientData = patient || 
                         patientHistory?.data?.patient || 
                         (appointments && appointments.length > 0 && appointments[0]?.patient);

  if (!hasPatientData && !isLoading) {
    console.warn('[PatientHistory] No se encontraron datos del paciente', {
      patient,
      historyPatient: patientHistory?.data?.patient,
      appointmentPatient: appointments?.[0]?.patient,
    });
  }

  // Función para manejar el regreso
  const handleGoBack = () => {
    // Verificar si hay estado de navegación para determinar de dónde vino
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      // Por defecto, ir a la vista de citas
      navigate('/Inicio/citas');
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        {/* Header con botón de regreso y título */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <Button
            type="text"
            icon={<i className="fa-solid fa-arrow-left"></i>}
            onClick={handleGoBack}
            style={{
              padding: '8px 12px',
              fontSize: '16px',
              color: '#666',
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '40px',
              height: '40px'
            }}
            title="Volver"
          />
          <Title level={2} className={styles.title} style={{ margin: 0 }}>
            Historial del Paciente
          </Title>
        </div>

        <Form
          form={form}
          onFinish={handleSubmit}
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

          <Form.Item
            name="observation"
            label="Observación General"
            className={styles.formItem}
          >
            <TextArea rows={3} className={styles.textarea} />
          </Form.Item>

          {/* Selector de Cita y Terapeuta en la misma fila */}
          <Title level={3} className={styles.sectionTitle}>
            Información de la Cita
          </Title>

          {/* Estado vacío cuando no hay citas */}
          {!loadingAppointments && appointmentDates.length === 0 ? (
            <EmptyState
              icon="calendar"
              title="No hay citas registradas"
              description="Este paciente no tiene ninguna cita programada por el momento. Las citas aparecerán aquí una vez que sean agendadas."
              style={{
                background: 'transparent',
                border: 'none',
                margin: '20px 0',
                minHeight: '200px'
              }}
            />
          ) : (
            <div className={styles.appointmentRow}>
              <Form.Item label="Fecha de la Cita" className={styles.dateFormItem}>
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

            <Form.Item
              name="therapist"
              label="Terapeuta Asignado"
              className={styles.therapistFormItem}
            >
              <div className={styles.therapistRow}>
                <Input
                  disabled
                  value={therapist || form.getFieldValue('therapist') || 'No asignado'}
                  className={styles.therapistInput}
                  placeholder="Seleccione un terapeuta"
                  onChange={() => {}} // Disabled input
                />
                <Button
                  type="primary"
                  onClick={handleOpenTherapistModal}
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
            </Form.Item>
          </div>
          )}

          {/* Campos Médicos */}
          <MedicalFields styles={styles} />

          {/* Campos de Peso, Talla y datos reproductivos */}
          <Title level={3} className={styles.sectionTitle}>
            Métricas Físicas
          </Title>
          <WeightFields styles={styles} isFemale={isFemale} />

          {/* Campos de Anticonceptivos (solo mujeres) */}
          <ContraceptiveFields
            isFemale={isFemale}
            useContraceptiveMethod={useContraceptiveMethodState}
            contraceptiveMethodId={contraceptiveMethodId}
            diuTypeId={diuTypeId}
            onContraceptiveMethodChange={handleContraceptiveMethodChange}
            onContraceptiveChange={handleContraceptiveChange}
            onDiuTypeChange={handleDiuTypeChange}
            form={form}
            styles={styles}
          />

          {/* Sección Inferior: Fecha de Inicio y Botones */}
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
                onClick={() => setShowTicketModal(true)}
                disabled={!selectedAppointment}
              >
                Generar Boleta
              </Button>
              <Button
                className={styles.printButton}
                onClick={() => setShowFichaModal(true)}
                disabled={!selectedAppointment}
              >
                Generar Ficha
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.saveButton}
                loading={isSaving}
                disabled={isSaving}
              >
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
              <Button
                className={styles.cancelButton}
                onClick={() => navigate(-1)}
                disabled={isSaving}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Form>
      </Card>

      {/* Modales */}
      <TherapistModal
        visible={isTherapistModalVisible}
        onCancel={handleCloseTherapistModal}
        onConfirm={handleConfirmTherapist}
        therapists={therapists}
        loading={loadingTherapists}
        selectedTherapistId={selectedTherapistId}
        onSelectTherapist={handleSelectTherapist}
        onSearch={handleSearchChange}
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      <TicketModal
        visible={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        appointment={selectedAppointment}
        patientHistory={patientHistory}
        patient={patient}
      />

      <FichaModal
        visible={showFichaModal}
        onClose={() => setShowFichaModal(false)}
        appointment={selectedAppointment}
        patientHistory={patientHistory}
        appointmentsCount={appointments.length}
        patient={patient}
      />
    </div>
  );
};

export default PatientHistory;

