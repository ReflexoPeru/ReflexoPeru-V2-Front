import { useState } from 'react';
import { Modal, Button, Table, Radio, ConfigProvider, Spin } from 'antd'; // 👈 Agregamos ConfigProvider
import Form from '../../../../components/Form/Form';
import styles from '../RegisterAppointment/NewAppointment.module.css';
import { useAppointments, usePatients } from '../../hook/appointmentsHook';
import CustomSearch from '../../../../components/Search/CustomSearch';

const NewAppointment = () => {
  const [showHourField, setShowHourField] = useState(false);
  const [isPaymentRequired, setIsPaymentRequired] = useState(false);
  const [patientType, setPatientType] = useState('nuevo');
  const [paymentOption, setPaymentOption] = useState(null);
  const [customAmount, setCustomAmount] = useState(false);

  // Modal contribuidor
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreatePatientModalVisible, setIsCreatePatientModalVisible] = useState(false);
  const [selectedRowKey, setSelectedRowKey] = useState(null);

  const { submitNewAppointment } = useAppointments();
  const { patients, loading, setSearchTerm } = usePatients(true);

  const paymentOptions = [
    { label: 'Tarifa completa (S/80)', value: 'completa80', amount: 80 },
    { label: 'Tarifa completa (S/50)', value: 'completa50', amount: 50 },
    { label: 'Media tarifa (S/30)', value: 'media', amount: 30 },
    { label: 'Cupón sin costo (S/0)', value: 'cupon', amount: 0 },
    { label: 'Tarifa Personalizada', value: 'custom' },
  ];

  const handlePaymentOptionChange = (value) => {
    setPaymentOption(value);
    setCustomAmount(value === 'custom');
  };

  const handleSubmit = async (values) => {
    console.log('Valores recibidos en handleSubmit:', values);

    if (patientType === 'nuevo') {
      setIsCreatePatientModalVisible(true);
    } else if (patientType === 'continuador') {
      setIsModalVisible(true);
    }
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
          span: 13,
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
          span: 18,
          props: {
            patientTypeOptions: [
              { label: 'Nuevo', value: 'nuevo' },
              { label: 'Continuador', value: 'continuador' },
            ],
          },
        },
      ],
    },
    {
      type: 'customRow',
      fields: [
        {
          type: 'customComponent',
          componentType: 'paymentOptions',
          span: 13,
          props: { paymentOptions },
        },
      ],
    },
    {
      type: 'customRow',
      fields: [
        {
          name: 'payment',
          type: 'customComponent',
          componentType: 'paymentMethod',
          span: 13,
          props: {
            paymentMethods: [
              { label: 'Efectivo', value: 'efectivo' },
              { label: 'Tarjeta', value: 'tarjeta' },
              { label: 'Yape', value: 'yape' },
            ],
          },
        },
      ],
    },
    {
      type: 'customRow',
      fields: [
        {
          type: 'customComponent',
          componentType: 'amountField',
          span: 13,
          props: { paymentOptions },
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
          span: 13,
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
          span: 8,
        },
      ],
    },
  ];


  // Procesar los pacientes para asegurar que tengan keys únicos
  const processedPatients = patients.map((patient, index) => ({
    ...patient,
    key: patient.id || `patient-${index}`, // Usar ID existente o crear uno temporal
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
      key: 'full_name', // Añadir key para la columna
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          // Configuración para el componente Button
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
          // Configuración para el componente Table
          Table: {
            headerBg: '#272727', 
            headerColor: 'rgba(199,26,26,0.88)',
            colorBgContainer: '#272727',                 
            borderColor: '#555555',                  
            rowHoverBg: '#555555',                    
            cellPaddingBlock: 12,                     
            cellPaddingInline: 16, 
          },
          // Configuración para el componente Radio
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
          paymentOption={paymentOption}
          customAmount={customAmount}
          onPaymentOptionChange={handlePaymentOptionChange}
          onPatientTypeChange={(value) => setPatientType(value)}
          onShowHourFieldChange={(e) => setShowHourField(e.target.checked)}
          onPaymentRequiredChange={(e) => setIsPaymentRequired(e.target.checked)}
          onSubmit={handleSubmit}
          submitButtonText={patientType === 'continuador' ? 'Elegir' : 'Crear'}
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
                
                setIsModalVisible(false);
                try {
                  const selectedPatient = processedPatients.find(p => p.key === selectedRowKey);
                  const payload = {
                    patient_id: selectedPatient.id || selectedRowKey,
                    appointment_date: null,
                    // ... otros campos ...
                  };
                  const result = await submitNewAppointment(payload);
                  console.log('Cita enviada correctamente:', result);
                  setSelectedRowKey(null);
                } catch (error) {
                  console.error('Error al enviar la cita:', error);
                }
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
            rowKey="key" // Asegurar que la tabla use la propiedad key
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
        >
          <p>Aquí va tu formulario para crear paciente nuevo</p>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default NewAppointment;