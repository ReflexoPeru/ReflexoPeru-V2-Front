import { useState } from 'react';
import Form from '../../../../components/Form/Form';
import styles from '../RegisterAppointment/NewAppointment.module.css';

const NewAppointment = () => {
  const [showHourField, setShowHourField] = useState(false);
  const [isPaymentRequired, setIsPaymentRequired] = useState(false);
  const [patientType, setPatientType] = useState('nuevo');
  const [paymentOption, setPaymentOption] = useState(null);
  const [customAmount, setCustomAmount] = useState(false);

  // Opciones actualizadas según la imagen
  const paymentOptions = [
    { label: 'Tarifa completa (S/80)', value: 'completa80', amount: 80 },
    { label: 'Tarifa completa (S/50)', value: 'completa50', amount: 50 },
    { label: 'Media tarifa (S/30)', value: 'media', amount: 30 },
    { label: 'Cupón sin costo (S/0)', value: 'cupon', amount: 0 }, // Asegúrate que amount sea 0
    { label: 'Tarifa Personalizada', value: 'custom' },
  ];

  const handlePaymentOptionChange = (value) => {
    setPaymentOption(value);
    setCustomAmount(value === 'custom');
  };

  const handleSubmit = (values) => {
    console.log('Valores del formulario:', values);
  };

  // Ahora definimos appointmentFields después de paymentOptions
  const appointmentFields = [
    {
      type: 'customRow',
      fields: [
        {
          type: 'title',
          label: 'Nueva Cita',
          span: 8,
        },
      ],
    },
    {
      type: 'customRow',
      fields: [
        {
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
          props: {
            paymentOptions: paymentOptions, // Usamos la constante ya definida
          },
        },
      ],
    },
    {
      type: 'customRow',
      fields: [
        {
          label: "Método de pago",
          name: "metodoPago",
          type: 'paymentStatus',
          span: 13,
          required: true
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
          props: {
            paymentOptions: paymentOptions, // Usamos la constante ya definida
          },
        },
      ],
    },
    {
      type: 'customRow',
      fields: [
        {
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

  return (
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
        onPatientTypeChange={setPatientType}
        onShowHourFieldChange={(e) => setShowHourField(e.target.checked)}
        onPaymentRequiredChange={(e) => setIsPaymentRequired(e.target.checked)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default NewAppointment;
