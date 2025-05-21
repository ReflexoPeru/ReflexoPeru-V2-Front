import { post } from '../../../services/api/Axios/MethodsGeneral';

export const createTherapist = async (data) => {
  try {
    const response = await post('/tra', data); // <--- endpoint corregido
    return response.data;
  } catch (error) {
    console.error('Error en createTherapist:', error);
    throw error;
  }
};
