import { Button, ConfigProvider, Modal, Radio, Table, notification } from 'antd';
import { useState } from 'react';
import Form from '../../../../components/Form/Form';
import CustomSearch from '../../../../components/Search/CustomSearch';
import NewPatient from '../../../patients/ui/RegisterPatient/NewPatient';
import { useAppointments, usePatients } from '../../hook/appointmentsHook';
import styles from '../RegisterAppointment/NewAppointment.module.css';

const NewAppointment = () => {
  const [showHourField, setShowHourField] = useState(false);
  const [isPaymentRequired, setIsPaymentRequired] = useState(false);
  const [patientType, setPatientType] = useState('nuevo');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formValues, setFormValues] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal estados
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreatePatientModalVisible, setIsCreatePatientModalVisible] = useState(false);
  const [selectedRowKey, setSelectedRowKey] = useState(null);

  const { submitNewAppointment } = useAppointments();
  const { patients, loading, setSearchTerm, fetchPatients } = usePatients(true);

  const handleServiceChange = (value) => {
    console.log('Servicio seleccionado:', value);
  };

  const handleSubmit = (values) => {
    console.log('Valores del formulario:', values);
    setFormValues(values);
  };

const handleCompleteRegistration = async () => {
  if (isSubmitting) return;
  
  if (!selectedPatient) {
    notification.error({
      message: 'Error',
      description: 'Debe seleccionar o crear un paciente primero'
    });
    return;
  }

  if (!formValues) {
    notification.error({
      message: 'Error',
      description: 'Complete todos los campos del formulario'
    });
    return;
  }

  setIsSubmitting(true);
  
  try {
    const payload = {
      data: {
        ...formValues,
        appointment_date: formValues.appointment_date, // Ya está en formato correcto
        appointment_hour: formValues.appointment_hour || null,
        patient_id: selectedPatient.id,
      }
    };

    console.log('Payload a enviar:', payload);
    
    const result = await submitNewAppointment(payload);
    
    notification.success({
      message: 'Cita registrada',
      description: 'La cita se ha registrado correctamente'
    });

    // Resetear el formulario
    setFormValues(null);
    setSelectedPatient(null);
    setPatientType('nuevo');
    setShowHourField(false);
    setIsPaymentRequired(false);
    
    return result;
  } catch (error) {
    console.error('Error al registrar cita:', error);
    let errorMessage = 'No se pudo registrar la cita. Por favor intente nuevamente.';
    
    if (error.response) {
      errorMessage = error.response.data?.message || errorMessage;
    }
    
    notification.error({
      message: 'Error',
      description: errorMessage
    });
    throw error;
  } finally {
    setIsSubmitting(false);
  }
};

  const handleCreatePatient = async (patientData) => {
    try {
      // Simulación de creación exitosa
      const mockResponse = { 
        id: `new-patient-${Date.now()}`,
        ...patientData,
        full_name: `${patientData.first_name} ${patientData.last_name}`
      };
      
      await fetchPatients();
      
      return mockResponse;
    } catch (error) {
      console.error('Error al crear paciente:', error);
      throw error;
    }
  };

  const handleOpenCreateModal = () => {
    setIsCreatePatientModalVisible(true);
  };

  const handleOpenSelectModal = () => {
    setIsModalVisible(true);
  };

  const appointmentFields = [
    {
      type: 'customRow',
      fields: [{ type: 'title', label: 'Nueva Cita', span: 8 }],
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
          required: true,
          span: 21,
          props: {
            patientTypeOptions: [
              { label: 'Nuevo', value: 'nuevo' },
              { label: 'Continuador', value: 'continuador' },
            ],
            selectedPatient,
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
          type: 'selectPrices',
          required: true,
          span: 15,
          onChange: handleServiceChange,
        },
      ],
    },
    {
      type: 'customRow',
      fields: [
        {
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
          }
        },
      }}
    >
      <div className={styles.container}>
        <Form
          fields={appointmentFields}
          mode="create"
          showHourField={showHourField}
          isPaymentRequired={!isPaymentRequired}
          patientType={patientType}
          onPatientTypeChange={(value) => {
            setPatientType(value);
            setSelectedPatient(null);
          }}
          onShowHourFieldChange={(e) => setShowHourField(e.target.checked)}
          onPaymentRequiredChange={(e) => setIsPaymentRequired(e.target.checked)}
          xd={handleSubmit}
          onOpenCreateModal={handleOpenCreateModal}
          onOpenSelectModal={handleOpenSelectModal}
          submitButtonText="Registrar"
          onRegisterClick={handleCompleteRegistration}
          isSubmitting={isSubmitting}
        />

        {/* MODAL SELECCIONAR CONTRIBUIDOR */}
        <Modal
          title="Seleccionar Contribuidor"
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedRowKey(null);
          }}
          footer={[
            <Button key="cancel" onClick={() => {
              setIsModalVisible(false);
              setSelectedRowKey(null);
            }}>
              Cancelar
            </Button>,
            <Button 
              key="submit" 
              type="primary"
              disabled={!selectedRowKey}
              onClick={async () => {
                if (!selectedRowKey) return;
                
                const selectedPatient = processedPatients.find(p => p.key === selectedRowKey);
                setSelectedPatient(selectedPatient);
                
                setIsModalVisible(false);
                setSelectedRowKey(null);
                
                notification.success({
                  message: 'Paciente seleccionado',
                  description: `Se ha seleccionado a ${selectedPatient.full_name}`
                });
              }}
            >
              Seleccionar
            </Button>
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
            columns={columns}
            pagination={false}
            rowKey="key"
            scroll={{ y: 200 }}
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
          onCancel={() => setIsCreatePatientModalVisible(false)}
          footer={null}
          width={800}
          destroyOnClose
        >
          <NewPatient 
            onSubmit={async (patientData) => {
              try {
                const newPatient = await handleCreatePatient(patientData);
                
                setSelectedPatient({
                  id: newPatient.id,
                  full_name: newPatient.full_name
                });
                
                setIsCreatePatientModalVisible(false);
                
                notification.success({
                  message: 'Paciente creado',
                  description: 'El paciente se ha registrado correctamente'
                });
                
                setPatientType('continuador');
              } catch (error) {
                console.error('Error al crear paciente:', error);
                notification.error({
                  message: 'Error',
                  description: 'No se pudo crear el paciente'
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