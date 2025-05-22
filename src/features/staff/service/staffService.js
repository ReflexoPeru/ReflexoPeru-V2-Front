import { post } from '../../../services/api/Axios/MethodsGeneral';

export const createTherapist = async (data) => {
  try {
    const response = await post('therapists', data);
    return response.data;
  } catch (error) {
    console.error('Error en createTherapist:', error);
    throw error;
  }
};
