import { createTherapist } from '../service/staffService';
import { format } from 'date-fns';

export const submitTherapist = async (formData) => {
  const payload = {
    code: null,
    document_number: formData.documentNumber,
    paternal_lastname: formData.lastName,
    maternal_lastname: formData.motherLastName,
    name: formData.firstName,
    personal_reference: null,
    birth_date: formData.birthDate
      ? format(new Date(formData.birthDate), 'yyyy-MM-dd')
      : null,
    sex: formData.gender,
    primary_phone: formData.phone,
    secondary_phone: null,
    email: formData.email,
    address: formData.address || null,
    region_id: formData.region || null,
    province_id: formData.province || null,
    district_id: formData.district || null,
    document_type_id: 1,
  };

  try {
    const response = await createTherapist(payload);
    return response;
  } catch (error) {
    throw error;
  }
};
