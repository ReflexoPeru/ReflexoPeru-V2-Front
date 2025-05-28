import { createAppointment } from '../service/appointmentsService';
import { format } from 'date-fns';

export const useAppointments = () => {
  const submitNewAppointment = async () => {
    const payload = {
      appointment_date: format(new Date(), 'yyyy-MM-dd'), // Fecha actual
      appointment_hour: '04:00',
      patient_id: 2,
      therapist_id: 3,
      payment: '50.00',
      appointment_type: 'Terapia individual',
      social_benefit: false,
      appointment_status_id: null,
      payment_type_id: null,
      final_date: null,
    };

    try {
      const result = await createAppointment(payload);
      console.log('Cita creada correctamente:', result);
      return result;
    } catch (error) {
      console.error('Error al crear la cita:', error.response?.data || error);
      throw error;
    }
  };

  return { submitNewAppointment };
};
