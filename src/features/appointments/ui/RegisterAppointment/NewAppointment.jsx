import { useState } from 'react';
import Form from '../../../../components/Form/Form';
import styles from '../RegisterAppointment/NewAppointment.module.css';
import { useAppointments } from '../../hook/appointmentsHook';

const NewAppointment = () => {
  const [showHourField, setShowHourField] = useState(false);
  const [isPaymentRequired, setIsPaymentRequired] = useState(false);
  const [patientType, setPatientType] = useState('nuevo');
  const [paymentOption, setPaymentOption] = useState(null);
  const [customAmount, setCustomAmount] = useState(false);

  const { submitNewAppointment } = useAppointments();

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
        patient_id: 1,
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
          props: {
            paymentOptions: paymentOptions,
          },
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
          props: {
            paymentOptions: paymentOptions,
          },
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
