import { post } from '../../../services/api/Axios/MethodsGeneral';

export const createPatient = async (data) => {
  try {
    const response = await post('patients', data);
    return response.data;
  } catch (error) {
    console.error('Error en createPatient:', error);
    throw error;
  }
};
