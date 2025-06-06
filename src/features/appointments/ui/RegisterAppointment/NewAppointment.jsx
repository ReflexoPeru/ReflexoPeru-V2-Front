import { useState } from 'react';
import { Modal, Button, Table, Radio, ConfigProvider } from 'antd'; // 👈 Agregamos ConfigProvider
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
  const { patients } = usePatients();

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

  const handleSubmit = async () => {
    try {
      const payload = {
        patient_id: selectedRowKey,
        appointment_date: null,
        appointment_hour: null,
        therapist_id: null,
        payment: null,
        appointment_type: null,
        social_benefit: null,
        appointment_status_id: null,
        payment_type_id: null,
        final_date: null,
      };
      const result = await submitNewAppointment(payload);
      console.log('Cita enviada correctamente:', result);
    } catch (error) {
      console.error('Error al enviar la cita:', error);
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

  // Datos falsos
  // const data = [
  //   { key: 1, nombres: 'Juan', apellidos: 'Pérez' },
  //   { key: 2, nombres: 'Ana', apellidos: 'Gómez' },
  //   { key: 3, nombres: 'Luis', apellidos: 'Ramírez' },
  // ];

  const columns = [
    {
      title: '',
      dataIndex: 'key',
      width: 50,
      render: (text, record) => (
        <Radio
          checked={selectedRowKey === record.key}
          onChange={() => setSelectedRowKey(record.key)}
        />
      ),
    },
    {
      title: 'Pacientes',
      dataIndex: 'full_name',
    },
    // {
    //   title: 'Apellidos',
    //   dataIndex: 'apellidos',
    // },
    // {
    //   title: 'Apellidos',
    //   dataIndex: 'apellidos',
    // },
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
            colorPrimary: '#1cb54a',                 // Color del radio seleccionado
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

        {/* {patientType === 'continuador' && (
          <Button
            type="primary"
            onClick={() => setIsModalVisible(true)}
            style={{ marginTop: 16 }}
          >
            Elegir Contribuidor
          </Button>
        )} */}

        <Modal
          title="Seleccionar Contribuidor"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button
              key="back"
              onClick={() => setIsModalVisible(false)}
              style={{ backgroundColor: '#b22525', color: '#fff', border: 'none' }}
            >
              Cancelar
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => setIsModalVisible(false)}
              style={{ backgroundColor: '#1cb54a', borderColor: '#1cb54a' }}
            >
              Seleccionar
            </Button>,
          ]}
        >
          <CustomSearch
            placeholder="Buscar por Apellido/Nombre o DNI..."
            onSearch={(value) => console.log('Buscar:', value)}
            width="100%"
            style={{ marginBottom: 16 }}
          />
          <Table
            dataSource={patients}
            columns={columns}
            pagination={false}
            rowKey="key"
            scroll={{ y: 200 }}
          />
        </Modal>

        {/* Modal para crear nuevo paciente */}
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