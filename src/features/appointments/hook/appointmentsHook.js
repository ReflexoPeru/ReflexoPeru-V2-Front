import { createAppointment } from '../service/appointmentsService';
import { format } from 'date-fns';

export const useAppointment = () => {
  const submitNewAppointment = async (formData) => {
    const payload = {
      appointment_date: formData.appointment_date
        ? format(new Date(formData.appointment_date), 'yyyy-MM-dd')
        : null,
      appointment_hour: formData.appointment_hour || null,
      patient_id: formData.patient_id || null,
      therapist_id: formData.therapist_id || null,
      payment: formData.payment || null,
      appointment_type: formData.appointment_type || null,
      social_benefit: formData.social_benefit || false,
      appointment_status_id: null, // no viene del formulario
      payment_type_id: null, // no viene del formulario
      final_date: null, // no viene del formulario
    };

    try {
      const result = await createAppointment(payload);
      return result;
    } catch (error) {
      console.error('Error al enviar datos de la cita:', error);
      throw error;
    }
  };

  return { submitNewAppointment };
};
