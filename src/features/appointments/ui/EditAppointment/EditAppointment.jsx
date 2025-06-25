import {
  Button,
  ConfigProvider,
  Form,
  Modal,
  Radio,
  Table,
  notification,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import FormComponent from '../../../../components/Form/Form';
import CustomSearch from '../../../../components/Search/CustomSearch';
import NewPatient from '../../../patients/ui/RegisterPatient/NewPatient';
import { useAppointments, usePatients } from '../../hook/appointmentsHook';
import styles from '../RegisterAppointment/NewAppointment.module.css';

const EditAppointment = ({ appointmentId, onEditSuccess }) => {
  const [showHourField, setShowHourField] = useState(false);
  const [isPaymentRequired, setIsPaymentRequired] = useState(false);
  const [patientType, setPatientType] = useState('nuevo');
  const [formValues, setFormValues] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreatePatientModalVisible, setIsCreatePatientModalVisible] =
    useState(false);
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  const { getAppointmentDetails, updateExistingAppointment } =
    useAppointments();
  const { patients, loading, setSearchTerm, fetchPatients } = usePatients(true);

  const [form] = Form.useForm();

  useEffect(() => {
    if (appointmentId && patients && patients.length > 0) {
      loadAppointmentData();
    }
    // eslint-disable-next-line
  }, [appointmentId, patients]);

  // Función utilitaria para preseleccionar campos y disparar lógica asociada
  const preselectField = (field, value) => {
    form.setFieldsValue({ [field]: value });
    // Si el campo es payment_type_id, dispara la lógica de precio
    if (field === 'payment_type_id') {
      handlePriceChange(value);
    }
    // Puedes agregar más lógica para otros campos si lo necesitas
  };

  const loadAppointmentData = async () => {
    try {
      const data = await getAppointmentDetails(appointmentId);

      // Buscar paciente en la lista local si no viene en el detalle
      let patientObj = null;
      if (patients && patients.length > 0) {
        const found = patients.find((p) => p.id === data.patient_id);
        if (found) {
          patientObj = {
            id: found.id,
            full_name:
              found.full_name ||
              `${found.paternal_lastname || ''} ${found.maternal_lastname || ''} ${found.name || ''}`.trim(),
          };
        }
      }
      if (patientObj) {
        setSelectedPatient(patientObj);
        setPatientType('continuador');
      }

      // Hora
      let appointmentHour = data.appointment_hour
        ? dayjs(data.appointment_hour, 'HH:mm:ss')
        : null;
      let showHour = !!appointmentHour;

      // Monto
      let paymentValue = data.payment ? String(data.payment) : '';

      const formattedData = {
        appointment_date: data.appointment_date
          ? dayjs(data.appointment_date)
          : null,
        appointment_hour: appointmentHour,
        diagnosis: data.diagnosis || '',
        observation: data.observation || '',
        payment: paymentValue,
        payment_type_id: data.payment_type_id || '',
        patient_id: data.patient_id || '',
        ailments: data.ailments || '',
        surgeries: data.surgeries || '',
        reflexology_diagnostics: data.reflexology_diagnostics || '',
        medications: data.medications || '',
        initial_date: data.initial_date ? dayjs(data.initial_date) : null,
        final_date: data.final_date ? dayjs(data.final_date) : null,
        appointment_type: data.appointment_type || '',
        room: data.room || '',
        // ...otros campos
      };

      console.log('VALORES QUE SE SETEAN EN EL FORMULARIO:', formattedData);

      form.setFieldsValue(formattedData);
      // Preselecciona el tipo de pago y dispara la lógica de precio
      if (data.payment_type_id) {
        preselectField('payment_type_id', data.payment_type_id);
      }
      setShowHourField(showHour);
      setInitialDataLoaded(true);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'No se pudieron cargar los datos de la cita.',
      });
      console.error('Error loading appointment data for edit:', error);
    }
  };

  const handlePriceChange = (price) => {
    console.log('handlePriceChange - nuevo precio:', price);
    form.setFieldsValue({ payment: price });
  };

  const handleSubmit = (values) => {
    setFormValues(values);
    handleUpdate(values);
  };

  const handleUpdate = async (values) => {
    if (isSubmitting) return;

    if (!selectedPatient) {
      notification.error({
        message: 'Error',
        description: 'Debe seleccionar o crear un paciente primero',
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

    if (!values.payment) {
      notification.error({
        message: 'Error',
        description: 'El monto de pago es requerido',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Lógica para determinar appointment_status_id
      const appointmentDate = dayjs(values.appointment_date);
      const currentDate = dayjs();

      let appointment_status_id;
      if (appointmentDate.isBefore(currentDate, 'day')) {
        appointment_status_id = 2; // Pasada
      } else {
        appointment_status_id = 1; // Pendiente
      }

      // Limpiar el valor de payment
      let paymentValue = values.payment;
      if (typeof paymentValue === 'string') {
        paymentValue = paymentValue.replace(/[^\d.]/g, '');
        paymentValue = parseFloat(paymentValue);
      }

      const { appointment_hour, ...formDataWithoutHour } = values;
      const payload = {
        ...formDataWithoutHour,
        ...(showHourField && values.appointment_hour
          ? { appointment_hour: values.appointment_hour }
          : {}),
        appointment_status_id: appointment_status_id,
        patient_id: selectedPatient.id,
      };

      await updateExistingAppointment(appointmentId, payload);

      notification.success({
        message: 'Cita actualizada',
        description: 'La cita se ha actualizado correctamente.',
      });

      if (onEditSuccess) {
        onEditSuccess();
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      let errorMessage =
        'No se pudo actualizar la cita. Por favor intente nuevamente.';

      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      }

      notification.error({
        message: 'Error',
        description: errorMessage,
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsCreatePatientModalVisible(false);
    setIsModalVisible(false);
  };

  const handleOpenCreateModal = () => {
    setIsCreatePatientModalVisible(true);
  };

  const handleOpenSelectModal = () => {
    setIsModalVisible(true);
  };

  const handleChangeSelectedPatient = (newText) => {
    setSelectedPatient(newText);
  };

  const handleLogServerResponse = (result) => {
    if (result && typeof result === 'object') {
      const concatenatedName =
        `${result.name} ${result.paternal_lastname} ${result.maternal_lastname}`.trim();

      const stringified = JSON.stringify(result);

      setSelectedPatient({
        ...result,
        full_name: concatenatedName,
        stringifiedData: stringified,
      });
    } else {
      console.error('El resultado no es un objeto válido:', result);
    }
  };

  const appointmentFields = [
    {
      type: 'customRow',
      fields: [{ type: 'title', label: 'Editar Cita', span: 8 }],
    },
    {
      type: 'customRow',
      fields: [
        {
          name: 'appointment_date',
          type: 'customComponent',
          componentType: 'dateField',
          required: true,
          span: 15,
        },
      ],
    },
    {
      type: 'customRow',
      fields: [
        {
          name: 'patient_id',
          type: 'customComponent',
          componentType: 'patientField',
          label: 'Paciente',
          required: true,
          span: 21,
          props: {
            patientTypeOptions: [
              { label: 'Nuevo', value: 'nuevo' },
              { label: 'Continuador', value: 'continuador' },
            ],
            selectedPatient,
            onChangeSelectedPatient: handleChangeSelectedPatient,
            patientType,
            onPatientTypeChange: (value) => {
              setPatientType(value);
              setSelectedPatient(null);
            },
            onOpenCreateModal: handleOpenCreateModal,
            onOpenSelectModal: handleOpenSelectModal,
          },
        },
      ],
    },
    {
      type: 'customRow',
      fields: [
        {
          name: 'payment_type_id',
          type: 'selectPrices',
          required: true,
          span: 15,
          onChange: handlePriceChange,
        },
      ],
    },
    {
      type: 'customRow',
      fields: [
        {
          name: 'payment',
          type: 'paymentStatus',
          span: 15,
          required: true,
        },
      ],
    },
    {
      type: 'customRow',
      fields: [
        {
          name: 'appointment_hour',
          type: 'customComponent',
          componentType: 'timeField',
          span: 15,
          show: 'showHourField',
        },
      ],
    },
    {
      type: 'customRow',
      fields: [
        {
          type: 'customComponent',
          componentType: 'hourCheckbox',
          span: 8,
        },
      ],
    },
    {
      type: 'customRow',
      fields: [
        {
          type: 'customComponent',
          componentType: 'paymentCheckbox',
          span: 10,
        },
      ],
    },
  ];

  const processedPatients = patients.map((patient, index) => ({
    ...patient,
    key: patient.id || `patient-${index}`,
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
      title: 'Pacientes',
      dataIndex: 'full_name',
      key: 'full_name',
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
            paddingContentHorizontal: 16,
            defaultBg: '#ff3333',
            defaultColor: '#ffffff',
            defaultBorderColor: 'none',
            defaultHoverColor: '#ffffff',
            defaultActiveBg: '#b22525',
            defaultActiveColor: '#ffffff',
          },
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
            colorPrimary: '#1cb54a',
          },
        },
      }}
    >
      <div className={styles.container}>
        {initialDataLoaded && (
          <FormComponent
            key={initialDataLoaded ? 'loaded' : 'loading'}
            form={form}
            fields={appointmentFields}
            mode="edit"
            showHourField={showHourField}
            isPaymentRequired={!isPaymentRequired}
            patientType={patientType}
            onPatientTypeChange={(value) => {
              setPatientType(value);
              setSelectedPatient(null);
            }}
            onShowHourFieldChange={(e) => setShowHourField(e.target.checked)}
            onPaymentRequiredChange={(e) =>
              setIsPaymentRequired(e.target.checked)
            }
            onSubmit={handleSubmit}
            onOpenCreateModal={handleOpenCreateModal}
            onOpenSelectModal={handleOpenSelectModal}
            onCancel={handleCancel}
            submitButtonText="Actualizar"
            onRegisterClick={handleUpdate}
            isSubmitting={isSubmitting}
            onPriceChange={handlePriceChange}
          />
        )}

        {/* MODAL SELECCIONAR CONTRIBUIDOR */}
        <Modal
          title="Seleccionar Contribuidor"
          open={isModalVisible}
          centered
          width={800}
          onCancel={handleCancel}
          footer={[
            <Button key="cancel" onClick={handleCancel}>
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

                setIsModalVisible(false);
                setSelectedRowKey(null);

                notification.success({
                  message: 'Paciente seleccionado',
                  description: `Se ha seleccionado a ${selectedPatient.full_name}`,
                });
              }}
            >
              Seleccionar
            </Button>,
          ]}
          bodyStyle={{ padding: '24px' }}
        >
          <CustomSearch
            placeholder="Buscar por Apellido/Nombre o DNI..."
            onSearch={(value) => setSearchTerm(value)}
            width="100%"
            style={{ marginBottom: 16 }}
          />
          <Table
            dataSource={processedPatients}
            columns={columns}
            pagination={false}
            rowKey="key"
            loading={loading}
            onRow={(record) => ({
              onClick: () => {
                setSelectedRowKey(record.key);
              },
            })}
          />
        </Modal>

        {/* MODAL NUEVO PACIENTE */}
        <Modal
          title="Crear nuevo paciente"
          open={isCreatePatientModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={800}
          destroyOnClose
          bodyStyle={{ overflow: 'hidden' }}
        >
          <NewPatient
            onCancel={handleCancel}
            onSubmit={handleLogServerResponse}
          />
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default EditAppointment;
