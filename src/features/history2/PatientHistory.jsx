import { useEffect, useMemo, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
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
  usePatientVitals,
} from './hooks/usePatientHistory';
import { useTherapists, useTherapistSelection } from './hooks/useTherapists';

// Components
import TherapistModal from './components/TherapistModal';
import WeightFields from './components/WeightFields';
import VitalsChart from './components/VitalsChart';
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
  getWeightData,
  findLatestPopulatedAppointment,
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

  const {
    vitals,
    loading: loadingVitals,
    refetch: refetchVitals,
  } = usePatientVitals(patientId);

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

  // Función ultra-simple para cambiar de fecha y asegurar que el Select responda
  const handleDateChange = (newDate) => {
    if (!newDate) return;
    
    // Si es la misma fecha (comparando solo día), no hacer nada
    const currentShort = selectedAppointmentDate?.split(' ')[0] || '';
    const nextShort = newDate.split(' ')[0] || '';
    
    if (currentShort === nextShort && currentShort !== '') return;

    // Actualizar estado inmediatamente para que el Select no se bloquee
    setSelectedAppointmentDate(newDate);
  };

  // ==================== COMPUTED VALUES ====================
  const isFemale = useMemo(
    () => isFemalePatient(patientHistory, patient),
    [patientHistory, patient]
  );

  const appointmentDates = useMemo(
    () => extractUniqueDates(appointments),
    [appointments]
  );

  // Memoizar la cita seleccionada para evitar recalcular en cada render
  const selectedAppointment = useMemo(() => {
    if (!appointments || appointments.length === 0) return null;
    if (!selectedAppointmentDate) return null;

    return findAppointmentByDate(appointments, selectedAppointmentDate);
  }, [appointments, selectedAppointmentDate]);

  // Calcular datos de peso dinámicos para la UI
  const weightDataForUI = useMemo(
    () => getWeightData(appointments, selectedAppointmentDate),
    [appointments, selectedAppointmentDate]
  );

  const isLoading = loadingHistory || loadingAppointments;
  const isSaving = updatingHistory || updatingAppointment;


  // ==================== EFFECTS ====================

  /**
   * Effect Principal: Sincronización de Datos y Navegación
   * Coordina la carga inicial, el cambio de cita y el guardado.
   */
  useEffect(() => {
    // 1. Fase de Carga: No hacer nada si los datos están bajando
    if (loadingHistory || loadingAppointments) return;
    if (!patientHistory?.data) return;

    // 2. Fase de Inicialización: Si no hay fecha elegida, buscar la mejor opción (hoy, futura o última)
    if (!selectedAppointmentDate) {
      let initialDate = '';

      // Prioridad A: Navegación desde state
      if (appointmentFromState?.appointment_date) {
        initialDate = appointmentFromState.appointment_date.split(' ')[0];
      }
      // Prioridad B: Selección inteligente
      else if (appointments.length > 0) {
        const todayStr = dayjs().format('YYYY-MM-DD');
        const todayAppt = appointments.find(a => a.appointment_date?.startsWith(todayStr));
        
        if (todayAppt) {
          initialDate = todayAppt.appointment_date.split(' ')[0];
        } else {
          // Futura más cercana
          const future = appointments
            .filter(a => dayjs(a.appointment_date).isAfter(dayjs()))
            .sort((a, b) => dayjs(a.appointment_date).unix() - dayjs(b.appointment_date).unix())[0];
          
          if (future) {
            initialDate = future.appointment_date.split(' ')[0];
          } else {
            // Última registrada
            initialDate = appointments[0].appointment_date?.split(' ')[0] || '';
          }
        }
      }

      if (initialDate) {
        setSelectedAppointmentDate(initialDate);
        return; // Detener aquí para que el siguiente ciclo use la fecha correcta
      }
    }

    // 3. Fase de Renderizado de Formulario:
    // Si acabamos de guardar, solo reseteamos el flag y mantenemos los datos actuales
    if (justSaved) {
      setJustSaved(false);
      return;
    }

    // Cargar datos base del paciente (Historia)
    const historyValues = buildFormInitialValues(patientHistory, appointments, isFemale, patient);
    
    // Cargar datos de la cita seleccionada
    let appointmentValues = {};
    if (selectedAppointment) {
      try {
        appointmentValues = buildAppointmentFormValues(selectedAppointment);
        
        // AUTO-FILL BLINDADO: Solo para citas vacías
        const isEmpty = !appointmentValues.diagnosticosMedicos && 
                        !appointmentValues.dolencias && 
                        !appointmentValues.observacionesAdicionales;

        if (isEmpty && appointments && appointments.length > 1) {
          const latestPopulated = findLatestPopulatedAppointment(appointments, selectedAppointmentDate);
          if (latestPopulated) {
            const suggested = buildAppointmentFormValues(latestPopulated);
            
            // WHITELIST ESTRICTA: Solo estos campos se pueden auto-rellenar
            const medicalFields = {
              diagnosticosMedicos: suggested.diagnosticosMedicos || '',
              dolencias: suggested.dolencias || '',
              medicamentos: suggested.medicamentos || '',
              operaciones: suggested.operaciones || '',
              observacionesAdicionales: suggested.observacionesAdicionales || '',
              diagnosticosReflexologia: suggested.diagnosticosReflexologia || '',
            };

            // Fusionar preservando los datos de la cita actual (como el peso de hoy si ya se puso)
            appointmentValues = { 
              ...appointmentValues, 
              ...medicalFields 
            };
          }
        }
      } catch (autoFillErr) {
        console.error('[PatientHistory] Error en auto-rellenado (protegido):', autoFillErr);
        // Si falla, seguimos con los valores originales de la cita sin el auto-rellenado
      }
    }

    // Calcular pesos dinámicos para la cita seleccionada
    const weightUI = getWeightData(appointments, selectedAppointmentDate);

    // Aplicar TODO al formulario con limpieza garantizada
    form.setFieldsValue({
      ...historyValues,
      ...appointmentValues,
      // Pesos calculados por cita (inicial = 1ra cita, ultimoPeso = cita anterior)
      pesoInicial: weightUI.pesoInicial || historyValues.pesoInicial || '',
      ultimoPeso: weightUI.pesoAnterior || '',
      // EL PESO DE HOY NUNCA SE AUTO-RELLENA (siempre viene de la cita actual o vacío)
      pesoHoy: appointmentValues.pesoHoy || '',
      therapist: appointmentValues.therapist || '',
    });

    // Sincronizar estados auxiliares (Anticonceptivos, Terapeuta)
    if (isFemale && patientHistory.data) {
      const contraData = normalizeContraceptiveData(patientHistory.data);
      setUseContraceptiveMethodState(contraData.useMethod);
      setContraceptiveMethodId(contraData.methodId);
      setDiuTypeId(contraData.diuId);
    }

    // Actualizar estados visuales (Solo basado en la cita seleccionada)
    if (selectedAppointment?.therapist) {
      const tName = formatTherapistName(selectedAppointment.therapist);
      setTherapist(tName);
      setSelectedTherapistId(selectedAppointment.therapist.id);
    } else {
      setTherapist('');
      setSelectedTherapistId(null);
    }

  }, [
    patientId, 
    loadingHistory, 
    loadingAppointments, 
    selectedAppointmentDate, 
    justSaved, 
    appointments, 
    selectedAppointment,
    isFemale,
    form
  ]);

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
          message.success(SUCCESS_MESSAGES.CHANGES_SAVED, 4); 

          // IMPORTANTE: Limpiar el estado "tocado" para evitar alerta de cambios sin guardar
          form.resetFields();
          form.setFieldsValue(values);
          
          // FIX: Marcar que se acaba de guardar para evitar sobrescribir el formulario
          setJustSaved(true);

          // Actualizar campos de peso en el formulario
          updateWeightFieldsAfterSave(form, values);

          // Refrescar datos desde el backend para mantener sincronización
          await Promise.all([
            refetchHistory(),
            refetchAppointments(),
            refetchVitals(),
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
      refetchVitals,
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
                  onChange={handleDateChange}
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
                    onChange={() => { }} // Disabled input
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
          
          {/* Gráfico de Evolución de Peso */}
          <VitalsChart 
            vitals={vitals} 
            appointments={appointments}
            loading={loadingVitals} 
            selectedDate={selectedAppointmentDate} 
          />

          <WeightFields styles={styles} isFemale={isFemale} weightData={weightDataForUI} />

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
        appointments={appointments}
        patient={patient}
      />
    </div>
  );
};

export default PatientHistory;

