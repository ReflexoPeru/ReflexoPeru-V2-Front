// patients/hook/patientHook.js
import { createPatient } from '../service/patientService';
import { format } from 'date-fns';

export const usePatient = () => {
  const submitNewPatient = async (formData) => {
    const payload = {
      document_number: formData.document_number,
      paternal_lastname: formData.paternal_lastname,
      maternal_lastname: formData.maternal_lastname,
      name: formData.name,
      personal_reference: null,
      birth_date: formData.birth_date
        ? format(new Date(formData.birth_date), 'yyyy-MM-dd')
        : null,
      sex: formData.sex,
      primary_phone: formData.primary_phone,
      secondary_phone: null,
      email: formData.email,
      ocupation: formData.occupation || null,
      health_condition: null,
      address: formData.address,
      document_type_id: formData.document_type,
      country_id: 1,
      region_id: formData.region_id,
      province_id: formData.province_id || null,
      district_id: formData.district_id || null,
    };

    try {
      const result = await createPatient(payload);
      return result;
    } catch (error) {
      console.error('Error al enviar datos del paciente:', error);
      throw error;
    }
  };

  return { submitNewPatient };
};
